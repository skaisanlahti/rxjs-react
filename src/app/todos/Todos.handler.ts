import { combineLatest, map, merge, switchMap, takeUntil, tap } from "rxjs";
import Controller from "../../shared/utils/Controller";
import { TodoModuleType } from "./Todos.module";

interface Dependencies {
  todos: TodoModuleType;
}

export default function TodoHandler({ todos }: Dependencies) {
  return function start() {
    const { stopSignal, stop } = Controller();
    const { log } = console;

    // handle events
    const get = todos.getTodos.pipe(
      tap(() => log("get todos")),
      switchMap(todos.getTodosLoad)
    );
    const check = todos.checkTodo.pipe(
      tap(() => log("check todo")),
      switchMap(todos.checkTodoLoad)
    );
    const add = todos.addTodo.pipe(
      tap(() => log("add todo")),
      switchMap(todos.addTodoLoad),
      tap(() => {
        todos.title.next("");
        todos.description.next("");
      })
    );
    const remove = todos.deleteTodo.pipe(
      tap(() => log("delete todo")),
      switchMap(todos.deleteTodoLoad)
    );
    const reset = todos.resetTodos.pipe(
      tap(() => log("reset todo")),
      switchMap(todos.resetTodosLoad)
    );

    // handle refetching todos after actions
    const actions = merge(add, check, remove, reset).pipe(
      tap(() => todos.getTodos.next())
    );

    // handle loading indicator
    const loading = combineLatest([
      todos.addTodoData,
      todos.deleteTodoData,
      todos.checkTodoData,
      todos.getTodosData,
      todos.resetTodosData,
    ]).pipe(
      map((data) => data.some((data) => data.isLoading === true)),
      tap((value) => todos.todosLoading.next(value))
    );

    // merge all pipes and start
    merge(actions, get, loading).pipe(takeUntil(stopSignal)).subscribe();

    return stop;
  };
}
