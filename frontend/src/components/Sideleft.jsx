import {
  BookOpen,
  Share2,
  Globe,
  User,
  Users,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserStore } from "../store/Userstroe";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SideLeft() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = UserStore();

  const items = [
    { icon: BookOpen, label: "Directory", path: "/dir" },
    { icon: Share2, label: "Collaboration", path: "/collab" },
    { icon: Globe, label: "All Dir", path: "/alldir" },
    { icon: Users, label: "All User", path: "/allusers" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="h-full flex flex-col bg-gradient-to-b from-card to-card/50 border-r border-border overflow-y-auto">
      {/* Header with Logo/Title - Mobile optimized */}
      <div className="px-2 sm:px-4 py-2 sm:py-3 border-b border-border/50">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary animate-pulse" />
          <span className="hidden sm:inline text-xs font-semibold text-foreground truncate">
            Navigation
          </span>
        </div>
      </div>

      <div className="flex-1 px-1 sm:px-2 py-2 sm:py-3 space-y-1 sm:space-y-2">
        {/* Profile Button - Visible on mobile/tablet */}
        <Button
          onClick={() => navigate(`profile/${user?._id||user?.id}`)}
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start gap-2 sm:gap-3 lg:hidden transition-all duration-200 hover:translate-x-1",
            isActive(`profile/${user?._id}`)
              ? "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/15"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          )}
          title="Profile"
        >
          <User className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="hidden sm:inline text-xs font-medium truncate">
            Profile
          </span>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>

        {/* Divider */}
        <div className="border-t border-border/30 lg:hidden my-1 sm:my-2" />

        {/* Navigation Items */}
        <nav className="space-y-1 sm:space-y-2">
          {items.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Button
                key={index}
                onClick={() => navigate(item.path)}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-2 sm:gap-3 transition-all duration-200 group hover:translate-x-0.5",
                  active
                    ? "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/15 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
                title={item.label}
              >
                <Icon className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-transform duration-200",
                  active ? "text-primary" : "group-hover:scale-110"
                )} />
                <span className="hidden sm:inline text-xs font-medium truncate">
                  {item.label}
                </span>
                {active && (
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto text-primary" />
                )}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* User Info Footer - Mobile optimized */}
      {/* <div className="px-1 sm:px-2 py-2 sm:py-3 border-t border-border/50 bg-muted/20">
        <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-muted/50 border border-border/30">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500" />
          <span className="hidden sm:inline text-xs text-muted-foreground truncate">
            {user?.username || "User"}
          </span>
          <span className="sm:hidden text-xs text-muted-foreground">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
      </div> */}

      {/* Decorative Footer */}
      <div className="px-2 sm:px-3 py-2 sm:py-3">
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-full" />
      </div>
    </aside>
  );
}