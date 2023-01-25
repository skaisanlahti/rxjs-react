import { BehaviorSubject, Observable, catchError, tap } from "rxjs";

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

export class DataSubject<T, P> extends BehaviorSubject<Data<T>> {
  send: (params: P) => Observable<T>;

  constructor(request: (params: P) => Observable<T>) {
    super(initialState);

    this.send = (params: P) => {
      this.loading();
      return request(params).pipe(
        tap((res) => this.success(res)),
        catchError((error, res) => {
          this.error(error);
          return res;
        })
      );
    };
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
