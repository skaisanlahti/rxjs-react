import { BehaviorSubject, Subject } from "rxjs";
import ApiModule, { ApiModuleType } from "../../shared/Api.mock";
import { NewTodo } from "../../shared/models/Todo";
import { withLoadingStates } from "../../shared/utils/data-fetching";

export type TodoModuleType = ReturnType<typeof TodoModule>;

interface Dependencies {
  api: ApiModuleType;
}

export default function TodoModule(
  { api }: Dependencies = { api: ApiModule() }
) {
  const title = new BehaviorSubject("");
  const description = new BehaviorSubject("");

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
    title,
    description,
    getTodos,
    addTodo,
    deleteTodo,
    checkTodo,
    resetTodos,
    getTodosData,
    addTodoData,
    deleteTodoData,
    checkTodoData,
    resetTodosData,
    todosLoading,
    getTodosLoad,
    addTodoLoad,
    deleteTodoLoad,
    checkTodoLoad,
    resetTodosLoad,
  };
}
