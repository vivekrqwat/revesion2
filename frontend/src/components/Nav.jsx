import { FaHome, FaComments } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserStore } from "../store/Userstroe";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./toggleButton";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = UserStore();

  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    setActiveTab(location.pathname === "/post" ? "discussion" : "home");
  }, [location.pathname]);

  return (
    <nav className="w-full bg-[var(--color-bg)] text-[var(--color-text)] shadow-sm border-b border-[var(--border)] transition-colors duration-300">
      <div className="mx-auto px-3 sm:px-6 py-2 sm:py-4 flex justify-between items-center gap-2 sm:gap-4">
        
        {/* Logo - Smaller on mobile */}
        <div className="flex-shrink-0 bg-[var(--color-card)] px-2 sm:px-4 py-1 sm:py-2 rounded-lg border border-[var(--border)] hover:shadow-md transition-all duration-300 ml-9">
          <span className="text-[var(--primary)] font-bold text-sm sm:text-lg tracking-wider">
         notehub
          </span>
        </div>

        {/* Center Tabs */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className={`
              flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-300
              ${
                activeTab === "home"
                  ? "bg-[var(--primary)] text-white shadow-lg"
                  : "text-[var(--color-text)] hover:bg-[var(--color-card)]"
              }
            `}
          >
            <FaHome size={16} />
            <span className="hidden sm:inline text-sm sm:text-base">Home</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/post")}
            className={`
              flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-300
              ${
                activeTab === "discussion"
                  ? "bg-[var(--primary)] text-white shadow-lg"
                  : "text-[var(--color-text)] hover:bg-[var(--color-card)]"
              }
            `}
          >
            <FaComments size={16} />
            <span className="hidden sm:inline text-sm sm:text-base">Discussion</span>
          </Button>

         
        </div>
         <div className="flex items-center gap-2">
  {/* Theme Toggle Compact Button */}
  <ThemeToggle className="scale-90 sm:scale-100" />

  {/* Logout Button */}
  <Button
    onClick={logout}
    className="bg-[var(--secondary)] hover:opacity-90 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex-shrink-0 text-xs sm:text-sm"
  >
    <span className=" sm:inline">Logout</span>
    {/* <span className="sm:hidden">Logout</span> */}
  </Button>
</div>
        </div>
      
    </nav>
  );
}