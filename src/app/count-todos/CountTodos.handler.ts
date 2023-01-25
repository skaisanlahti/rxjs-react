import { filter, merge, tap } from "rxjs";
import { Data } from "../../shared/utils/DataSubject";
import { CounterModuleType } from "../counter/Counter.module";
import { TodoModuleType } from "../todos/Todos.module";

interface Dependencies {
  todos: TodoModuleType;
  counter: CounterModuleType;
}
export default function CountTodosHandler({ counter, todos }: Dependencies) {
  return function start() {
    const onAddOk = todos.addRequest.pipe(
      filter(ok),
      tap(() => counter.increment.next())
    );

    const onRemoveOk = todos.removeRequest.pipe(
      filter(ok),
      tap(() => counter.decrement.next())
    );

    const onResetOk = todos.resetRequest.pipe(
      filter(ok),
      tap(() => counter.reset.next())
    );

    const subscription = merge(onAddOk, onRemoveOk, onResetOk).subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };
}

function ok(value: Data<any>) {
  return value.isSuccess === true && value.data !== undefined;
}
