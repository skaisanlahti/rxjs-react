import { useStream } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../build-application";
import { RemoteTodoCard, TodoCard } from "./TodoCard";

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

export function RemoteTodoList() {
  const { remoteTodos } = useApp();
  const items = useStream(remoteTodos.items());

  if (!items) return null;

  return (
    <>
      {items.map((item) => (
        <RemoteTodoCard key={item.id} item={item} />
      ))}
    </>
  );
}
