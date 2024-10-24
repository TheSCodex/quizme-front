import React, { useState, useEffect } from "react";
import { IconMaximize, IconMaximizeOff } from "@tabler/icons-react";
import { Link } from "react-router-dom";

function Home() {
  const [templates, setTemplates] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_TEMPLATES_FETCH);
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setTemplates(data);
        } else {
          setErrors([
            data.message ||
              "An unexpected error occurred. Please try again later.",
          ]);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
        setErrors(["An unexpected error occurred. Please try again later."]);
      }
    };

    fetchTemplates();
  }, []);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div>
      <section className="top-section flex justify-between">
        <p className="font-rubik font-semibold">Fill out a new Form</p>
        <div className="flex items-center">
          <p className="relative opacity-50 mr-4">Template Gallery</p>
          {showAll ? (
            <IconMaximizeOff
              className="cursor-pointer"
              onClick={toggleShowAll}
              color="#a1a1a1"
              stroke={2}
            />
          ) : (
            <IconMaximize
              className="cursor-pointer"
              onClick={toggleShowAll}
              color="#a1a1a1"
              stroke={2}
            />
          )}
        </div>
      </section>

      {errors.length ? (
        <div className="errors mt-4 text-red-500 text-xs text-center">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      ) : (
        <section className="template-grid grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {templates
            .slice(0, showAll ? templates.length : 4)
            .map((template) => (
              <div
                key={template.id}
                className="card bg-white dark:bg-[#1f2937] shadow-md p-4 rounded flex flex-col"
              >
                <img
                  src={template.picture}
                  alt={template.title}
                  className="w-full h-32 object-cover rounded-t"
                />
                <div className="flex-1">
                  <Link to={`/template/show/${template.id}`}>
                    <h3 className="font-semibold mt-2">{template.title}</h3>
                  </Link>
                  <p className="font-rubik text-sm opacity-50">
                    By {template.user.name}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap">
                  {template.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full mr-1"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </section>
      )}
      <section className="filled-forms mt-8">
        <p className="font-rubik font-semibold">Filled forms</p>
        <div className="mt-4 w-full p-6 bg-white dark:bg-[#1f2937] rounded-md shadow-md">
          <p className="text-xl font-rubik text-center">
            You have not filled any forms yet
          </p>
          <p className="font-rubik text-center opacity-50">
            Click on any of the available templates on the top or search for a
            specific template to fill out
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
