import { Global, ThemeProvider } from "@emotion/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { theme } from "./app/1App.styles";
import { AppProvider } from "./app/1app.context";
import AppModule from "./app/App.module";
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
