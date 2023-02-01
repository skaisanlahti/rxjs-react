import { map, merge, tap, withLatestFrom } from "rxjs";
import {
  loadFromStorage,
  saveToStorage,
} from "../../shared/utils/storage-utils";
import { Count, decrement, increment, setCount } from "./CounterCore";
import { CounterModuleType } from "./CounterModule";

interface Dependencies {
  counter: CounterModuleType;
}

export default function CounterHandler({ counter }: Dependencies) {
  return function start() {
    const { log } = console;

    // transformations
    const onInc = counter.increment.pipe(
      tap(() => log("increment count")),
      withLatestFrom(counter.count),
      map(([input, count]) => increment(count, input))
    );
    const onDec = counter.decrement.pipe(
      tap(() => log("decrement count")),
      withLatestFrom(counter.count),
      map(([input, count]) => decrement(count, input))
    );
    const onReset = counter.reset.pipe(
      tap(() => log("reset count")),
      withLatestFrom(counter.count),
      map(([_, count]) => setCount(count, 0))
    );

    // state and storage update
    const onActions = merge(onInc, onDec, onReset).pipe(
      tap((count) => counter.count.next(count)),
      tap((count) => counter.saveCount.next(count))
    );

    const onSave = counter.saveCount.pipe(
      map((count) => saveToStorage("count", count))
    );

    // init
    const onLoad = counter.loadCount.pipe(
      map(() => loadFromStorage<Count>("count")),
      tap((count) => {
        if (count !== null) counter.count.next(count);
      })
    );

    const subscription = merge(onActions, onLoad, onSave).subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };
}
