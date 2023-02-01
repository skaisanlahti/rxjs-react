import { BehaviorSubject } from "rxjs";
import { DataSubject } from "../../shared/utils/DataSubject";
import ApiModule, { ApiModuleType } from "./api-mock/Api.module";

export type TodoModuleType = ReturnType<typeof TodoModule>;

interface Dependencies {
  api: ApiModuleType;
}

export default function TodoModule(
  { api }: Dependencies = { api: ApiModule() }
) {
  return {
    title: new BehaviorSubject(""),
    description: new BehaviorSubject(""),
    isTodoFieldFocused: new BehaviorSubject(false),
    todosLoading: new BehaviorSubject(false),

    get: new DataSubject(api.getTodos),
    add: new DataSubject(api.addTodo),
    remove: new DataSubject(api.deleteTodo),
    check: new DataSubject(api.checkTodo),
    reset: new DataSubject(api.resetTodos),
  };
}
