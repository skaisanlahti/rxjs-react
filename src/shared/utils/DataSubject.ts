import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  of,
  switchMap,
  takeUntil,
  tap,
} from "rxjs";

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
  status: "idle" as Status,
  isLoading: false,
  isSuccess: false,
  isError: false,
};

export class DataSubject<T, P = void> extends BehaviorSubject<Data<T>> {
  private cancel: Subject<void> = new Subject();
  send: (params: P) => Observable<Data<T>>;

  constructor(request: (params: P) => Observable<T>) {
    super(initialState);

    this.send = (params: P) => {
      if (this.getValue().isLoading) {
        this.cancel.next();
      }
      return of(params).pipe(
        tap(() => {
          console.log(`${request.name} request`);
          this.loading();
        }),
        switchMap(request),
        tap((response) => {
          console.log(`${request.name} success`);
          this.success(response);
        }),
        catchError((error) => {
          this.error(error);
          console.error(error);
          return of(error);
        }),
        takeUntil(this.cancel)
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
}
