import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F2EEE3",
        charcoal: "#1C1B1A",
        pigment: "#2A2825",
        parchment: "#EAE5DA",
        ochre: "#A9823D",
        "label-gray": "#76726A",
        sand: "#B8AD98",
        // Sourced from the sage shawl in "sondos" — reserved for the Journal
        // (tags, story pull-quotes), kept separate from the gallery's ochre.
        teal: "#4A6358",
        "teal-soft": "#8FA69C",
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        editorial: "1400px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [typography],
};

export default config;
