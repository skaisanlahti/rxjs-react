import { useEffect } from "react";
import { useApp } from "./AppContext";
import { Page } from "./AppStyles";
import Header from "./header/Header";
import Router from "./router/Router";

export default function App() {
  const app = useApp();

  useEffect(() => {
    const stop = app.start();
    return () => stop();
  }, []);

  return (
    <Page>
      <Header />
      <Router />
    </Page>
  );
}
