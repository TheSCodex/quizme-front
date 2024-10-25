import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { createPortal } from "react-dom";
import logo from "../assets/logo.png";
import logot from "../assets/logot.png";
import Fuse from "fuse.js";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import {
  IconHome2,
  IconTemplate,
  IconCheckupList,
  IconSettings,
  IconMenu2,
  IconSearch,
  IconMoonStars,
  IconUser,
  IconSun,
} from "@tabler/icons-react";

function DropdownPortal({ isEditing, logOut, toggleUserSettings }) {
  if (!isEditing) return null;

  return createPortal(
    <div className="font-rubik mt-12 w-48 text-black dark:text-white bg-white dark:bg-[#1f2937] rounded-md absolute z-50 top-5 right-5 shadow-md p-2">
      <button onClick={logOut}>
        <p className="p-2 opacity-50">Logout</p>
      </button>
    </div>,
    document.body
  );
}

DropdownPortal.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  logOut: PropTypes.func.isRequired,
  toggleUserSettings: PropTypes.func.isRequired,
};

function SearchPortal({
  isSearchOpen,
  closeSearch,
  toggleSearch,
  searchQuery,
  handleSearch,
  searchResults,
}) {
  if (!isSearchOpen) return null;

  const handleResultClick = () => {
    closeSearch(); // Close the search portal
  };

  return createPortal(
    <div className="fixed inset-0 bg-gray-800 dark:text-white dark:bg-gray-700 dark:bg-opacity-75 bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative bg-white pt-10 dark:bg-[#1f2937] rounded-lg p-4 shadow-lg w-3/4 lg:w-1/2">
        <button
          onClick={toggleSearch}
          className="absolute top-2 right-3 text-gray-500"
        >
          Close
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          autoFocus
          className="w-full border-black/15 dark:bg-[#374151] bg-slate-200 rounded-sm p-2 focus:outline-none"
        />
        <ul className="mt-4">
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <Link key={index} to={`/template/show/${result.id}`} onClick={handleResultClick}>
                <div className="mb-2 hover:bg-gray-100/60">
                  <li className="rounded-md">{result.title}</li>
                  <li className="rounded-md text-sm opacity-60">
                    By {result.user.name}
                  </li>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 mt-4">No results found</p>
          )}
        </ul>
      </div>
    </div>,
    document.body
  );
}

SearchPortal.propTypes = {
  isSearchOpen: PropTypes.bool.isRequired,
  closeSearch: PropTypes.func.isRequired,
  toggleSearch: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
};

