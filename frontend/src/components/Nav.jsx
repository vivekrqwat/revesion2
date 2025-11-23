import { FaHome, FaComments } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserStore } from "../store/Userstroe";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = UserStore();

  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (location.pathname === "/post") setActiveTab("discussion");
    else setActiveTab("home");
  }, [location.pathname]);

  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  return (
    <nav className="w-full bg-[hsl(215,22%,10%)] text-[hsl(215,40%,96%)] shadow-lg border-b border-[hsl(215,23%,24%)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-wrap justify-between items-center gap-3">

          {/* Logo */}
          <div className="bg-[hsl(215,20%,13%)] px-3 sm:px-4 py-2 rounded-full shadow border border-[hsl(215,23%,24%)]">
            <span className="text-[hsl(215,75%,60%)] font-bold text-xs sm:text-sm md:text-base tracking-wide">
              NOTE_<span className="text-[hsl(215,40%,96%)]">HUB</span>
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Home Tab */}
            <Button
              variant="ghost"
              className={`
                flex items-center gap-2 px-2 sm:px-4 py-2 rounded-lg transition-all font-medium
                ${
                  activeTab === "home"
                    ? "bg-[hsl(215,75%,60%)] text-[hsl(215,30%,10%)] shadow-md"
                    : "text-[hsl(215,40%,90%)] hover:bg-[hsl(215,28%,24%)] hover:text-[hsl(215,75%,60%)]"
                }
              `}
              onClick={() => handleNavigation("home", "/")}
            >
              <FaHome className="text-sm" />
              <span className="hidden sm:inline text-xs sm:text-sm">Home</span>
            </Button>

            {/* Discussion Tab */}
            <Button
              variant="ghost"
              className={`
                flex items-center gap-2 px-2 sm:px-4 py-2 rounded-lg transition-all font-medium
                ${
                  activeTab === "discussion"
                    ? "bg-[hsl(215,75%,60%)] text-[hsl(215,30%,10%)] shadow-md"
                    : "text-[hsl(215,40%,90%)] hover:bg-[hsl(215,28%,24%)] hover:text-[hsl(215,75%,60%)]"
                }
              `}
              onClick={() => handleNavigation("discussion", "/post")}
            >
              <FaComments className="text-sm" />
              <span className="hidden sm:inline text-xs sm:text-sm">Discussion</span>
            </Button>

          </div>

          {/* Logout Button */}
          <Button
            className="
              bg-[hsl(215,75%,60%)]
              px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-lg font-semibold
              hover:bg-[hsl(215,75%,66%)] active:scale-95 transition-all duration-300
              shadow-md hover:shadow-lg hover:shadow-[hsla(215,75%,60%,0.4)]
              text-[hsl(215,30%,10%)]
            "
            onClick={() => logout()}
          >
            Logout
          </Button>

        </div>
      </div>
    </nav>
  );
}
