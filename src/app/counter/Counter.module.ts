import { BehaviorSubject, Subject } from "rxjs";
import genId from "../../shared/utils/genId";
import { loadFromStorage } from "../../shared/utils/storage";
import { Count } from "./Counter.core";

export type CounterModuleType = ReturnType<typeof CounterModule>;

interface Dependencies {}

export default function CounterModule({}: Dependencies = {}) {
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
