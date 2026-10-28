import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { MoonIcon, SunIcon } from "./Icons";
import { applyTheme, initialTheme, toggleTheme, watchSystemTheme, type Theme } from "../lib/theme";

interface ThemeToggleProps {
  className?: string;
}

/** Light/dark switch. Remembers the choice and follows the system until then. */
export default function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const start = initialTheme();
    setTheme(start);
    applyTheme(start);
    return watchSystemTheme((t) => {
      setTheme(t);
      applyTheme(t);
    });
  }, []);

  const dark = theme === "dark";

  return (
    <Button
      size="sm"
      variant="outline"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={className}
      onPress={() => setTheme(toggleTheme())}
    >
      {dark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </Button>
  );
}
