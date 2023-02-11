import { BehaviorSubject } from "rxjs";
import { DataSubject } from "../../shared/utils/DataSubject";
import { Todo } from "../todos/TodosCore";
import { ApiModuleType } from "../todos/api-mock/ApiModule";
import { IID, ITodo, ITodos, TodosLibrary as T } from "./TodosModule.v2";

export class TodoComponent {
  todos: BehaviorSubject<ITodos>;
  title: BehaviorSubject<string>;
  description: BehaviorSubject<string>;
  getTodos: DataSubject<Todo[], void>;

  constructor(private api: ApiModuleType) {
    this.todos = new BehaviorSubject<ITodos>([]);
    this.title = new BehaviorSubject("");
    this.description = new BehaviorSubject("");
    this.getTodos = new DataSubject(api.getTodos);
  }

  updateTitle(value: string) {
    this.title.next(value);
  }

  updateDescription(value: string) {
    this.description.next(value);
  }

  addTodo(todo: ITodo) {
    this.todos.next(T.add(this.todos.getValue(), todo));
  }

  removeTodo(id: IID) {
    this.todos.next(T.remove(this.todos.getValue(), id));
  }

  checkTodo(id: IID) {
    this.todos.next(T.check(this.todos.getValue(), id));
  }

  resetTodos() {
    this.todos.next([]);
  }
}
