import {
  BehaviorSubject,
  Subject,
  map,
  merge,
  tap,
  withLatestFrom,
} from "rxjs";
import genId from "../../shared/utils/genId";
import {
  loadFromStorage,
  saveToStorage,
} from "../../shared/utils/storage-utils";

export interface Count {
  id?: string;
  value: number;
}

export function increment(count: Count, input: number | void): Count {
  const newCount = { ...count };
  if (!input) newCount.value = newCount.value + 1;
  else newCount.value = newCount.value + input;
  return newCount;
}

export function decrement(count: Count, input: number | void): Count {
  const newCount = { ...count };
  if (!input) newCount.value = newCount.value - 1;
  else newCount.value = newCount.value - input;
  return newCount;
}

export function setCount(count: Count, input: number): Count {
  const newCount = { ...count };
  newCount.value = input;
  return newCount;
}

export function CounterStreams() {
  return {
    count: new BehaviorSubject<Count>(
      loadFromStorage("count") ?? { id: genId(), value: 0 }
    ),
    increment: new Subject<number | void>(),
    decrement: new Subject<number | void>(),
    reset: new Subject<void>(),
    loadCount: new Subject<void>(),
    saveCount: new Subject<Count>(),
  };
}

export type ICounterStreams = ReturnType<typeof CounterStreams>;

export function CounterHandler(counter: ICounterStreams) {
  const { log } = console;

  const countAfterIncrement = counter.increment.pipe(
    tap(() => log("increment count")),
    withLatestFrom(counter.count),
    map(([input, count]) => increment(count, input))
  );
  const countAfterDecrement = counter.decrement.pipe(
    tap(() => log("decrement count")),
    withLatestFrom(counter.count),
    map(([input, count]) => decrement(count, input))
  );
  const countAfterReset = counter.reset.pipe(
    tap(() => log("reset count")),
    withLatestFrom(counter.count),
    map(([_, count]) => setCount(count, 3))
  );

  const updateStateAndStorage = merge(
    countAfterIncrement,
    countAfterDecrement,
    countAfterReset
  ).pipe(
    tap((count) => counter.count.next(count)),
    tap((count) => counter.saveCount.next(count))
  );

  const handleSaveEvent = counter.saveCount.pipe(
    map((count) => saveToStorage("count", count))
  );

  const handleLoadEvent = counter.loadCount.pipe(
    map(() => loadFromStorage<Count>("count")),
    tap((count) => {
      if (count !== null) counter.count.next(count);
    })
  );

  return merge(updateStateAndStorage, handleLoadEvent, handleSaveEvent);
}

export type ICounterHandler = ReturnType<typeof CounterHandler>;

export function CounterFacade(streams: ICounterStreams) {
  return {
    count: streams.count.pipe(map((c) => c.value)),
    double: streams.count.pipe(map((c) => c.value * 2)),
    inc: () => streams.increment.next(),
    dec: () => streams.decrement.next(),
  };
}

export function buildCounter() {
  const counterStreams = CounterStreams();
  return {
    counterStreams,
    counterFacade: CounterFacade(counterStreams),
    counterHandler: CounterHandler(counterStreams),
  };
}
