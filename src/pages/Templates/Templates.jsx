import React, { useEffect, useState } from "react";
import { IconPlus, IconFilter } from "@tabler/icons-react";
import { Link } from "react-router-dom";

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
        <div className="relative flex text-[#a1a1a1]">
          <a className="mr-2" href="/templates/new">
            <IconPlus stroke={2} />
          </a>
          <IconFilter stroke={2} />
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
