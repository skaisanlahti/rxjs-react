import { BehaviorSubject, Subject, firstValueFrom, map, timer } from "rxjs";
import todosJson from "../../../shared/todos.json";
import { loadFromStorageToState } from "../../../shared/utils/storage-utils";
import { ID, NewTodo, Todos, todoOperations } from "../todos-feature";

export type ApiModuleType = ReturnType<typeof ApiModule>;

export default function ApiModule() {
  let todos = todosJson.todos as Todos;
  const mockDelay = new BehaviorSubject(2000);
  const updateDelay = new Subject<number>();

  loadFromStorageToState("delay", mockDelay);

  function resetTodos() {
    return firstValueFrom(
      timer(mockDelay.getValue()).pipe(
        map(() => {
          todos = todosJson.todos as Todos;
          return true;
        })
      )
    );
  }

  function getTodos() {
    return firstValueFrom(
      timer(mockDelay.getValue()).pipe(
        map(() => {
          return [...todos] as Todos;
        })
      )
    );
  }

  function addTodo({ title, description }: NewTodo) {
    const newTodo = todoOperations.create(title, description);
    return firstValueFrom(
      timer(mockDelay.getValue()).pipe(
        map(() => {
          todos = todoOperations.add(todos, newTodo);
          return true;
        })
      )
    );
  }

  function deleteTodo({ id }: { id: ID }) {
    return firstValueFrom(
      timer(mockDelay.getValue()).pipe(
        map(() => {
          todos = todoOperations.remove(todos, id);
          return true;
        })
      )
    );
  }

  function checkTodo({ id }: { id: ID }) {
    return firstValueFrom(
      timer(mockDelay.getValue()).pipe(
        map(() => {
          todos = todoOperations.check(todos, id);
          return true;
        })
      )
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
