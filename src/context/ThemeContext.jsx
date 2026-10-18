import React, { useState, useEffect, createContext } from "react";

const palettes = ["slate", "ocean", "forest", "lavender"];

const getInitialTheme = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    const storedPrefs = window.localStorage.getItem("color-theme");
    if (typeof storedPrefs === "string") {
      return storedPrefs;
    }

    const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
    if (userMedia.matches) {
      return "dark";
    }
  }
  return "light";
};

const getInitialPalette = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    const storedPalette = window.localStorage.getItem("color-palette");
    if (palettes.includes(storedPalette)) {
      return storedPalette;
    }
  }
  return "slate";
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ initialTheme, children }) => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [palette, setPalette] = useState(getInitialPalette);

  const rawSetTheme = (theme) => {
    const root = window.document.documentElement;
    const isDark = theme === "dark";

    root.classList.remove(isDark ? "light" : "dark");
    root.classList.add(theme);

    localStorage.setItem("color-theme", theme);
  };

  if (initialTheme) {
    rawSetTheme(initialTheme);
  }

  useEffect(() => {
    rawSetTheme(theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    palettes.forEach((name) => root.classList.remove(`palette-${name}`));
    root.classList.add(`palette-${palette}`);
    localStorage.setItem("color-palette", palette);
  }, [palette]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, palette, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
};
