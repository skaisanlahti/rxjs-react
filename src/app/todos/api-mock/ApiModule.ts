import { BehaviorSubject, Subject, map, timer } from "rxjs";
import todosJson from "../../../shared/todos.json";
import genId from "../../../shared/utils/genId";
import { loadFromStorageToState } from "../../../shared/utils/storage-utils";
import { Todo } from "../TodosCore";

export type ApiModuleType = ReturnType<typeof ApiModule>;

export default function ApiModule() {
  let todos = todosJson.todos as Todo[];
  const mockDelay = new BehaviorSubject(500);
  const updateDelay = new Subject<number>();

  loadFromStorageToState("delay", mockDelay);

  function resetTodos() {
    return timer(mockDelay.getValue()).pipe(
      map(() => {
        todos = todosJson.todos as Todo[];
        return true;
      })
    );
  }

  function getTodos() {
    return timer(mockDelay.getValue()).pipe(
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
    return timer(mockDelay.getValue()).pipe(
      map(() => {
        todos = todos.concat(newTodo);
        return true;
      })
    );
  }

  function deleteTodo({ id }: { id: string }) {
    return timer(mockDelay.getValue()).pipe(
      map(() => {
        todos = todos.filter((todo) => todo.id !== id);
        return true;
      })
    );
  }

  function checkTodo({ id }: { id: string }) {
    return timer(mockDelay.getValue()).pipe(
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
    mockDelay,
    updateDelay,
    resetTodos,
    getTodos,
    addTodo,
    deleteTodo,
    checkTodo,
  };
}
