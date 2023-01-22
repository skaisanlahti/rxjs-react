import { BehaviorSubject } from "rxjs";
import { Todo } from "../app/todos/Todos.core";

interface Dependencies {
  todos: BehaviorSubject<Todo[]>;
}

interface Input {
  id: string;
}

export default function CheckTodo({ todos }: Dependencies) {
  return ({ id }: Input) => {
    todos.next(
      todos.value.map((item) => {
        if (item.id === id) item.done = !item.done;
        return item;
      })
    );
  };
}
