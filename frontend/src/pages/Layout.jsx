import { useState, useEffect } from "react";
import Navbar from "../components/Nav";
import ProfileRight from "../components/Profile";
import SideLeft from "../components/Sideleft";
import { Outlet } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export function Layout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(() => {
    const saved = localStorage.getItem("sidebarVisible");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarVisible", JSON.stringify(isSidebarVisible));
  }, [isSidebarVisible]);

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      if (isDesktop) {
        setIsSidebarVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300">
      
      {/* Mobile Toggle Button */}
      <button
        className="
          fixed top-3 left-3 z-[60]
          flex items-center justify-center
          w-8 h-8
          bg-[var(--color-card)]
          text-[var(--color-text)] 
          rounded-md
          hover:bg-[var(--border)]
          active:scale-95
          transition-all duration-200
          border border-[var(--border)]
          shadow-md
          md:hidden
        "
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
      >
        {isSidebarVisible ? <FaTimes size={14} /> : <FaBars size={14} />}
      </button>

      {/* Mobile Sidebar Overlay */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          w-52 bg-[var(--color-card)] border-r border-[var(--border)] shadow-lg
          transition-all duration-300 ease-out will-change-transform
          md:hidden
          ${isSidebarVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
        `}
      >
        <SideLeft />
      </aside>

      {/* Desktop Sidebar (Static) */}
      <aside className="
        hidden md:flex flex-col
        w-24 lg:w-28 xl:w-[10%]
        bg-[var(--color-card)] border-r border-[var(--border)] shadow-lg
        transition-colors duration-300
      ">
        <SideLeft />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden transition-colors duration-300">
        
        {/* Navbar */}
        <div className="flex-shrink-0 border-b border-[var(--border)] shadow-sm transition-colors duration-300">
          <Navbar />
        </div>

        {/* Content Layout */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden ">
            <div className="h-full p-2 md:p-4 lg:p-6">
              <div className="max-w-full mx-auto h-full">
                <Outlet />
              </div>
            </div>
          </main>

          {/* Right Sidebar - Profile */}
          <aside className="
            hidden lg:flex flex-col
            w-64 xl:w-72 border-l border-[var(--border)]
            bg-[var(--color-card)] shadow-lg
            overflow-y-auto transition-colors duration-300
          ">
            <ProfileRight />
          </aside>
          
        </div>
      </div>
    </div>
  );
}