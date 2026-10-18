import React, { useContext } from "react";
import { HiSun, HiMoon } from "react-icons/hi";
import { MdPalette } from "react-icons/md";
import { ThemeContext } from "../context/ThemeContext";

const palettes = [
  { name: "slate", label: "Slate", color: "#64748b" },
  { name: "ocean", label: "Ocean", color: "#3b82f6" },
  { name: "forest", label: "Forest", color: "#22a35a" },
  { name: "lavender", label: "Lavender", color: "#8b5cf6" },
];

const ThemeToggle = () => {
  const { theme, setTheme, palette, setPalette } = useContext(ThemeContext);

  return (
    <div className="flex items-center gap-2 p-2">
      <button
        type="button"
        className="text-primary text-2xl"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <HiSun /> : <HiMoon />}
      </button>
      <div className="relative">
        <details className="group">
          <summary
            className="list-none cursor-pointer text-primary text-2xl"
            aria-label="Choose background color palette"
            title="Choose background color"
          >
            <MdPalette />
          </summary>
          <div className="absolute right-0 top-full z-20 mt-2 flex gap-2 rounded-xl border border-secondary bg-primary p-3 shadow-xl">
            {palettes.map((option) => (
              <button
                key={option.name}
                type="button"
                aria-label={`${option.label} color palette`}
                aria-pressed={palette === option.name}
                title={option.label}
                onClick={(event) => {
                  setPalette(option.name);
                  event.currentTarget.closest("details").open = false;
                }}
                className={`h-8 w-8 rounded-full border-2 ${
                  palette === option.name
                    ? "border-accent ring-2 ring-accent"
                    : "border-secondary"
                }`}
                style={{ backgroundColor: option.color }}
              />
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};

export default ThemeToggle;
