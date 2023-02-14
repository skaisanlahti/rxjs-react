import {
  BehaviorSubject,
  Subject,
  map,
  merge,
  tap,
  withLatestFrom,
} from "rxjs";
import todosJson from "../../shared/todos.json";
import genId from "../../shared/utils/genId";

//#region Pure

const todosFromFile = todosJson;
const initialTodos = todosFromFile.todos as Todos;

export type ID = `${string}-${string}-${string}-${string}-${string}`;

export type NewTodo = {
  title: string;
  description: string;
};

export type Todo = NewTodo & {
  id: ID;
  isDone: boolean;
};

export type Todos = Todo[];

function create(title: string, description: string): Todo {
  return { id: genId(), title, description, isDone: false };
}

function toggle(item: Todo): Todo {
  return { ...item, isDone: !item.isDone };
}

function add(todos: Todos, item: Todo): Todos {
  return todos.concat(item);
}

function remove(todos: Todos, id: string): Todos {
  return todos.filter((item) => item.id !== id);
}

function check(todos: Todos, id: string): Todos {
  return todos.map((item) => {
    if (item.id === id) {
      return toggle(item);
    }
    return item;
  });
}

export const todosLibrary = {
  create,
  toggle,
  add,
  remove,
  check,
};

//#endregion Pure

//#region Streams

export function buildTodoStreams() {
  return {
    todos: new BehaviorSubject<Todos>(initialTodos),
    title: new BehaviorSubject(""),
    description: new BehaviorSubject(""),
    addTodo: new Subject<void>(),
    removeTodo: new Subject<ID>(),
    checkTodo: new Subject<ID>(),
    resetTodos: new Subject<void>(),
  };
}

export type TodoStreams = ReturnType<typeof buildTodoStreams>;

function buildAddTodoHandler(
  addTodo: Subject<void>,
  todos: BehaviorSubject<Todos>,
  title: BehaviorSubject<string>,
  description: BehaviorSubject<string>
) {
  return addTodo.pipe(
    tap(() => console.log("add todo")),
    withLatestFrom(title, description),
    map(([, currentTitle, currentDescription]) =>
      todosLibrary.create(currentTitle, currentDescription)
    ),
    withLatestFrom(todos),
    map(([newTodo, currentTodos]) => todosLibrary.add(currentTodos, newTodo)),
    tap((newTodos) => todos.next(newTodos)),
    tap(() => title.next("")),
    tap(() => description.next(""))
  );
}

function buildRemoveTodoHandler(
  removeTodo: Subject<ID>,
  todos: BehaviorSubject<Todos>
) {
  return removeTodo.pipe(
    tap(() => console.log("remove todo")),
    withLatestFrom(todos),
    map(([id, currentTodos]) => todosLibrary.remove(currentTodos, id)),
    tap((newTodos) => todos.next(newTodos))
  );
}

function buildCheckTodoHandler(
  checkTodo: Subject<ID>,
  todos: BehaviorSubject<Todos>
) {
  return checkTodo.pipe(
    tap(() => console.log("check todo")),
    withLatestFrom(todos),
    map(([id, currentTodos]) => todosLibrary.check(currentTodos, id)),
    tap((newTodos) => todos.next(newTodos))
  );
}

function buildResetTodosHandler(
  resetTodos: Subject<void>,
  todos: BehaviorSubject<Todos>
) {
  return resetTodos.pipe(
    tap(() => console.log("reset todos")),
    tap(() => todos.next(initialTodos))
  );
}

export function buildTodosHandler(streams: TodoStreams) {
  return merge(
    buildAddTodoHandler(
      streams.addTodo,
      streams.todos,
      streams.title,
      streams.description
    ),
    buildRemoveTodoHandler(streams.removeTodo, streams.todos),
    buildCheckTodoHandler(streams.checkTodo, streams.todos),
    buildResetTodosHandler(streams.resetTodos, streams.todos)
  );
}

export type TodosHandler = ReturnType<typeof buildTodosHandler>;

//#endregion Streams

//#region Facade

export function buildTodosFacade(streams: TodoStreams) {
  return {
    items: streams.todos.asObservable(),
    title: streams.title.asObservable(),
    description: streams.description.asObservable(),
    setTitle: (value: string) => {
      streams.title.next(value);
    },
    setDescription: (value: string) => {
      streams.description.next(value);
    },
    add: () => {
      streams.addTodo.next();
    },
    remove: (id: ID) => {
      streams.removeTodo.next(id);
    },
    check: (id: ID) => {
      streams.checkTodo.next(id);
    },
    reset: () => {
      streams.resetTodos.next();
    },
  };
}

export type TodosFacade = ReturnType<typeof buildTodosFacade>;

//#endregion Facade

export function buildTodos() {
  const todoStreams = buildTodoStreams();
  return {
    todoStreams,
    todosFacade: buildTodosFacade(todoStreams),
    todosHandler: buildTodosHandler(todoStreams),
  };
}
