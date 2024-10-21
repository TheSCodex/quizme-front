import React, { useEffect, useState } from "react";

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState({});
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_TEMPLATES_FETCH);
        if (!response.ok) {
          throw new Error("Failed to fetch templates");
        }
        const data = await response.json();
        setTemplates(data);
        groupTemplatesByCategory(data);
        extractTags(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const groupTemplatesByCategory = (templates) => {
    const grouped = {};
    templates.forEach((template) => {
      const category = template.category || "Uncategorized";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(template);
    });
    setCategories(grouped);
  };

  const extractTags = (templates) => {
    const tagsSet = new Set();
    templates.forEach((template) => {
      template.tags.forEach((tag) => tagsSet.add(tag.name));
    });
    setTags(Array.from(tagsSet));
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleCategorySelection = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleTagSelection = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filterTemplates = () => {
    return templates.filter((template) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(template.category || "Uncategorized");
      const tagMatch =
        selectedTags.length === 0 ||
        selectedTags.every((tag) =>
          template.tags.map((t) => t.name).includes(tag)
        );
      return categoryMatch && tagMatch;
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Group the filtered templates by category
  const groupedFilteredTemplates = () => {
    const grouped = {};
    const filtered = filterTemplates();
    filtered.forEach((template) => {
      const category = template.category || "Uncategorized";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(template);
    });
    return grouped;
  };

  const filteredCategories = groupedFilteredTemplates();

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold mb-4">Templates</h1>
        <div className="relative flex">
          <a href="/templates/new">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-plus"
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
              <path d="M12 5l0 14" />
              <path d="M5 12l14 0" />
            </svg>
          </a>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-adjustments cursor-pointer"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#9e9e9e"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={toggleDropdown}
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
            <path d="M6 4v4" />
            <path d="M6 12v8" />
            <path d="M10 16a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
            <path d="M12 4v10" />
            <path d="M12 18v2" />
            <path d="M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
            <path d="M18 4v1" />
            <path d="M18 9v11" />
          </svg>
          {dropdownVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
              <div className="px-4 py-2 font-bold">Categories</div>
              {Object.keys(categories).map((category) => (
                <div
                  key={category}
                  className={`px-4 py-1 text-sm cursor-pointer hover:bg-gray-200 rounded ${
                    selectedCategories.includes(category) ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleCategorySelection(category)}
                >
                  {capitalizeFirstLetter(category)}
                </div>
              ))}
              <div className="px-4 py-2 font-bold">Tags</div>
              <div className="flex flex-wrap px-4 py-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className={`cursor-pointer text-sm px-2 py-1 m-1 rounded-full text-white ${
                      selectedTags.includes(tag) ? "bg-blue-500" : "bg-gray-400"
                    } hover:bg-blue-600`}
                    onClick={() => handleTagSelection(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="px-4 py-2">
                <button
                  className="text-[#117ACD] hover:underline"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedTags([]);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {Object.keys(filteredCategories).length > 0 ? (
        Object.keys(filteredCategories).map((category) => (
          <div key={category} className="mb-6">
            <h2 className="text-lg mb-2 font-semibold">
              {capitalizeFirstLetter(category)}
            </h2>
            <div className="template-grid grid grid-cols-1 md:grid-cols-4 gap-4">
              {filteredCategories[category].map((template) => (
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
            </div>
          </div>
        ))
      ) : (
        <p>No templates found for the selected filters.</p>
      )}
    </div>
  );
}

export default Templates;
