const isDark = (): boolean => {
  return (
    typeof window !== "undefined" &&
    (window.localStorage?.theme === "dark" ||
      (!("theme" in window?.localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches))
  );
};

export default isDark;
