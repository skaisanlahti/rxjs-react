export interface Todo extends NewTodo {
  id: string;
  done: boolean;
}

export interface NewTodo {
  title: string;
  description: string;
}
