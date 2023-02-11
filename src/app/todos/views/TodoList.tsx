import { useSubscribe } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../AppContext";
import { TodoCard } from "./TodoCard";

export function TodoList() {
  const app = useApp();
  const { data: todos } = useSubscribe(app.todos.get);

  return (
    <>
      {todos?.map((item) => (
        <TodoCard key={item.id} item={item} />
      ))}
    </>
  );
}
