import { useState, useEffect } from "react";
import Navbar from "../components/Nav";
import ProfileRight from "../components/Profile";
import SideLeft from "../components/Sideleft";
import { Outlet } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export function Layout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(() => {
    const saved = localStorage.getItem("sidebarVisible");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarVisible", JSON.stringify(isSidebarVisible));
  }, [isSidebarVisible]);

  return (
    <div className="flex h-screen w-full bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300">
      
      {/* Fixed Sidebar - Overlays content, doesn't shrink */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40
          transition-all duration-300 ease-out will-change-transform
          w-28 lg:w-28 xl:w-[10%]
          bg-[var(--color-card)] border-r border-[var(--border)] shadow-lg
          ${isSidebarVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
        `}
      >
        <SideLeft />
      </aside>

      {/* Toggle Button */}
      <button
        className="
          fixed lg:top-6 top-3 left-3 z-50
          flex items-center justify-center
          w-6 h-6 lg:w-8 lg:h-8
          bg-[var(--color-card)]
          text-[var(--color-text)] 
          rounded-md
          hover:bg-[var(--border)]
          active:scale-95
          transition-all duration-200
          border border-[var(--border)]
          shadow-md
        "
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
      >
        {isSidebarVisible ? <FaTimes size={14} /> : <FaBars size={14} />}
      </button>

      {/* Main Content Area - Full width */}
      <div className="flex flex-col flex-1 overflow-hidden transition-colors duration-300">
        
        {/* Navbar */}
        <div className="flex-shrink-0 border-b border-[var(--border)] shadow-sm transition-colors duration-300">
          <Navbar />
        </div>

        {/* Content Layout */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[var(--bg)] transition-colors duration-300">
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