import { map, merge, takeUntil, tap, withLatestFrom } from "rxjs";
import Controller from "../../shared/utils/Control";
import { loadFromStorage, saveToStorage } from "../../shared/utils/storage";
import { TodoModuleType } from "../todos/Todos.module";
import { Count, decrement, increment, reset } from "./Counter.core";
import { CounterModuleType } from "./Counter.module";

interface Dependencies {
  counter: CounterModuleType;
  todos: TodoModuleType;
}
export default function CounterHandler({ counter, todos }: Dependencies) {
  return function start() {
    const { stopSignal, stop } = Controller();

    const inc = counter.increment.pipe(
      withLatestFrom(counter.count),
      map(([input, count]) => increment(count, input))
    );

    const dec = counter.decrement.pipe(
      withLatestFrom(counter.count),
      map(([input, count]) => decrement(count, input))
    );

    const zero = counter.reset.pipe(
      withLatestFrom(counter.count),
      map(([_, count]) => reset(count))
    );

    const load = counter.loadCount.pipe(
      map(() => loadFromStorage<Count>("count")),
      tap((count) => {
        if (count !== null) counter.count.next(count);
      })
    );

    const save = counter.saveCount.pipe(
      map((count) => saveToStorage("count", count))
    );

    const actions = merge(inc, dec, zero).pipe(
      tap((count) => counter.count.next(count)),
      tap((count) => counter.saveCount.next(count))
    );

    merge(actions, load, save).pipe(takeUntil(stopSignal)).subscribe();

    return stop;
  };
}
