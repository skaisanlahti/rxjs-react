import { useStateSubject } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../App.context";
import { TodoCard } from "./TodoCard";

export function TodoList() {
  const app = useApp();
  const todos = useStateSubject(app.todos.getTodosData, (s) => s.data);

  return (
    <>
      {todos?.map((item) => (
        <TodoCard key={item.id} item={item} />
      ))}
    </>
  );
}