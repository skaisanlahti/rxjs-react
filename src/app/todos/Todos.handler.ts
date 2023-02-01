import { combineLatest, filter, map, merge, tap } from "rxjs";
import { TodoModuleType } from "./Todos.module";

interface Dependencies {
  todos: TodoModuleType;
}

export default function TodoHandler({ todos }: Dependencies) {
  return function start() {
    // handle refetching todos after actions
    const onActions = merge(
      todos.add,
      todos.check,
      todos.remove,
      todos.reset
    ).pipe(
      filter(({ data, isSuccess }) => isSuccess === true && data !== undefined),
      tap(() => todos.get.send())
    );

    // handle loading indicator
    const onLoading = combineLatest([
      todos.get,
      todos.add,
      todos.check,
      todos.remove,
      todos.reset,
    ]).pipe(
      map((values) => values.some(({ isLoading }) => isLoading === true)),
      tap((value) => todos.todosLoading.next(value))
    );

    // merge all streams and start
    const subscription = merge(onActions, onLoading).subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };
}
