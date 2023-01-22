import { Todo } from "../shared/models/Todo";
import { DataSubject } from "../shared/utils/DataSubject";
import genId from "../shared/utils/genId";

interface Dependencies {
  todos: DataSubject<Todo[]>;
}

interface Input {
  title: string;
  description: string;
}

export function AddTodo({ todos }: Dependencies) {
  return ({ title, description }: Input) => {
    const oldtodos = todos.getValue().data ?? [];
    const newTodo = { id: genId(), title, description, done: false };
    todos.success([...oldtodos, newTodo]);
  };
}

// export function AddTodoObs({ todos }: Dependencies) {
//   return ({ title, description }: Input) => {
//     const newTodo = { id: genId(), title, description, done: false };
//     todos.next([...todos.value, newTodo]);
//     return of(true);
//   };
// }
