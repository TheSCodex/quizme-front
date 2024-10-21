import React, { useState } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";

function TemplateForm() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    type: "text", // default question type
    question: "",
    options: [], // only relevant for multiple choice
  });

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
      type: "text", // reset after adding
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

  return (
    <div>
      <p className="font-rubik">New Template</p>
      <form className="w-full mt-6 bg-white rounded-md shadow-md p-4 grid grid-cols-4 gap-4">
        <section className="col-span-2">
          <label className="font-rubik">Title</label>
          <input
            type="text"
            className="mt-2 border border-black/15 rounded-sm p-2 w-full"
          />
        </section>
        <section>
          <label className="font-rubik">Category</label>
          <select
            type="text"
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
            type="text"
            className="mt-2 border border-black/15 rounded-sm p-2 w-full"
          >
            <option>Open this select menu</option>
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
                    className="ml-2 text-red-500 absolute right-5"
                    onClick={() => handleRemoveQuestion(index)}
                  >
                    X
                  </button>
                </div>
                <select
                  value={question.type}
                  onChange={(e) => handleQuestionTypeChange(e, index)}
                  className="border border-black/15 rounded-sm p-2 w-full"
                >
                  <option value="text">Text</option>
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="number">Number</option>
                </select>

                {question.type === "multiple-choice" && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <p>Options:</p>
                      <button
                        type="button"
                        className="text-blue-500 ml-2 text-2xl font-bold"
                        onClick={() => handleAddOption(index)}
                      >
                        +
                      </button>
                    </div>
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="relative flex items-center mb-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(e, index, optIndex)
                          }
                          placeholder={`Option ${optIndex + 1}`}
                          className="border border-black/15 rounded-sm p-2 w-full"
                        />
                        <button
                          type="button"
                          className="ml-2 text-red-500 absolute right-5"
                          onClick={() => handleRemoveOption(index, optIndex)}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="bg-[#117acd] rounded-md text-white p-2 mt-2"
            onClick={handleAddQuestion}
          >
            Add Question
          </button>
        </section>
      </form>
    </div>
  );
}

export default TemplateForm;
