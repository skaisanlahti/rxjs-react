import { useStateSubject } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../App.context";
import { TodoCard } from "./TodoCard";

export function TodoList() {
  const app = useApp();
  const todos = useStateSubject(app.todos.items);

  return (
    <>
      {todos?.map((item) => (
        <TodoCard key={item.id} item={item} />
      ))}
    </>
  );
}
