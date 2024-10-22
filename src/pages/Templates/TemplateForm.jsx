import React, { useState, useCallback } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import { useDropzone } from "react-dropzone";
import { IconTrash } from "@tabler/icons-react";

function TemplateForm() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    type: "text",
    question: "",
    options: [],
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState([]);
  const [accessType, setAccessType] = useState("");

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const handleQuestionTypeChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].type = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { ...newQuestion }]);
    setNewQuestion({
      type: "text",
      question: "",
      options: [],
    });
  };

  const handleQuestionTextChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options.push("");
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (e, questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      setErrors("Only image files are allowed.");
      return;
    }

    const file = acceptedFiles[0];
    file.preview = URL.createObjectURL(file);
    setImage(file);
    setErrors(null);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
    onDropRejected: () => setErrors("Only image files are allowed."),
  });

  const removeImage = (e) => {
    e.stopPropagation();
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", e.target.title.value);
    formData.append("category", e.target.category.value);
    formData.append("accessType", accessType);
    formData.append(
      "description",
      JSON.stringify(editorState.getCurrentContent())
    );
    formData.append("questions", JSON.stringify(questions));

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_TEMPLATES_ADD, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.message || "Something went wrong");
      } else {
        // Handle successful submission (e.g., redirect or show a success message)
      }
    } catch (error) {
      setErrors("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <p className="font-rubik">New Template</p>
      <form
        className="w-full mt-6 bg-white rounded-md shadow-md p-8 grid grid-cols-4 gap-4"
        onSubmit={handleSubmit}
      >
        <section className="col-span-2">
          <label className="font-rubik">Title</label>
          <input
            name="title"
            type="text"
            className="mt-2 border border-black/15 rounded-sm p-2 w-full"
          />
        </section>
        <section>
          <label className="font-rubik">Category</label>
          <select
            name="category"
            className="mt-2 border border-black/15 rounded-sm p-2 w-full"
          >
            <option>Open this select menu</option>
            <option value="education">Education</option>
            <option value="health">Health</option>
            <option value="technology">Technology</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>
        </section>
        <section>
          <label className="font-rubik">Access type</label>
          <select
            value={accessType}
            onChange={(e) => setAccessType(e.target.value)} // Update access type state
            className="mt-2 border border-black/15 rounded-sm p-2 w-full"
          >
            <option value="">Select Access Type</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </section>
        <section className="col-span-4">
          <label className="font-rubik">Description</label>
          <div className="mt-2 border border-black/15 rounded-sm p-2">
            <Editor
              editorState={editorState}
              onEditorStateChange={handleEditorChange}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              toolbarClassName="demo-toolbar"
              placeholder="Write your description here..."
              toolbar={{
                options: [
                  "inline",
                  "blockType",
                  "fontSize",
                  "list",
                  "textAlign",
                  "history",
                ],
                inline: {
                  inDropdown: false,
                  options: ["bold", "italic", "underline"],
                },
                blockType: {
                  inDropdown: true,
                  options: ["Normal", "H1", "H2", "H3", "Blockquote", "Code"],
                },
                fontSize: {
                  inDropdown: true,
                  options: [8, 10, 12, 14, 16, 18, 24, 36],
                },
                list: {
                  inDropdown: false,
                  options: ["unordered", "ordered"],
                },
                textAlign: {
                  inDropdown: false,
                  options: ["left", "center", "right", "justify"],
                },
                history: {
                  inDropdown: false,
                  options: ["undo", "redo"],
                },
              }}
            />
          </div>
        </section>
        <section className="col-span-4">
          <label className="font-rubik">Questions</label>
          <div className="mt-2">
            {questions.map((question, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center justify-between relative">
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => handleQuestionTextChange(e, index)}
                    placeholder="Enter the question"
                    className="mb-2 border border-black/15 rounded-sm p-2 w-full"
                  />
                  <button
                    type="button"
                    className="absolute right-[10px] bottom-[15px]"
                    onClick={() => handleRemoveQuestion(index)}
                  >
                    <IconTrash stroke={2} />
                  </button>
                </div>
                <select
                  value={question.type}
                  onChange={(e) => handleQuestionTypeChange(e, index)}
                  className="border border-black/15 rounded-sm p-2 w-full mb-2"
                >
                  <option value="text">Text</option>
                  <option value="multiple-choice">Multiple Choice</option>
                </select>
                {question.type === "multiple-choice" && (
                  <div>
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center relative"
                      >
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(e, index, optionIndex)
                          }
                          placeholder="Option"
                          className="border border-black/15 rounded-sm p-2 w-full mb-2"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index, optionIndex)}
                          className="absolute right-[10px] bottom-[15px]"
                        >
                          <IconTrash stroke={2} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddOption(index)}
                      className="text-blue-500"
                    >
                      Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddQuestion}
              className="text-blue-500"
            >
              Add Question
            </button>
          </div>
        </section>
        <section className="col-span-4">
          <div
            {...getRootProps()}
            className="border border-black/15 rounded-sm p-4 mt-2 cursor-pointer bg-gray-100 flex justify-center items-center flex-col"
          >
            <input {...getInputProps()} />
            <p>Drag & drop an image here, or click to select one</p>
            {image && (
              <div className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Uploaded"
                  className="h-32 w-auto"
                />
                <button type="button" onClick={removeImage}>
                  <IconTrash stroke={2} />
                </button>
              </div>
            )}
          </div>
          {errors && <p className="text-red-500">{errors}</p>}
        </section>
        <section className="col-span-4">
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-2 w-full"
          >
            Submit
          </button>
        </section>
      </form>
    </div>
  );
}

export default TemplateForm;
