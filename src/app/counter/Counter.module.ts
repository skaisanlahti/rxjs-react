import { BehaviorSubject, Subject } from "rxjs";
import genId from "../../shared/utils/genId";
import { loadFromStorageToState } from "../../shared/utils/storage";
import { Count } from "./Counter.core";

export type CounterModuleType = ReturnType<typeof CounterModule>;

interface Dependencies {}

export default function CounterModule({}: Dependencies = {}) {
  const count = new BehaviorSubject<Count>({ id: genId(), value: 0 });

  const increment = new Subject<number | void>();
  const decrement = new Subject<number | void>();
  const reset = new Subject<void>();
  const loadCount = new Subject<void>();
  const saveCount = new Subject<Count>();

  loadFromStorageToState("count", count);

  return {
    count,
    reset,
    increment,
    decrement,
    loadCount,
    saveCount,
  };
}
