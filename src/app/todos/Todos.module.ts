import { BehaviorSubject, Subject } from "rxjs";
import { withLoadingStates } from "../../shared/utils/withLoadingStates";
import ApiModule, { ApiModuleType } from "../api-mock/Api.module";
import { NewTodo } from "./Todos.core";

export type TodoModuleType = ReturnType<typeof TodoModule>;

interface Dependencies {
  api: ApiModuleType;
}

export default function TodoModule(
  { api }: Dependencies = { api: ApiModule() }
) {
  const title = new BehaviorSubject("");
  const description = new BehaviorSubject("");
  const isTodoFieldFocused = new BehaviorSubject(false);

  const getTodos = new Subject<void>();
  const addTodo = new Subject<NewTodo>();
  const deleteTodo = new Subject<{ id: string }>();
  const checkTodo = new Subject<{ id: string }>();
  const resetTodos = new Subject<void>();

  const [getTodosData, getTodosLoad] = withLoadingStates(api.getTodos);
  const [addTodoData, addTodoLoad] = withLoadingStates(api.addTodo);
  const [deleteTodoData, deleteTodoLoad] = withLoadingStates(api.deleteTodo);
  const [checkTodoData, checkTodoLoad] = withLoadingStates(api.checkTodo);
  const [resetTodosData, resetTodosLoad] = withLoadingStates(api.resetTodos);
  const todosLoading = new BehaviorSubject(false);

  return {
    // state
    title,
    description,
    isTodoFieldFocused,

    // events
    getTodos,
    addTodo,
    deleteTodo,
    checkTodo,
    resetTodos,

    // data
    getTodosData,
    addTodoData,
    deleteTodoData,
    checkTodoData,
    resetTodosData,
    todosLoading,

    // loaders
    getTodosLoad,
    addTodoLoad,
    deleteTodoLoad,
    checkTodoLoad,
    resetTodosLoad,
  };
}
