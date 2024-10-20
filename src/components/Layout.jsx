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
        <section
          className={`mt-5 flex ${
            isSidebarExpanded ? "justify-center items-center" : ""
          }`}
        >
          <img
            src={isSidebarExpanded ? logo : logot}
            alt="logosmall"
            className={`mr-4 ml-2 ${isSidebarExpanded ? "w-20" : "w-10"}`}
          />
        </section>
        <div className="mt-4 w-[90%] border border-[#117ACD] mx-auto"></div>
      </div>
      <div className="flex-1 z-10 flex flex-col">
        <header className="bg-white border drop-shadow-sm p-5 flex items-center justify-between">
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
        <main className="flex-1 p-4 bg-[#f5f5f5] overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
