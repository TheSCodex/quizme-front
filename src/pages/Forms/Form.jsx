import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { IconEdit, IconEditOff, IconTrash } from "@tabler/icons-react";
import "draft-js/dist/Draft.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Form = () => {
  const { templateId, formId } = useParams();
  const [template, setTemplate] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [formData, setFormData] = useState([]);
  const [newAnswers, setNewAnswers] = useState({});
  const [isOwnerOrAdmin, setIsOwnerOrAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
  const userRole = userData?.role;

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
        setIsOwnerOrAdmin(data.createdBy === userId || userRole === "admin");
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    const fetchAnswers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_FORMS_FETCH}/${formId}`
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
          setNewAnswers(formattedAnswers);
        }
        setAnswers(formData.answers || []);
        setFormData(formData);
      } catch (error) {
        console.error(error);
        setErrors([
          error ||
            "An unexpected error occurred while trying to get the form. Please try again later.",
        ]);
      } finally {
        setLoading(false);
        console.log("Answers", answers);
        console.log("New Answers", newAnswers);
      }
    };

    const loadTemplateAndAnswers = async () => {
      await fetchTemplateDetails();
      await fetchAnswers();
    };

    loadTemplateAndAnswers();
  }, [templateId, formId, userId]);

  const toggleEdit = () => setIsEditing((prev) => !prev);

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
        console.log("User confirmed deletion. Sending DELETE request...");
        const response = await fetch(
          `${import.meta.env.VITE_API_FORM_DELETE}/${formData.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );  
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response data:", errorData);
          throw new Error(errorData.message);
        }
        await Swal.fire({
          title: "Deleted!",
          text: "Your form has been deleted.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate(-1);
      } catch (error) {
        await Swal.fire({
          title: "Error!",
          text: "There was a problem deleting your form.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      console.log("User canceled deletion.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formId = template.id;
    const answersToSubmit = Object.entries(newAnswers).map(
      ([questionId, response]) => ({
        questionId,
        response,
      })
    );
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_FORM_UPDATE}/${formId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers: answersToSubmit }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      Swal.fire({
        title: "Success!",
        text: "Your answers have been updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating form:", error.message);
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
        <div>
          {isOwnerOrAdmin && isEditing ? (
            <button>
              <IconEditOff onClick={toggleEdit} />
            </button>
          ) : (
            <button>
              <IconEdit onClick={toggleEdit} />
            </button>
          )}
          {isOwnerOrAdmin && (
            <button>
              <IconTrash  onClick={handleDelete}/>
            </button>
          )}
        </div>
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
                    disabled={!isEditing} // Disable if not editing
                    className="border border-gray-300 dark:border-gray-600 text-black rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition"
                    placeholder="Your answer..."
                  />
                )}

                {/* Number Input */}
                {question.questionType === "number" && (
                  <input
                    type="number"
                    min={question.minValue}
                    max={question.maxValue}
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                    value={newAnswers[question.id] || ""}
                    disabled={!isEditing} // Disable if not editing
                    className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition"
                    placeholder="Enter a number..."
                  />
                )}

                {/* Multiple Choice */}
                {question.questionType === "multiple_choice" &&
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
                        onChange={() => handleAnswerChange(question.id, option)}
                        disabled={!isEditing} // Disable if not editing
                        className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-300"
                      />
                      <label className="ml-2">{option}</label>
                    </div>
                  ))}

                {/* Checkbox */}
                {question.questionType === "checkbox" &&
                  question.options.map((option) => (
                    <div
                      key={option}
                      className="flex items-center mb-2 justify-center"
                    >
                      <input
                        type="checkbox"
                        value={option}
                        checked={
                          newAnswers[question.id]?.includes(option) || false
                        }
                        onChange={() =>
                          handleCheckboxChange(question.id, option)
                        }
                        disabled={!isEditing} // Disable if not editing
                        className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-300"
                      />
                      <label className="ml-2">{option}</label>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </section>
        {errors.length > 0 && (
          <div className="errors mt-4 text-red-500 text-xs text-center">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        {isEditing && (
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
          >
            Submit Answers
          </button>
        )}
      </form>
    </div>
  );
};

export default Form;
