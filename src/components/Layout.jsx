import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import logo from "../assets/logo.png";
import logot from "../assets/logot.png";
import { jwtDecode } from "jwt-decode";
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

function Layout() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [isDarkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isEditing, setIsEditing] = useState(false);

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
                <a className="block mr-3">
                  <IconSettings width={32} stroke={2} />
                </a>
                <a
                  className={`${
                    isSidebarExpanded ? "block" : "hidden"
                  } text-lg`}
                >
                  Settings
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="flex-1 z-10 flex flex-col">
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
            <IconSearch width={34} color="#a1a1a1" stroke={2} />
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
              <IconUser
                className="cursor-pointer"
                onClick={toggleUserSettings}
                width={34}
                color="#a1a1a1"
                stroke={2}
              />
            ) : (
              <a href="/login">
                <IconUser width={34} color="#a1a1a1" stroke={2} />
              </a>
            )}
            {isEditing && (
              <div className="z-[1000] font-rubik absolute right-5 mt-12 w-48 bg-white dark:bg-[#1f2937] rounded shadow-lg">
                <p className="px-2 py-4">Edit user Info</p>
                <div className="w-full border border-[#a1a1a1] mx-auto"></div>
                <button onClick={logOut}>
                  <p className="p-2 opacity-50">Logout</p>
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="lg:hidden bg-white border-t drop-shadow-sm p-4 flex justify-around">
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
