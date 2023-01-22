import { useStream } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../App.context";
import { TodoCard } from "./TodoCard";

export function TodoList() {
  const app = useApp();
  const todos = useStream(app.todos.getTodosData, (s) => s.data);

  return (
    <>
      {todos?.map((item) => (
        <TodoCard key={item.id} item={item} />
      ))}
    </>
  );
}
