import { type Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        forum: ["Forum", "sans-serif"],
      },
      textShadow: {
        smwhite: "0 1px 2px rgba(255,255,255,0.5)",
        mdwhite: "0 2px 4px rgba(255,255,255,0.5)",
        lgwhite: "0 8px 16px rgba(255,255,255,0.5)",
        mdblack: "0 2px 4px rgba(0,0,0,0.5)",
      },
      boxShadow: {
        mdblack: "0 2px 4px rgba(0,0,0,0.5)",
        mdwhite: "0 2px 4px rgba(255, 255, 255, 0.5)",
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") },
      );
    }),
  ],
} satisfies Config;
