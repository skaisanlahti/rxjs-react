import { combineLatest, map, takeUntil, tap } from "rxjs";
import { DataSubject, Status } from "../../shared/utils/DataSubject";
import createController from "../../shared/utils/createController";
import { CounterModuleType } from "../counter/Counter.module";
import { TodoModuleType } from "../todos/Todos.module";

interface Dependencies {
  todos: TodoModuleType;
  counter: CounterModuleType;
}
export default function CountTodosHandler({ counter, todos }: Dependencies) {
  return function start() {
    const { stopSignal, stop } = createController();

    const sourceEventPairs = new Map([
      [todos.addTodoData, () => counter.increment.next()],
      [todos.deleteTodoData, () => counter.decrement.next()],
      [todos.resetTodosData, () => counter.reset.next()],
    ]);

    emitMappedEventOn("success", sourceEventPairs)
      .pipe(takeUntil(stopSignal))
      .subscribe();

    return stop;
  };
}

function emitMappedEventOn(
  emitOn: Status,
  sourceEventPairs: Map<DataSubject<any>, Function>
) {
  let cache: Status[] = [];
  return combineLatest([...sourceEventPairs.keys()]).pipe(
    map((streams) => {
      return streams.map((stream, index) => {
        if (stream.status !== cache[index] && stream.status === emitOn) {
          cache[index] = stream.status;
          return true;
        }
        cache[index] = stream.status;
        return false;
      });
    }),
    tap((conditions) => {
      for (let i = 0; i < conditions.length; ++i) {
        if (conditions[i]) [...sourceEventPairs.values()][i]();
      }
    })
  );
}
