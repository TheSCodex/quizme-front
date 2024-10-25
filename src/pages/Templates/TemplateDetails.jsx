import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import "draft-js/dist/Draft.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import OptionPercentageChart from "../../utils/percentageChart.jsx";
import { Link } from "react-router-dom";

const TemplateDetails = () => {
  const { templateId } = useParams();
  const [template, setTemplate] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswers, setNewAnswers] = useState({});
  const [isOwnerOrAdmin, setIsOwnerOrAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      try {
        const userData = jwtDecode(token);
        setUserData(userData);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const userId = userData?.id;

  useEffect(() => {
    const fetchFormsAndStatistics = async () => {
      try {
        const formsResponse = await fetch(
          `${import.meta.env.VITE_API_FORMS_BY_TEMPLATE}/${templateId}`
        );
        if (!formsResponse.ok) {
          const errorText = await formsResponse.text();
          console.error("Forms API Error:", errorText);
          throw new Error(errorText);
        }
        const formsData = await formsResponse.json();
        console.log("Fetched Forms Data:", formsData);
        setAnswers(formsData);

        const statisticsResponse = await fetch(
          `${import.meta.env.VITE_API_TEMPLATE_STATISTICS}/${templateId}`
        );
        if (!statisticsResponse.ok) {
          const errorText = await statisticsResponse.text();
          console.error("Statistics API Error:", errorText);
          throw new Error(errorText);
        }
        const statsData = await statisticsResponse.json();
        console.log("Fetched Statistics Data:", statsData);
        setStatistics(statsData);
      } catch (error) {
        setError(error.message);
        console.error("Fetch Error:", error);
      }
    };

    fetchFormsAndStatistics();
  }, [templateId]);

  useEffect(() => {
    const fetchTemplateDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_TEMPLATES_FETCH_ONE}/${templateId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch template");
        }
        const data = await response.json();
        setTemplate(data);
        setIsOwnerOrAdmin(
          data.createdBy === userId || userData.role === "admin"
        );
        return data;
      } catch (error) {
        console.error(error);
        setLoading(false);
        return null;
      }
    };

    const fetchFormsAndAnswers = async (templateData) => {
      if (!templateData) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_FORMS_FETCH}/${templateId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch forms");
        }
        const forms = await response.json();
        console.log("Fetched Forms:", forms);
        if (!Array.isArray(forms)) {
          throw new Error("Expected an array of forms");
        }
        const formattedAnswers = forms.flatMap((form) =>
          form.answers.map((answer) => ({
            id: form.id,
            questionId: answer.questionId,
            response: answer.response,
          }))
        );
        setAnswers(formattedAnswers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const loadTemplateAndAnswers = async () => {
      const templateData = await fetchTemplateDetails();
      await fetchFormsAndAnswers(templateData);
    };

    loadTemplateAndAnswers();
  }, [templateId, userId, userData?.role]);

  const handleAnswerChange = (questionId, response) => {
    setNewAnswers((prev) => ({
      ...prev,
      [questionId]: response,
    }));
  };

  const handleCheckboxChange = (questionId, option) => {
    setNewAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      if (currentAnswers.includes(option)) {
        return {
          ...prev,
          [questionId]: currentAnswers.filter((item) => item !== option),
        };
      } else {
        return {
          ...prev,
          [questionId]: [...currentAnswers, option],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const answersToSubmit = Object.keys(newAnswers).map((questionId) => ({
      questionId,
      response: newAnswers[questionId],
    }));
    try {
      console.log(import.meta.env.VITE_API_FORM_CREATE);
      const response = await fetch(import.meta.env.VITE_API_FORM_CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, answers: answersToSubmit, templateId }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit answers");
      }
      const newAnswerData = await response.json();
      setAnswers((prev) => [...prev, newAnswerData]);
      setNewAnswers({});
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_TEMPLATES_DELETE}/${templateId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }  
        await Swal.fire({
          title: "Deleted!",
          text: "Your template has been deleted.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate(-1);
      } catch (error) {
        console.error("Error deleting form:", error.message);
        await Swal.fire({
          title: "Error!",
          text: "There was a problem deleting your template.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleEdit = (templateId) => {
    navigate(`/template/edit/${templateId}`, { replace: true });
  };

  if (loading) return <div>Loading...</div>;

  if (!template) return <div>Template not found.</div>;

  return (
    <>
      <div className="bg-white dark:bg-[#1f2937] p-6 rounded-md drop-shadow">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">{template.title}</h1>
          {isOwnerOrAdmin && (
            <div>
              <button className="btn btn-primary">
                <IconEdit
                  color="#a1a1a1"
                  stroke={2}
                  onClick={() => handleEdit(templateId)}
                />
              </button>
              <button className="btn btn-primary">
                <IconTrash color="#a1a1a1" stroke={2} onClick={handleDelete} />
              </button>
            </div>
          )}
        </div>
        <img
          src={template.picture}
          className="object-cover w-full h-80 mt-2 rounded-md"
          alt={template.title}
        />
        <form onSubmit={handleSubmit} className="flex flex-col mt-4">
          <section className="grid md:grid-cols-2 gap-6">
            {template.questions.map((question) => (
              <div
                key={question.id}
                className="mb-4 question p-4 bg-slate-200 rounded-lg drop-shadow dark:bg-[#374151]"
              >
                <h2 className="font-semibold text-lg text-center mb-4">
                  {question.questionText}
                </h2>
                <div className="w-full max-w-md mx-auto">
                  {question.questionType === "text" && (
                    <input
                      type="text"
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      value={newAnswers[question.id] || ""}
                      className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition"
                      placeholder={`Your answer...`}
                    />
                  )}
                  {question.questionType === "number" && (
                    <input
                      type="number"
                      min={question.minValue}
                      max={question.maxValue}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      value={newAnswers[question.id] || ""}
                      className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition"
                      placeholder={`Enter a number...`}
                    />
                  )}
                  {question.questionType === "multiple_choice" &&
                    question.options &&
                    question.options.map((option) => (
                      <div
                        key={option}
                        className="flex items-center mb-2 justify-center"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={newAnswers[question.id] === option}
                          onChange={() =>
                            handleAnswerChange(question.id, option)
                          }
                          className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-300"
                        />
                        <label className="ml-2">{option}</label>
                      </div>
                    ))}
                  {question.questionType === "checkbox" &&
                    question.options &&
                    question.options.map((option) => (
                      <div
                        key={option}
                        className="flex items-center mb-2 justify-center"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          checked={newAnswers[question.id]?.includes(option)}
                          onChange={() =>
                            handleCheckboxChange(question.id, option)
                          }
                          className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-300"
                        />
                        <label className="ml-2">{option}</label>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </section>

          <button
            type="submit"
            className="btn btn-success bg-[#117ACD] text-white font-rubik p-2 mx-auto rounded-md"
          >
            Submit Answers
          </button>
        </form>
      </div>
      {isOwnerOrAdmin && (
        <div className="answer-statistics mt-6 grid md:grid-cols-2 gap-6 bg-white dark:bg-[#1f2937] p-6 rounded-md drop-shadow">
          <div className="answers w-full col-span-1">
            <h2 className="font-bold mb-2">Submitted Forms</h2>
            {answers.map((answer) => (
              <Link
                key={answer.id}
                to={`/form/${templateId}/${answer.id}`}
                className="answer-miniature bg-gray-200 dark:bg-[#374151] p-2 rounded mb-2 block"
              >
                <div className="font-semibold">{answer.user}</div>
                <div className="text-sm">
                  {new Date(answer.createdAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
          <div className="statistics w-full col-span-1">
            <h2 className="font-bold mb-2">Statistics</h2>
            {statistics ? (
              <div className="bg-gray-200 dark:bg-[#374151] p-6 rounded-md">
                <p className="text-lg font-semibold mb-2">
                  Total Forms:
                  <span className="ml-1">{statistics.totalForms}</span>
                </p>
                <p className="text-lg font-semibold mb-2">
                  Most Repeated Answer:
                  <span className="ml-1">{statistics.mostRepeatedAnswer}</span>
                </p>
                <p className="text-lg font-semibold mb-4">
                  Most Chosen Option:
                  <span className="ml-1">{statistics.mostChosenAnswer}</span>
                </p>
                {statistics.optionPercentages &&
                typeof statistics.optionPercentages === "object" &&
                Object.keys(statistics.optionPercentages).length > 0 ? (
                  <div className="mt-6">
                    <OptionPercentageChart
                      optionPercentages={statistics.optionPercentages}
                    />
                  </div>
                ) : (
                  <p>No data available for the chart.</p>
                )}
              </div>
            ) : (
              <p>No statistics available.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TemplateDetails;
