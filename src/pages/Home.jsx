import React, { useState, useEffect } from "react";

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
          <p className="font-rubik opacity-50 mr-4">Template Gallery</p>
          {showAll ? (
            <svg
              onClick={toggleShowAll}
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-maximize-off cursor-pointer"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#9e9e9e"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 8v-2c0 -.551 .223 -1.05 .584 -1.412" />
              <path d="M4 16v2a2 2 0 0 0 2 2h2" />
              <path d="M16 4h2a2 2 0 0 1 2 2v2" />
              <path d="M16 20h2c.545 0 1.04 -.218 1.4 -.572" />
              <path d="M3 3l18 18" />
            </svg>
          ) : (
            <svg
              onClick={toggleShowAll}
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-maximize cursor-pointer"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#9e9e9e"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
              <path d="M4 16v2a2 2 0 0 0 2 2h2" />
              <path d="M16 4h2a2 2 0 0 1 2 2v2" />
              <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
            </svg>
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
                className="card bg-white shadow-md p-4 rounded"
              >
                <h3 className="font-semibold">{template.title}</h3>
                <p className="font-rubik text-sm opacity-50">
                  By {template.user.name}
                </p>
              </div>
            ))}
        </section>
      )}
      <section className="filled-forms mt-8">
        <p className="font-rubik font-semibold">Filled forms</p>
        <div className="mt-4 w-full p-6 bg-white rounded-md shadow-md">
          <p className="text-xl font-rubik text-center">You have not filled any forms yet</p>
          <p className="font-rubik text-center opacity-50">Click on any of the available templates on the top or search for a specific template to fill out</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
