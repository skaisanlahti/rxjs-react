import { BehaviorSubject, Subject } from "rxjs";
import { DataSubject } from "../../shared/utils/DataSubject";
import { NewTodo, Todo } from "./Todos.core";
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
    items: new BehaviorSubject<Todo[]>([]),

    get: new Subject<void>(),
    add: new Subject<NewTodo>(),
    remove: new Subject<{ id: string }>(),
    check: new Subject<{ id: string }>(),
    reset: new Subject<void>(),

    getRequest: new DataSubject(api.getTodos),
    addRequest: new DataSubject(api.addTodo),
    removeRequest: new DataSubject(api.deleteTodo),
    checkRequest: new DataSubject(api.checkTodo),
    resetRequest: new DataSubject(api.resetTodos),
  };
}
