import { Global, ThemeProvider } from "@emotion/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { theme } from "./app/AppStyles";
import { AppProvider, buildApplication } from "./app/build-application";
import "./shared/reset.css";

const app = buildApplication();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider value={app}>
      <ThemeProvider theme={theme}>
        <Global styles={{ html: { fontSize: "16px", overflow: "hidden" } }} />
        <App />
      </ThemeProvider>
    </AppProvider>
  </React.StrictMode>
);
