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

export class DataSubject<T, P = void> extends BehaviorSubject<T | null> {
  private cancel: Subject<void> = new Subject();
  send: (params: P) => Observable<T>;
  isLoading: BehaviorSubject<boolean>;
  isSuccess: BehaviorSubject<boolean>;
  isError: BehaviorSubject<boolean>;

  constructor(request: (params: P) => Observable<T>) {
    super(null);
    this.isSuccess = new BehaviorSubject(false);
    this.isLoading = new BehaviorSubject(false);
    this.isError = new BehaviorSubject(false);

    this.send = (params: P) => {
      if (this.isLoading.getValue()) {
        this.cancel.next();
      }
      return of(params).pipe(
        tap(() => {
          this.isLoading.next(true);
          this.isSuccess.next(false);
          this.isError.next(false);
          console.log(`${request.name} request`);
        }),
        switchMap(request),
        tap((response) => {
          this.next(response);
          this.isLoading.next(false);
          this.isSuccess.next(true);
          this.isError.next(false);
          console.log(`${request.name} success`);
        }),
        catchError((error) => {
          this.isLoading.next(false);
          this.isSuccess.next(false);
          this.isError.next(true);
          console.error(error);
          return of(error);
        }),
        takeUntil(this.cancel)
      );
    };
  }
}
