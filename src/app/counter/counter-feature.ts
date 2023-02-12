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
import { ID } from "../todos/todos-feature";

//#region Pure

export interface Count {
  id?: ID;
  value: number;
}

function increment(count: Count, input: number | void): Count {
  const newCount = { ...count };
  if (!input) newCount.value = newCount.value + 1;
  else newCount.value = newCount.value + input;
  return newCount;
}

function decrement(count: Count, input: number | void): Count {
  const newCount = { ...count };
  if (!input) newCount.value = newCount.value - 1;
  else newCount.value = newCount.value - input;
  return newCount;
}

function setCount(count: Count, input: number): Count {
  const newCount = { ...count };
  newCount.value = input;
  return newCount;
}

export const counterLibrary = {
  increment,
  decrement,
  setCount,
};

//#endregion Pure

//#region Streams

export function buildCounterStreams() {
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

export type CounterStreams = ReturnType<typeof buildCounterStreams>;

export function buildCounterHandler(counter: CounterStreams) {
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

export type CounterHandler = ReturnType<typeof buildCounterHandler>;

//#endregion Streams

//#region Facade

export function buildCounterFacade(streams: CounterStreams) {
  return {
    count: streams.count.pipe(map((c) => c.value)),
    double: streams.count.pipe(map((c) => c.value * 2)),
    inc: () => streams.increment.next(),
    dec: () => streams.decrement.next(),
  };
}

//#endregion Facade

export function buildCounter() {
  const counterStreams = buildCounterStreams();
  return {
    counterStreams,
    counterFacade: buildCounterFacade(counterStreams),
    counterHandler: buildCounterHandler(counterStreams),
  };
}
