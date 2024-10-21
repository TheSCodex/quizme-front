import { useState } from "react";
import { Outlet } from "react-router-dom";
import logo from "../assets/logo.png";
import logot from "../assets/logot.png";

function Layout() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebarWidth = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex h-screen">
      <div
        id="sidebar"
        className={`drop-shadow-md z-20 relative h-full duration-300 ${
          isSidebarExpanded ? "w-60" : "w-20"
        } px-3 bg-white`}
      >
        <section className="mt-5 flex justify-center items-center">
          <img
            src={isSidebarExpanded ? logo : logot}
            alt="logosmall"
            className={`${isSidebarExpanded ? "w-20" : "w-10"}`}
          />
        </section>
        <div className="mt-4 w-[90%] border border-[#117ACD] mx-auto"></div>
        <ul className="sidebar-menu font-rubik mt-4 px-3">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-home-2 group-hover:stroke-current group-hover:text-[#117ACD]"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#9e9e9e"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                <path d="M10 12h4v4h-4z" />
              </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-template group-hover:stroke-current group-hover:text-[#117acd]"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#9e9e9e"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 4m0 1a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1z" />
                <path d="M4 12m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                <path d="M14 12l6 0" />
                <path d="M14 16l6 0" />
                <path d="M14 20l6 0" />
              </svg>
            </a>
            <a href="/templates" className={`${isSidebarExpanded ? "block" : "hidden"} text-lg`}>
              Templates
            </a>
          </li>
          <li
            className={`flex items-center py-1 rounded-md hover:cursor-pointer text-[#9e9e9e] hover:text-blue-500 hover:bg-[#3073F1] hover:bg-opacity-15 group ${
              !isSidebarExpanded ? "mb-2" : ""
            }`}
          >
            <a className="block mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-clipboard-list group-hover:stroke-current group-hover:text-[#117ACD]"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#9e9e9e"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                <path d="M9 12l.01 0" />
                <path d="M13 12l2 0" />
                <path d="M9 16l.01 0" />
                <path d="M13 16l2 0" />
              </svg>
            </a>
            <a className={`${isSidebarExpanded ? "block" : "hidden"} text-lg`}>
              Forms
            </a>
          </li>
          <li
            className={`${
              isSidebarExpanded ? "block mb-2 mt-5" : "hidden"
            } opacity-50`}
          >
            Resources
          </li>
          <li className="flex items-center py-1 rounded-md hover:cursor-pointer text-[#9e9e9e] hover:text-blue-500 hover:bg-[#3073F1] hover:bg-opacity-15 group">
            <a className="block mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-settings group-hover:stroke-current group-hover:text-[#117ACD]"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#9e9e9e"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              </svg>
            </a>
            <a className={`${isSidebarExpanded ? "block" : "hidden"} text-lg`}>
              Forms
            </a>
          </li>
        </ul>
      </div>
      <div className="flex-1 z-10 flex flex-col">
        <header className="bg-white border drop-shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center hover:cursor-pointer">
            <button onClick={toggleSidebarWidth}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-menu-2"
                width="34"
                height="34"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#9e9e9e"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 6l16 0" />
                <path d="M4 12l16 0" />
                <path d="M4 18l16 0" />
              </svg>
            </button>
            <p className="ml-4 font-rubik text-sm opacity-60">
              How&apos;s it going, admin?
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-search hover:cursor-pointer"
              width="34"
              height="34"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#9e9e9e"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
              <path d="M21 21l-6 -6" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-moon-stars hover:cursor-pointer"
              width="34"
              height="34"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#9e9e9e"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
              <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
              <path d="M19 11h2m-1 -1v2" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-user-circle"
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
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
              <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
            </svg>
          </div>
        </header>
        <main className="flex-1 p-8 bg-[#f5f5f5] overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
