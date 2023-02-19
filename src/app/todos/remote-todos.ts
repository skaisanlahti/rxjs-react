import { combineLatest, map, merge, tap } from "rxjs";
import { Mutation, Query } from "../../shared/utils/api-utils";
import { State } from "../../shared/utils/renaming";
import { ApiModuleType } from "./api-mock/ApiModule";
import { ID } from "./todos-feature";

// single file module, all aspects in a single function
export function RemoteTodosModule(api: ApiModuleType) {
  // sources
  const title = new State("");
  const description = new State("");
  const getTodos = new Query(api.getTodos);
  const addTodo = new Mutation(api.addTodo);
  const removeTodo = new Mutation(api.deleteTodo);
  const checkTodo = new Mutation(api.checkTodo);
  const resetTodos = new Mutation(api.resetTodos);

  // composition
  const loading = combineLatest([
    getTodos.isLoading,
    addTodo.isLoading,
    removeTodo.isLoading,
    checkTodo.isLoading,
    resetTodos.isLoading,
  ]).pipe(map((states) => states.some((isLoading) => isLoading)));

  const resetInputs = addTodo.isSuccess.pipe(
    tap(() => {
      title.next("");
      description.next("");
    })
  );

  const mutations = merge(
    resetInputs, // addTodo.isSuccess
    removeTodo.isSuccess,
    checkTodo.isSuccess,
    resetTodos.isSuccess
  );

  const refetchAfterMutations = mutations.pipe(tap(() => getTodos.send()));
  refetchAfterMutations.subscribe();

  // facade
  return {
    loading,
    title: title.asObservable(),
    description: description.asObservable(),
    items: getTodos.resultWithRefetch,
    itemCount: getTodos.result.pipe(map((items) => (items ? items.length : 0))),
    setTitle(value: string) {
      title.next(value);
    },
    setDescription(value: string) {
      description.next(value);
    },
    add() {
      const currentTitle = title.getValue();
      const currentDescription = description.getValue();
      return addTodo.send({
        title: currentTitle,
        description: currentDescription,
      });
    },
    remove(id: ID) {
      return removeTodo.send({ id });
    },
    check(id: ID) {
      return checkTodo.send({ id });
    },
    reset() {
      return resetTodos.send();
    },
  };
}

export type RemoteTodos = ReturnType<typeof RemoteTodosModule>;
