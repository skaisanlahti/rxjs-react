import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  catchError,
  of,
  switchMap,
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
  private dispatch: Subject<P>;
  private subscription: Subscription;

  constructor(request: (params: P) => Observable<T>) {
    super(initialState);
    this.dispatch = new Subject<P>();
    this.subscription = this.dispatch
      .pipe(
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
        })
      )
      .subscribe();
  }

  send(params: P) {
    this.dispatch.next(params);
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

  dispose() {
    this.dispatch.complete();
    this.subscription.unsubscribe();
  }
}
