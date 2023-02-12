import { merge, tap } from "rxjs";
import { CounterHandler, CounterStreams } from "../counter/counter-feature";
import { TodoStreams, TodosHandler } from "../todos/todos-feature";

export function buildCountTodosHandler(
  counter: CounterStreams,
  todos: TodoStreams,
  // this handler only fires events and requires other handlers to deal with them
  dependencies: { todosHandler: TodosHandler; counterHandler: CounterHandler }
) {
  const incrementCountOnTodoAdd = todos.addTodo.pipe(
    tap(() => counter.increment.next())
  );

  const decrementCountOnTodoRemove = todos.removeTodo.pipe(
    tap(() => counter.decrement.next())
  );

  const resetCountOnTodoReset = todos.resetTodos.pipe(
    tap(() => counter.reset.next())
  );

  const requiredHandlers = merge(
    dependencies.todosHandler,
    dependencies.counterHandler
  );

  return merge(
    requiredHandlers,
    incrementCountOnTodoAdd,
    decrementCountOnTodoRemove,
    resetCountOnTodoReset
  );
}

export type CountTodosHandler = ReturnType<typeof buildCountTodosHandler>;
