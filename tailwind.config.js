/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
			fontFamily: {
				sans: ["Noto Sans JP", "Inter", "system-ui", "sans-serif"],
			},
			letterSpacing: {
				"tighter-custom": "-0.03em",
			},
			colors: {
				kuralis: {
					50: "#f9f9f9",
					100: "#f3f3f3",
					200: "#e7e7e7",
					300: "#d5d5d5",
					400: "#bcbcbc",
					500: "#a0a0a0",
					600: "#808080",
					700: "#696969",
					800: "#525252",
					900: "#373737",
				},
				accent: {
					50: "#f7f5f2",
					100: "#eee9e2",
					200: "#ded3c3",
					300: "#c8b8a1",
					400: "#b09c7f",
					500: "#9c8666",
				},
			},
			transitionTimingFunction: {
				natural: "cubic-bezier(0.4, 0.0, 0.2, 1)",
			},
			transitionDuration: {
				400: "400ms",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
