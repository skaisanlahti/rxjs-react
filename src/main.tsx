import { Global, ThemeProvider } from "@emotion/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "./app/App.context";
import AppModule from "./app/App.module";
import { theme } from "./app/App.styles";
import App from "./app/App.view";
import "./shared/reset.css";

const app = AppModule();

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
