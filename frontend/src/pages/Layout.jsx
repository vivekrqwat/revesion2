import { useState, useEffect } from "react";
import Navbar from "../components/Nav";
import ProfileRight from "../components/Profile";
import SideLeft from "../components/Sideleft";
import { Outlet } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export function Layout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem("sidebarVisible");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarVisible", JSON.stringify(isSidebarVisible));
  }, [isSidebarVisible]);

  // Auto-show sidebar on desktop when window is resized
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768; // md breakpoint
      if (isDesktop) {
        setIsSidebarVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
<aside
  className={`
    transition-all duration-500 ease-in-out
    ${isSidebarVisible
      ? "w-12 sm:w-14 md:w-16 lg:w-20 xl:w-[9%] opacity-100"
      : "w-0 opacity-0"
    }
    overflow-hidden bg-card border-r border-border shadow-lg
  `}
>
  <SideLeft />
</aside>

      {/* Toggle Button */}
      <div
        className="flex flex-col justify-center items-center w-2 bg-background text-white cursor-pointer md:hidden"
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
      >
        {isSidebarVisible ? <FaArrowLeft /> : <FaArrowRight />}
      </div>


      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <nav className="border-b border-border shadow-sm">
          <Navbar />
        </nav>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="h-full bg-background p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:flex flex-col w-64 xl:w-80 border-l border-border bg-card shadow-sm overflow-y-auto">
            <ProfileRight />
          </aside>
        </div>
      </div>
    </div>
  );
}