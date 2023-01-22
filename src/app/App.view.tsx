import { useEffect } from "react";
import { useApp } from "./App.context";
import { Page } from "./App.styles";
import HeaderView from "./header/Header.view";
export default function App() {
  const app = useApp();

  useEffect(() => {
    const stop = app.start();
    app.todos.getTodos.next();
    return () => stop();
  }, []);

  return (
    <Page>
      <HeaderView />
      <Router />
    </Page>
  );
}