function Layout() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [isDarkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isEditing, setIsEditing] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState([]);
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

  const toggleSearch = () => setSearchOpen(!isSearchOpen);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const fuse = new Fuse(templates, { keys: ["title"] });
    const results = fuse.search(query).map((result) => result.item);
    setSearchResults(results);
  };

  const closeSearch = () => setSearchOpen(false);

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          logOut();
        } else {
          setIsLoggedIn(true);
          setUserData(decodedToken);
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsLoggedIn(true);
        setUserData(decodedToken);
        if (decodedToken.theme) {
          setDarkMode(decodedToken.theme === "dark");
          if (decodedToken.theme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
        if (decodedToken.language) {
          setLanguage(decodedToken.language);
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      const preferredTheme = sessionStorage.getItem("theme");
      if (!preferredTheme) {
        const defaultTheme = "light";
        sessionStorage.setItem("theme", defaultTheme);
        setDarkMode(defaultTheme === "dark");
        if (defaultTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        setDarkMode(preferredTheme === "dark");
        if (preferredTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    }
  }, []);

  const toggleDarkMode = async () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setDarkMode(!isDarkMode);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    if (isLoggedIn && userData.email) {
      try {
        const response = await fetch(import.meta.env.VITE_API_THEME_UPDATE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData.email,
            theme: newTheme,
          }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data.token) {
          if (localStorage.getItem("authToken")) {
            localStorage.setItem("authToken", data.token);
          } else {
            sessionStorage.setItem("authToken", data.token);
          }
          const decodedToken = jwtDecode(data.token);
          setUserData(decodedToken);
        }
      } catch (error) {
        console.error("Error updating theme:", error);
      }
    } else {
      sessionStorage.setItem("theme", newTheme);
    }
  };

  const logOut = () => {
    localStorage.removeItem("authToken") ||
      sessionStorage.removeItem("authToken");
    location.reload();
  };

  const toggleUserSettings = () => {
    setIsEditing(!isEditing);
  };

  const toggleSidebarWidth = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex h-screen">
      <div
        id="sidebar"
        className={`drop-shadow-md z-20 fixed lg:relative h-full duration-300 ${
          isSidebarExpanded ? "w-[180px]" : "w-[60px]"
        } px-3 bg-white text-black dark:bg-[#1f2937] dark:text-white hidden lg:block`}
      >
        <section className="mt-5 flex justify-center items-center">
          <img
            src={isSidebarExpanded ? logo : logot}
            alt="logosmall"
            className={`${isSidebarExpanded ? "w-20" : "w-[30px]"}`}
          />
        </section>
        <div className="mt-4 w-[90%] border border-[#117ACD] mx-auto"></div>
        <ul className="sidebar-menu font-rubik mt-4">
          <li
            className={`${
              isSidebarExpanded ? "block mb-2 mt-2" : "hidden"
            } opacity-50`}
          >
            Menu
          </li>
          <li
            className={`flex items-center py-1 rounded-md hover:cursor-pointer text-[#9e9e9e] hover:text-blue-500 hover:bg-[#3073F1] hover:bg-opacity-15 group ${
              !isSidebarExpanded ? "mb-2" : ""
            }`}
          >
            <a href="/" className="block mr-3">
              <IconHome2 width={32} stroke={2} />
            </a>
            <a className={`${isSidebarExpanded ? "block" : "hidden"} text-lg`}>
              Home
            </a>
          </li>
          <li
            className={`${
              isSidebarExpanded ? "block mb-2 mt-5" : "hidden"
            } opacity-50`}
          >
            App
          </li>
          <li
            className={`flex items-center py-1 rounded-md hover:cursor-pointer text-[#9e9e9e] hover:text-blue-500 hover:bg-[#3073F1] hover:bg-opacity-15 group ${
              !isSidebarExpanded ? "mb-2" : ""
            }`}
          >
            <a href="/templates" className="block mr-3">
              <IconTemplate width={32} stroke={2} />
            </a>
            <a
              href="/templates"
              className={`${isSidebarExpanded ? "block" : "hidden"} text-lg`}
            >
              Templates
            </a>
          </li>
          <li
            className={`flex items-center py-1 rounded-md hover:cursor-pointer text-[#9e9e9e] hover:text-blue-500 hover:bg-[#3073F1] hover:bg-opacity-15 group ${
              !isSidebarExpanded ? "mb-2" : ""
            }`}
          >
            <a className="block mr-3">
              <IconCheckupList width={32} stroke={2} />
            </a>
            <a className={`${isSidebarExpanded ? "block" : "hidden"} text-lg`}>
              Forms
            </a>
          </li>
          {isLoggedIn && userData.role === "admin" && (
            <>
              <li
                className={`${
                  isSidebarExpanded ? "block mb-2 mt-5" : "hidden"
                } opacity-50`}
              >
                Resources
              </li>
              <li className="flex items-center py-1 rounded-md hover:cursor-pointer text-[#9e9e9e] hover:text-blue-500 hover:bg-[#3073F1] hover:bg-opacity-15 group">
                <a className="block mr-3" href="/admin/users">
                  <IconSettings width={32} stroke={2} />
                </a>
                <a
                  href="/admin/users"
                  className={`${
                    isSidebarExpanded ? "block" : "hidden"
                  } text-lg`}
                >
                  Users
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="flex-1 flex flex-col">
        <header className="bg-white drop-shadow-sm p-4 flex items-center justify-between text-black dark:bg-[#1e293b] dark:text-white">
          <div className="flex items-center hover:cursor-pointer">
            <button className="hidden lg:block" onClick={toggleSidebarWidth}>
              <IconMenu2 width={34} color="#a1a1a1" stroke={2} />
            </button>
            <p className="ml-4 font-rubik text-sm opacity-60">
              {isLoggedIn
                ? `How's it going, ${userData.name}?`
                : `How's it going, guest?`}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <button onClick={toggleSearch}>
              <IconSearch width={34} color="#a1a1a1" stroke={2} />
            </button>
            {isSearchOpen && (
              <SearchPortal
                isSearchOpen={isSearchOpen}
                closeSearch={closeSearch}
                toggleSearch={toggleSearch}
                searchQuery={searchQuery}
                handleSearch={handleSearch}
                searchResults={searchResults}
                templates={templates}
              />
            )}
            {isDarkMode ? (
              <IconSun
                width={34}
                color="#a1a1a1"
                stroke={2}
                onClick={toggleDarkMode}
                className="cursor-pointer"
              />
            ) : (
              <IconMoonStars
                width={34}
                color="#a1a1a1"
                stroke={2}
                onClick={toggleDarkMode}
                className="cursor-pointer"
              />
            )}
            {isLoggedIn ? (
              <>
                <IconUser
                  className="cursor-pointer"
                  onClick={toggleUserSettings}
                  width={34}
                  color="#a1a1a1"
                  stroke={2}
                />
                <DropdownPortal
                  isEditing={isEditing}
                  logOut={logOut}
                  toggleUserSettings={toggleUserSettings}
                />
              </>
            ) : (
              <a href="/login">
                <IconUser width={34} color="#a1a1a1" stroke={2} />
              </a>
            )}
          </div>
        </header>
        <div className="lg:hidden bg-white border-t drop-shadow-sm p-4 flex text-black dark:bg-[#1e293b] dark:text-white justify-around">
          <a href="/">
            <IconHome2 width={34} color="#a1a1a1" stroke={2} />
          </a>
          <a href="/templates">
            <IconTemplate width={34} color="#a1a1a1" stroke={2} />
          </a>
          <a href="/forms">
            <IconCheckupList width={34} color="#a1a1a1" stroke={2} />
          </a>
          {isLoggedIn && userData.role === "admin" && (
            <a href="/admin">
              <IconSettings width={34} color="#a1a1a1" stroke={2} />
            </a>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-8 text-black dark:text-white bg-[#f1f5f9] dark:bg-[#0f172a]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
