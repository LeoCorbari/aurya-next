import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-0':  '#e9e8e3',
        'bg-1':  '#ecebe6',
        'bg-2':  '#d8d7d2',
        'ink-0': '#2b2e34',
        'ink-1': '#4a4f58',
        'ink-2': '#7a7e85',
        'ink-3': '#b3b5b8',
        'stage': '#0a0b0d',
      },
      screens: { xs: '480px' },
      spacing: { '18': '4.5rem' },
    }
  },
  plugins: [],
};
export default config;
