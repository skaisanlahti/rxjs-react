import { map, merge, tap, withLatestFrom } from "rxjs";
import todosJson from "../../shared/todos.json";
import genId from "../../shared/utils/genId";
import { Event, State } from "../../shared/utils/renaming";

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

export const todoOperations = {
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
    todos: new State<Todos>(initialTodos),
    title: new State(""),
    description: new State(""),
    addTodo: new Event<void>(),
    removeTodo: new Event<ID>(),
    checkTodo: new Event<ID>(),
    resetTodos: new Event<void>(),
  };
}

export type TodoStreams = ReturnType<typeof buildTodoStreams>;

function buildAddTodoHandler(
  addTodo: Event<void>,
  todos: State<Todos>,
  title: State<string>,
  description: State<string>
) {
  return addTodo.pipe(
    tap(() => console.log("add todo")),
    withLatestFrom(title, description),
    map(([, currentTitle, currentDescription]) =>
      todoOperations.create(currentTitle, currentDescription)
    ),
    withLatestFrom(todos),
    map(([newTodo, currentTodos]) => todoOperations.add(currentTodos, newTodo)),
    tap((newTodos) => todos.next(newTodos)),
    tap(() => title.next("")),
    tap(() => description.next(""))
  );
}

function buildRemoveTodoHandler(removeTodo: Event<ID>, todos: State<Todos>) {
  return removeTodo.pipe(
    tap(() => console.log("remove todo")),
    withLatestFrom(todos),
    map(([id, currentTodos]) => todoOperations.remove(currentTodos, id)),
    tap((newTodos) => todos.next(newTodos))
  );
}

function buildCheckTodoHandler(checkTodo: Event<ID>, todos: State<Todos>) {
  return checkTodo.pipe(
    tap(() => console.log("check todo")),
    withLatestFrom(todos),
    map(([id, currentTodos]) => todoOperations.check(currentTodos, id)),
    tap((newTodos) => todos.next(newTodos))
  );
}

function buildResetTodosHandler(resetTodos: Event<void>, todos: State<Todos>) {
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

// single module
export function TodosModule() {
  const todos = new State<Todos>([]);
  const title = new State("");
  const description = new State("");

  return {
    title: title.asObservable(),
    description: description.asObservable(),
    setTitle(value: string) {
      title.next(value);
    },
    setDescription(value: string) {
      description.next(value);
    },
    items: todos.asObservable(),
    add() {
      const current = todos.getValue();
      const newTodo = todoOperations.create(
        title.getValue(),
        description.getValue()
      );
      const newTodos = todoOperations.add(current, newTodo);
      todos.next(newTodos);
      title.next("");
      description.next("");
    },
    remove(id: ID) {
      const current = todos.getValue();
      const newTodos = todoOperations.remove(current, id);
      todos.next(newTodos);
    },
    check(id: ID) {
      const current = todos.getValue();
      const newTodos = todoOperations.check(current, id);
      todos.next(newTodos);
    },
    reset() {
      todos.next(initialTodos);
    },
  };
}
