const defaultTheme = require("tailwindcss/defaultTheme");
const lightColor = require("daisyui/src/colors/themes")["[data-theme=acid]"];
const darkColor = require("daisyui/src/colors/themes")["[data-theme=night]"];

module.exports = {
  content: ["./components/**/*.tsx", "./pages/**/*.tsx"],
  darkMode: ["class", '[data-theme="dark"]'],
  daisyui: {
    themes: [
      {
        light: {
          ...lightColor,
          "--rounded-btn": "5rem",
          primary: "#3D3B8E",
          secondary: "#91F5AD",
          accent: "#E072A4",
        },
      },
      {
        dark: {
          ...darkColor,
          "--rounded-btn": "5rem",
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Google Sans", ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        28: "7rem",
      },
      letterSpacing: {
        tighter: "-.04em",
      },
      lineHeight: {
        tight: 1.2,
      },
      fontSize: {
        "5xl": "2.5rem",
        "6xl": "2.75rem",
        "7xl": "4.5rem",
        "8xl": "6.25rem",
      },
      boxShadow: {
        sm: "0 5px 10px rgba(0, 0, 0, 0.12)",
        md: "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
};
