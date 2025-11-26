/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts.tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ---  Custom Colors ---
        primary: "#facc15",
        primaryLight: "#fef08a",
        primaryDark: "#eab308",
        text: "#292524",
        white: "#fff",
        black: "#000",
        rose: "#ef4444",
        otherBubble: "#FFF1BF",
        myBubble: "#FFE1CC",
        green: "#16a34a",
        // --- Neutral Shades ---
        neutral50: "#fafaf9",
        neutral100: "#f5f5f4",
        neutral200: "#e7e5e4",
        neutral300: "#d6d3d1",
        neutral350: "#cccccc",
        neutral400: "#a8a29e",
        neutral500: "#78716c",
        neutral600: "#57534e",
        neutral700: "#44403c",
        neutral800: "#292524",
        neutral900: "#1c1917",
      },
    },
  },
  plugins: [],
}