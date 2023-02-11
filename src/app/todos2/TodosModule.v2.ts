import genId from "../../shared/utils/genId";

//#region Types

export type IID = `${string}-${string}-${string}-${string}-${string}`;

export type INewTodo = {
  title: string;
  description: string;
};

export type ITodo = INewTodo & {
  id: IID;
  isDone: boolean;
};

export type ITodos = ITodo[];

//#endregion

//#region Pure functions

function create(title: string, description: string): ITodo {
  return { id: genId(), title, description, isDone: false };
}

function toggle(item: ITodo): ITodo {
  return { ...item, isDone: !item.isDone };
}

function add(todos: ITodos, item: ITodo): ITodos {
  return todos.concat(item);
}

function remove(todos: ITodos, id: string): ITodos {
  return todos.filter((item) => item.id !== id);
}

function check(todos: ITodos, id: string): ITodos {
  return todos.map((item) => {
    if (item.id === id) {
      return toggle(item);
    }
    return item;
  });
}

//#endregion

export const TodosLibrary = {
  create,
  toggle,
  add,
  remove,
  check,
};
