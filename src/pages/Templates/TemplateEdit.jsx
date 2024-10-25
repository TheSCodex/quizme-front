import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import { useDropzone } from "react-dropzone";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { jwtDecode } from "jwt-decode";

function TemplateEdit() {
  const { templateId } = useParams();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [newQuestion, setNewQuestion] = useState({
    questionType: "text",
    questionText: "",
    options: [],
  });
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [accessType, setAccessType] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [userList, setUserList] = useState([]);
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  let navigate = useNavigate();

  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  let userData = null;
  if (token) {
    userData = jwtDecode(token);
  }

  const isValidRawDraftContentState = (contentState) => {
    if (!contentState) {
      console.error("Content state is null or undefined");
      return false;
    }
    const { blocks, entityMap, selectionBefore, selectionAfter } = contentState;
    if (!blocks || !Array.isArray(Object.values(blocks))) {
      console.error("Invalid blocks structure:", blocks);
      return false;
    }
    if (entityMap === undefined) {
      console.error("Entity map is undefined");
      return false;
    }
    if (!selectionBefore || !selectionAfter) {
      console.error("Selection states are missing");
      return false;
    }
    const blockKeys = Object.keys(blocks);
    if (
      !blockKeys.includes(selectionBefore.anchorKey) ||
      !blockKeys.includes(selectionAfter.anchorKey)
    ) {
      console.error(
        "Selection keys are invalid:",
        selectionBefore,
        selectionAfter
      );
      return false;
    }
    const blockText = blocks[selectionBefore.anchorKey].text;
    if (
      selectionBefore.anchorOffset < 0 ||
      selectionBefore.anchorOffset > blockText.length ||
      selectionAfter.anchorOffset < 0 ||
      selectionAfter.anchorOffset > blockText.length
    ) {
      console.error(
        "Selection offsets are out of bounds:",
        selectionBefore,
        selectionAfter
      );
      return false;
    }
    return true;
  };

  const userId = userData.id;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_USERS_FETCH);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        console.log("API Response:", data);
        if (data.users && Array.isArray(data.users)) {
          setUserList(data.users);
        } else {
          throw new Error("Received data.users is not an array");
        }
      } catch (err) {
        setErrors([err.message]);
      }
    };
    fetchUsers();
  }, []);

  const handleAccessTypeChange = (e) => {
    setAccessType(e.target.value);
    if (e.target.value === "public") {
      setAuthorizedUsers([]);
    }
  };

  const handleUserSelection = (e) => {
    const userId = parseInt(e.target.value);
    if (!authorizedUsers.includes(userId)) {
      setAuthorizedUsers([...authorizedUsers, userId]);
    }
  };

  const handleRemoveUser = (userId) => {
    setAuthorizedUsers(authorizedUsers.filter((id) => id !== userId));
  };

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_TEMPLATES_FETCH_ONE}/${templateId}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData.message);
          setErrors([errorData.message || "Failed to fetch template"]);
          return;
        }
        const templateData = await response.json();
        console.log("Fetched template data:", templateData);
        setTitle(templateData.title);
        setCategory(templateData.category);
        setAccessType(templateData.accessType);
        setTags(templateData.tags);
        setQuestions(templateData.questions);
        const isValidRawDraftContentState = (contentState) => {
          return (
            contentState &&
            contentState.blocks &&
            Array.isArray(contentState.blocks)
          );
        };
        if (templateData.picture) {
          setImageUrl(templateData.picture);
          setImageFile(null);
        }
        if (templateData.description) {
          try {
            const parsedDescription = JSON.parse(templateData.description);
            console.log("Parsed description:", parsedDescription);
            if (isValidRawDraftContentState(parsedDescription)) {
              setEditorState(
                EditorState.createWithContent(convertFromRaw(parsedDescription))
              );
            } else {
              const fallbackSelection = {
                anchorKey: Object.keys(parsedDescription.blockMap)[0],
                anchorOffset: 0,
                focusKey: Object.keys(parsedDescription.blockMap)[0],
                focusOffset: 0,
                isBackward: false,
              };
              parsedDescription.selectionBefore = fallbackSelection;
              parsedDescription.selectionAfter = fallbackSelection;
              setEditorState(
                EditorState.createWithContent(convertFromRaw(parsedDescription))
              );
            }
          } catch (jsonError) {
            console.error("Error parsing description:", jsonError);
            setErrors(["Invalid description format."]);
          }
        }
      } catch (error) {
        console.error("Error fetching template:", error);
        setErrors(["An unexpected error occurred while fetching template."]);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const handleQuestionTypeChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionType = e.target.value;
    if (e.target.value === "text") {
      updatedQuestions[index].options = [];
    }
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        questionType: "text",
        options: [],
        minValue: undefined,
        maxValue: undefined,
      },
    ]);
    setNewQuestion({
      questionType: "text",
      questionText: "",
      options: [],
      minValue: undefined,
      maxValue: undefined,
    });
  };

  const handleQuestionTextChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionText = e.target.value;
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

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags((prevTags) => [...prevTags, tagInput]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      setErrors("Only image files are allowed.");
      return;
    }

    const file = acceptedFiles[0];
    file.preview = URL.createObjectURL(file);
    setImageFile(file);
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

  const removeImage = () => {
    setImageUrl(""); // Clear the URL
    setImageFile(null); // Clear the file
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      title: e.target.title.value,
      category: e.target.category.value,
      accessType: accessType,
      description: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
      questions: questions,
      tags: tags,
      imageUrl: null,
      userId: userId,
    };
    try {
      if (imageFile) {
        const cloudinaryData = new FormData();
        cloudinaryData.append("file", imageFile);
        cloudinaryData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );
        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          {
            method: "POST",
            body: cloudinaryData,
          }
        );
        if (!cloudinaryResponse.ok) {
          const errorData = await cloudinaryResponse.json();
          setErrors([errorData.message || "Image upload failed"]);
          return;
        }
        const cloudinaryResult = await cloudinaryResponse.json();
        payload.imageUrl = cloudinaryResult.secure_url;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_TEMPLATES_UPDATE}/${templateId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        setErrors([errorData.message || "Something went wrong"]);
      } else {
        const data = await response.json();
        console.log("Template updated successfully!");
        navigate(`/template/show/${data.id}`);      }
    } catch (error) {
      setErrors(["An unexpected error occurred. Please try again later."]);
    }
  };

  return (
    <div>
      <p className="font-rubik text-lg md:text-xl">New Template</p>
      <form
        className="w-full mt-6 bg-white dark:bg-[#1f2937] rounded-md shadow-md p-4 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        onSubmit={handleUpdate}
      >
        <section className="md:col-span-2">
          <label className="font-rubik">Title</label>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="mt-2 border border-black/15 dark:bg-[#374151] rounded-sm p-2 w-full"
          />
        </section>
        <section>
          <label className="font-rubik">Category</label>
          <select
            name="category"
            className="mt-2 border border-black/15 dark:bg-[#374151] rounded-sm p-2 w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
            onChange={handleAccessTypeChange}
            className="mt-2 border dark:bg-[#374151] border-black/15 rounded-sm p-2 w-full"
          >
            <option value="">Select Access Type</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </section>
        {accessType === "private" && (
          <section className="md:col-span-4 col-span-1">
            <div className="user-select-section relative">
              <select
                className="mb-2 border dark:bg-[#374151] border-black/15 rounded-sm p-2 w-full"
                onChange={handleUserSelection}
                value=""
              >
                <option value="" disabled>
                  Select a user
                </option>
                {userList.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="selected-users-display md:col-span-4 border border-black/15 dark:bg-[#374151] rounded-sm p-4 mt-2 cursor-pointer bg-gray-100 flex flex-wrap">
              {authorizedUsers.map((userId) => {
                const user = userList.find((user) => user.id === userId);
                return (
                  <span
                    key={userId}
                    className="user-card bg-blue-200 text-blue-800 rounded-full px-3 py-1 mr-2 mb-2 flex items-center"
                  >
                    {user?.name}
                    <button
                      type="button"
                      className="ml-2"
                      onClick={() => handleRemoveUser(userId)}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </section>
        )}
        <section className="md:col-span-4">
          <label className="font-rubik">Description</label>
          <div className="mt-2 dark:bg-[#374151] border border-black/15 rounded-sm p-2">
            <Editor
              editorState={editorState}
              onEditorStateChange={handleEditorChange}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              toolbarClassName="bg-gray-200 border border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
              placeholder="Write your description here..."
              toolbar={{
                options: ["inline", "list", "textAlign", "history"],
                inline: {
                  inDropdown: false,
                  options: ["bold", "italic", "underline"],
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
        <section className="md:col-span-4">
          <label className="font-rubik">Questions</label>
          <div className="mt-2">
            {questions.map((question, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center justify-between relative">
                  <input
                    type="text"
                    value={question.questionText}
                    onChange={(e) => handleQuestionTextChange(e, index)}
                    placeholder="Enter the question"
                    className="mb-2 border dark:bg-[#374151] border-black/15 rounded-sm p-2 w-full"
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
                  value={question.questionType}
                  onChange={(e) => handleQuestionTypeChange(e, index)}
                  className="border border-black/15 dark:bg-[#374151] rounded-sm p-2 w-full mb-2"
                >
                  <option value="text">Text</option>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="number">Number</option>
                </select>
                {question.questionType === "multiple_choice" && (
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
                          className="border dark:bg-[#374151] border-black/15 rounded-sm p-2 w-full mb-2"
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
                {question.questionType === "checkbox" && (
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
                          className="border dark:bg-[#374151] border-black/15 rounded-sm p-2 w-full mb-2"
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
                {question.questionType === "number" && (
                  <div>
                    <input
                      type="number"
                      value={question.minValue || ""}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[index].minValue = e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined;
                        setQuestions(updatedQuestions);
                      }}
                      placeholder="Min Value"
                      className="border dark:bg-[#374151] border-black/15 rounded-sm p-2 w-full mb-2"
                    />
                    <input
                      type="number"
                      value={question.maxValue || ""}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[index].maxValue = e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined;
                        setQuestions(updatedQuestions);
                      }}
                      placeholder="Max Value"
                      className="border dark:bg-[#374151] border-black/15 rounded-sm p-2 w-full mb-2"
                    />
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
        <section className="md:col-span-4">
          <div
            {...getRootProps()}
            className="border border-black/15 dark:bg-[#374151] rounded-sm p-4 mt-2 cursor-pointer bg-gray-100 flex justify-center items-center flex-col"
          >
            <input {...getInputProps()} />
            {imageFile || imageUrl ? (
              ""
            ) : (
              <p>Drag & drop an image here, or click to select one</p>
            )}
            <>
              {imageUrl && (
                <div className="relative">
                  <img src={imageUrl} alt="Uploaded" className="h-32 w-auto" />
                  <button type="button" onClick={removeImage}>
                    <IconTrash stroke={2} />
                  </button>
                </div>
              )}

              {imageFile && (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Uploaded"
                    className="h-32 w-auto"
                  />
                  <button type="button" onClick={removeImage}>
                    <IconTrash stroke={2} />
                  </button>
                </div>
              )}
            </>
          </div>
        </section>
        <section className="md:col-span-4 col-span-1">
          <div className="tag-input-section relative">
            <input
              type="text"
              className="mb-2 border dark:bg-[#374151] border-black/15 rounded-sm p-2 w-full"
              value={tagInput}
              onChange={handleTagInputChange}
              placeholder="Add a tag"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTag();
                  e.preventDefault();
                }
              }}
            />
            <button
              className="absolute right-3 top-2"
              type="button"
              onClick={handleAddTag}
            >
              <IconPlus stroke={2} color="#a1a1a1" />
            </button>
          </div>

          <div className="tags-display md:col-span-4 border border-black/15 dark:bg-[#374151] rounded-sm p-4 mt-2 cursor-pointer bg-gray-100 flex flex-wrap">
            {tags.map((tag, index) => (
              <span key={tag.id} className="tag-card">
                {tag.name}
                <button type="button" onClick={() => handleRemoveTag(tag.id)}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </section>
        {errors && (
          <div className="errors mt-4 text-red-500 text-xs text-center">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        <section className="md:col-span-4">
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

export default TemplateEdit;
