import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  distinctUntilChanged,
  from,
  of,
  share,
  switchMap,
  takeUntil,
  tap,
} from "rxjs";

// data fetching helper that provides loading states, cache, and automatic refetching
export class Query<T, P = void> {
  result = new BehaviorSubject<T | undefined>(undefined);
  resultWithRefetch;
  isLoading = new BehaviorSubject(false);
  isSuccess = new BehaviorSubject(false);
  isError = new BehaviorSubject(false);
  private timestamp = new BehaviorSubject(0);
  private sendRequest = new Subject<P>();
  private requestHandler;
  send = (params: P) => {
    this.sendRequest.next(params);
  };

  constructor(request: (params: P) => Promise<T>, staleAfter = 3000) {
    // build loading states and error handling around request
    this.requestHandler = (params: P): Observable<T> => {
      return of(params).pipe(
        tap(() => {
          console.log(`${request.name} request`);
          this.isLoading.next(true);
        }),
        switchMap((params) => from(request(params))),
        tap(() => {
          console.log(`${request.name} success`);
          this.isLoading.next(false);
          this.isSuccess.next(true);
          this.isError.next(false);
        }),
        catchError((error) => {
          console.error(error);
          this.isLoading.next(false);
          this.isSuccess.next(false);
          this.isError.next(true);
          return of(error);
        })
      );
    };

    // component subscribes to this instead of result to get automatic refetch
    this.resultWithRefetch = (params: P) => {
      return this.result.pipe(
        tap(() => {
          // check timestamp to check for stale data
          if (Date.now() - this.timestamp.getValue() > staleAfter) {
            // trigger request
            this.sendRequest.next(params);
          }
        }),
        distinctUntilChanged(),
        share()
      );
    };

    // must always observe request subject to actually fetch data
    this.sendRequest
      .pipe(
        tap(() => this.timestamp.next(Date.now())),
        switchMap(this.requestHandler),
        tap((response) => this.result.next(response)),
        tap(() => this.timestamp.next(Date.now()))
      )
      .subscribe();
  }
}

// data fetching helper that provides loading states and an observable operation
// so that consumers can run callbacks when operation completes like closing a modal
export class Mutation<T, P = void> {
  isLoading = new BehaviorSubject(false);
  isSuccess = new BehaviorSubject(false);
  isError = new BehaviorSubject(false);
  private cancel = new Subject<void>();
  send = (params: P) => {
    return this.requestHandler(params);
  };
  private requestHandler;

  constructor(request: (params: P) => Promise<T>) {
    // build loading states and error handling around request
    this.requestHandler = (params: P): Observable<T> => {
      if (this.isLoading.getValue()) this.cancel.next();
      return of(params).pipe(
        tap(() => {
          console.log(`${request.name} request`);
          this.isLoading.next(true);
        }),
        switchMap((params) => from(request(params))),
        tap(() => {
          console.log(`${request.name} success`);
          this.isLoading.next(false);
          this.isSuccess.next(true);
          this.isError.next(false);
        }),
        catchError((error) => {
          console.error(error);
          this.isLoading.next(false);
          this.isSuccess.next(false);
          this.isError.next(true);
          return of(error);
        }),
        takeUntil(this.cancel)
      );
    };
  }
}
