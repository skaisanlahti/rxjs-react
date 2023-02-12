import { useStream } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../AppContext";
import { TodoCard } from "./TodoCard";

export function TodoList() {
  const { todos } = useApp();
  const items = useStream(todos.items, []);

  return (
    <>
      {items.map((item) => (
        <TodoCard key={item.id} item={item} />
      ))}
    </>
  );
}
