import { BehaviorSubject } from "rxjs";

export type Status = "idle" | "loading" | "success" | "error";

export type Data<Result, Error = any> = {
  data?: Result;
  error?: Error;
  status: Status;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

const initialState = {
  status: "idle",
  isLoading: false,
  isSuccess: false,
  isError: false,
} as const;

export class DataSubject<T> extends BehaviorSubject<Data<T>> {
  constructor() {
    super(initialState);
  }

  success(data: T) {
    this.next({
      ...this.getValue(),
      data,
      error: undefined,
      status: "success",
      isSuccess: true,
      isError: false,
      isLoading: false,
    });
  }

  error(error?: any) {
    this.next({
      ...this.getValue(),
      error,
      status: "error",
      isSuccess: false,
      isError: true,
      isLoading: false,
    });
  }

  loading() {
    this.next({
      ...this.getValue(),
      error: undefined,
      status: "loading",
      isSuccess: false,
      isError: false,
      isLoading: true,
    });
  }

  cancel() {
    this.next({
      ...this.getValue(),
      status: "idle",
      isSuccess: false,
      isError: false,
      isLoading: false,
    });
  }
}
