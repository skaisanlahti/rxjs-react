import { Todo } from "../app/todos/Todos.core";
import { DataSubject } from "../shared/utils/DataSubject";

interface Dependencies {
  todos: DataSubject<Todo[]>;
}

interface Input {
  id: string;
}

export default function DeleteTodo({ todos }: Dependencies) {
  return ({ id }: Input) => {
    const oldtodos = todos.getValue().data ?? [];
    todos.success(oldtodos.filter((item) => item.id !== id));
  };
}
