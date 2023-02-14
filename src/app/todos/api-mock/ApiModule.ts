import { BehaviorSubject, Subject, map, timer } from "rxjs";
import todosJson from "../../../shared/todos.json";
import { loadFromStorageToState } from "../../../shared/utils/storage-utils";
import { ID, NewTodo, Todos, todosLibrary } from "../todos-feature";

export type ApiModuleType = ReturnType<typeof ApiModule>;

export default function ApiModule() {
  let todos = todosJson.todos as Todos;
  const mockDelay = new BehaviorSubject(2000);
  const updateDelay = new Subject<number>();

  loadFromStorageToState("delay", mockDelay);

  function resetTodos() {
    return timer(mockDelay.getValue()).pipe(
      map(() => {
        todos = todosJson.todos as Todos;
        return true;
      })
    );
  }

  function getTodos() {
    return timer(mockDelay.getValue()).pipe(
      map(() => {
        return [...todos] as Todos;
      })
    );
  }

  function addTodo({ title, description }: NewTodo) {
    const newTodo = todosLibrary.create(title, description);
    return timer(mockDelay.getValue()).pipe(
      map(() => {
        todos = todosLibrary.add(todos, newTodo);
        return true;
      })
    );
  }

  function deleteTodo({ id }: { id: ID }) {
    return timer(mockDelay.getValue()).pipe(
      map(() => {
        todos = todosLibrary.remove(todos, id);
        return true;
      })
    );
  }

  function checkTodo({ id }: { id: ID }) {
    return timer(mockDelay.getValue()).pipe(
      map(() => {
        todos = todosLibrary.check(todos, id);
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
