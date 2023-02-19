import { map } from "rxjs";
import { State } from "../../shared/utils/renaming";
import { RemoteTodos } from "../todos/remote-todos";
import { ID } from "../todos/todos-feature";

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

export const counterOperations = {
  increment,
  decrement,
  setCount,
};

export function CounterModule(remoteTodos: RemoteTodos) {
  const count = new State(0);

  remoteTodos.itemCount.subscribe((value) => count.next(value));

  return {
    count: count.asObservable(),
    double: count.pipe(map((value) => value * 2)),
    increment(amount: number) {
      count.next(count.getValue() + amount);
    },
    decrement(amount: number) {
      count.next(count.getValue() - amount);
    },
    reset() {
      count.next(0);
    },
  };
}

export type Counter = ReturnType<typeof CounterModule>;
