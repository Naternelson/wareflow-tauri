import { createTheme } from "@mui/material";

export const theme = createTheme({
	palette: {
		mode: "dark", // Enable dark mode
		primary: {
			main: "#f44336",
		},
		secondary: {
			main: "#3f51b5",
		},
		background: {
			default: "#121212", // Dark background color
			paper: "#1E1E1E", // Dark paper color
		},
		text: {
			primary: "#FFFFFF", // White text color
			secondary: "#B0B0B0", // Light gray text color
		},
	},
	typography: {
		htmlFontSize: 16,
		fontSize: 14,
		h1: {
			fontSize: "2.5rem", // Adjust heading 1 font size
		},
		h2: {
			fontSize: "2rem", // Adjust heading 2 font size
		},
		h3: {
			fontSize: "1.75rem", // Adjust heading 3 font size
		},
		h4: {
			fontSize: "1.5rem", // Adjust heading 4 font size
		},
		h5: {
			fontSize: "1.25rem", // Adjust heading 5 font size
		},
		h6: {
			fontSize: "1rem", // Adjust heading 6 font size
		},
		body1: {
			fontSize: "1rem", // Adjust body text font size
		},
		body2: {
			fontSize: "0.875rem", // Adjust smaller body text font size
		},
	},
});
