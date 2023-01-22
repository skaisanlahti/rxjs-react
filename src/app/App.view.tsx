import { useEffect } from "react";
import { useApp } from "./App.context";
import { Page } from "./App.styles";
import Header from "./header/Header.view";
import Router from "./router/Router.view";

export default function App() {
  const app = useApp();

  useEffect(() => {
    const stop = app.start();
    app.todos.getTodos.next();
    return () => stop();
  }, []);

  return (
    <Page>
      <Header />
      <Router />
    </Page>
  );
}
