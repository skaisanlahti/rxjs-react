import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  merge,
  switchMap,
  tap,
} from "rxjs";
import { TodoModuleType } from "./TodosModule";

interface Dependencies {
  todos: TodoModuleType;
}

export default function TodoHandler({ todos }: Dependencies) {
  return function start() {
    const refetchTodosAfterMutations = merge(
      todos.add,
      todos.check,
      todos.remove,
      todos.reset
    ).pipe(
      filter(({ data, isSuccess }) => isSuccess === true && data !== undefined),
      switchMap(() => todos.get.send())
    );

    // handle loading indicator
    const requestsLoading = combineLatest([
      todos.get,
      todos.add,
      todos.check,
      todos.remove,
      todos.reset,
    ]).pipe(
      map((values) => values.some(({ isLoading }) => isLoading === true)),
      distinctUntilChanged(),
      tap((value) => todos.todosLoading.next(value))
    );

    const clearFieldsOnAdd = todos.add.pipe(
      filter(({ data, isSuccess }) => isSuccess === true && data !== undefined),
      tap(() => {
        todos.title.next("");
        todos.description.next("");
      })
    );

    // merge all streams and start listening with subscribe
    const subscription = merge(
      refetchTodosAfterMutations,
      requestsLoading,
      clearFieldsOnAdd
    ).subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };
}
