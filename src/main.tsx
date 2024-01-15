import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import "./styles.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { RouterProvider } from "react-router-dom";
import { router } from "./routing";
import "./firebase-config"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router}/>
		</ThemeProvider>
	</React.StrictMode>
);
