import { filter, merge, tap } from "rxjs";
import { Data } from "../../shared/utils/DataSubject";
import { CounterModuleType } from "../counter/CounterModule";
import { TodoModuleType } from "../todos/TodosModule";

interface Dependencies {
  todos: TodoModuleType;
  counter: CounterModuleType;
}
export default function CountTodosHandler({ counter, todos }: Dependencies) {
  return function start() {
    const incrementCountOnTodoAdd = todos.add.pipe(
      filter(ok),
      tap(() => counter.increment.next())
    );

    const decrementCountOnTodoRemove = todos.remove.pipe(
      filter(ok),
      tap(() => counter.decrement.next())
    );

    const resetCountOnTodoReset = todos.reset.pipe(
      filter(ok),
      tap(() => counter.reset.next())
    );

    const subscription = merge(
      incrementCountOnTodoAdd,
      decrementCountOnTodoRemove,
      resetCountOnTodoReset
    ).subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };
}

function ok(value: Data<any>) {
  return value.isSuccess === true && value.data !== undefined;
}
