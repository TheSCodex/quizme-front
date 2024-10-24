import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "draft-js/dist/Draft.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import OptionPercentageChart from "../../utils/percentageChart.jsx";

const Form = () => {
  const { templateId, formId } = useParams();
  const [template, setTemplate] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswers, setNewAnswers] = useState({});
  const [isOwnerOrAdmin, setIsOwnerOrAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  let userData = null;
  if (token) {
    userData = jwtDecode(token);
  }

  const userId = userData?.id;

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

    const fetchAnswers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_FORMS_FETCH}/${formId}` // Fetch answers for specific formId
        );
        if (!response.ok) {
          throw new Error("Failed to fetch answers");
        }
        const formData = await response.json();
        if (formData.answers) {
          const formattedAnswers = formData.answers.reduce((acc, answer) => {
            acc[answer.questionId] = answer.response;
            return acc;
          }, {});
          setNewAnswers(formattedAnswers); // Set existing answers
        }
        setAnswers(formData.answers || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const loadTemplateAndAnswers = async () => {
      const templateData = await fetchTemplateDetails();
      if (templateData) {
        await fetchAnswers();
      }
    };

    loadTemplateAndAnswers();
  }, [templateId, formId]);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!template) {
    return <p>Error loading template</p>;
  }

  return (
    <div className="bg-white dark:bg-[#1f2937] p-6 rounded-md drop-shadow">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{template.title}</h1>
      </div>
      <img
        src={template.picture}
        className="object-cover w-full h-80 mt-2 rounded-md"
        alt={template.title}
      />
      <form onSubmit={handleSubmit} className="flex flex-col mt-4">
        <section className="grid md:grid-cols-2">
          {template.questions.map((question) => (
            <div key={question.id} className="question mb-4 text-center">
              <h2 className="font-semibold mb-2">{question.questionText}</h2>
              <div className="w-full max-w-md mx-auto">
                {question.questionType === "text" && (
                  <input
                    type="text"
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                    value={newAnswers[question.id] || ""}
                    className="border border-black/15 dark:bg-[#374151] rounded-sm p-2 w-full"
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
                    className="border border-black/15 dark:bg-[#374151] rounded-sm p-2 w-full"
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
                        className="mr-2"
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
                        className="mr-2"
                      />
                      <label className="ml-2">{option}</label>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </section>
      </form>
    </div>
  );
};

export default Form;
