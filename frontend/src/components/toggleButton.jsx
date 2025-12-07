import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get theme from localStorage
    const savedTheme = localStorage.getItem("notehub-theme") || "light";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    const html = document.documentElement;
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("notehub-theme", newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "notehub" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--color-card)] transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-slate-700" />
      ) : (
        <Sun className="h-5 w-5 text-amber-400" />
      )}
    </Button>
  );
}