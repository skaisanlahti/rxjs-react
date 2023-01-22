import { map, timer } from "rxjs";
import { Todo } from "../app/todos/Todos.core";
import todosJson from "./todos.json";
import genId from "./utils/genId";

export type ApiModuleType = ReturnType<typeof ApiModule>;

export default function ApiModule() {
  let todos = todosJson.todos as Todo[];
  const mockDelay = 500;

  function resetTodos() {
    return timer(mockDelay).pipe(
      map(() => {
        todos = todosJson.todos as Todo[];
        return true;
      })
    );
  }

  function getTodos() {
    return timer(mockDelay).pipe(
      map(() => {
        return [...todos];
      })
    );
  }

  function addTodo({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) {
    const newTodo = { id: genId(), title, description, done: false };
    return timer(mockDelay).pipe(
      map(() => {
        todos = todos.concat(newTodo);
        return true;
      })
    );
  }

  function deleteTodo({ id }: { id: string }) {
    return timer(mockDelay).pipe(
      map(() => {
        todos = todos.filter((todo) => todo.id !== id);
        return true;
      })
    );
  }

  function checkTodo({ id }: { id: string }) {
    return timer(mockDelay).pipe(
      map(() => {
        todos = todos.map((todo) => {
          if (todo.id === id) {
            const newTodo = { ...todo };
            newTodo.done = !newTodo.done;
            return newTodo;
          }
          return todo;
        });
        return true;
      })
    );
  }

  return {
    resetTodos,
    getTodos,
    addTodo,
    deleteTodo,
    checkTodo,
  };
}
