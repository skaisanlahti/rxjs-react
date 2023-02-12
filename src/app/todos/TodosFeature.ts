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

const todosFromFile = todosJson;
const initialTodos = todosFromFile.todos as Todos;

//#region Types

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

//#endregion Types

//#region Pure Functions

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

//#endregion Pure Functions

//#region Streams

export function buildTodosStreams() {
  return {
    todos: new BehaviorSubject<Todos>([]),
    title: new BehaviorSubject(""),
    description: new BehaviorSubject(""),
    updateTitle: new Subject<string>(),
    updateDescription: new Subject<string>(),
    addTodo: new Subject<void>(),
    removeTodo: new Subject<ID>(),
    checkTodo: new Subject<ID>(),
    resetTodos: new Subject<void>(),
  };
}

export type TodoStreams = ReturnType<typeof buildTodosStreams>;

function buildAddTodoHandler(
  addTodo: Subject<void>,
  todos: BehaviorSubject<Todos>,
  title: BehaviorSubject<string>,
  description: BehaviorSubject<string>
) {
  return addTodo.pipe(
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
    withLatestFrom(todos),
    map(([id, currentTodos]) => todosLibrary.check(currentTodos, id)),
    tap((newTodos) => todos.next(newTodos))
  );
}

function buildResetTodosHandler(
  resetTodos: Subject<void>,
  todos: BehaviorSubject<Todos>
) {
  return resetTodos.pipe(tap(() => todos.next(initialTodos)));
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

export type ITodosHandler = ReturnType<typeof buildTodosHandler>;

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

export type ITodosFacade = ReturnType<typeof buildTodosFacade>;

//#endregion Facade

export function buildTodos() {
  const todoStreams = buildTodosStreams();
  return {
    todoStreams,
    todosFacade: buildTodosFacade(todoStreams),
    todosHandler: buildTodosHandler(todoStreams),
  };
}
