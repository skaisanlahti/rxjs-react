import { Todo } from "../shared/models/Todo";
import { DataSubject } from "../shared/utils/data-fetching";

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
