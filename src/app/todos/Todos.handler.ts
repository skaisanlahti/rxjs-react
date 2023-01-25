import { combineLatest, map, merge, switchMap, tap } from "rxjs";
import { TodoModuleType } from "./Todos.module";

interface Dependencies {
  todos: TodoModuleType;
}

export default function TodoHandler({ todos }: Dependencies) {
  return function start() {
    const { log } = console;

    // handle events
    const onGet = todos.get.pipe(
      tap(() => log("get todos")),
      switchMap(todos.getRequest.send),
      tap((items) => {
        todos.items.next(items);
      })
    );
    const onCheck = todos.check.pipe(
      tap(() => log("check todo")),
      switchMap(todos.checkRequest.send)
    );
    const onAdd = todos.add.pipe(
      tap(() => log("add todo")),
      switchMap(todos.addRequest.send),
      tap(() => {
        todos.title.next("");
        todos.description.next("");
      })
    );
    const onRemove = todos.remove.pipe(
      tap(() => log("delete todo")),
      switchMap(todos.removeRequest.send)
    );
    const onReset = todos.reset.pipe(
      tap(() => log("reset todo")),
      switchMap(todos.resetRequest.send)
    );

    // handle refetching todos after actions
    const onActions = merge(onAdd, onCheck, onRemove, onReset).pipe(
      tap(() => todos.get.next())
    );

    // handle loading indicator
    const onLoading = combineLatest([
      todos.addRequest,
      todos.removeRequest,
      todos.checkRequest,
      todos.getRequest,
      todos.resetRequest,
    ]).pipe(
      map((data) => data.some((data) => data.isLoading === true)),
      tap((value) => todos.todosLoading.next(value))
    );

    // merge all streams and start
    const subscription = merge(onActions, onGet, onLoading).subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };
}
