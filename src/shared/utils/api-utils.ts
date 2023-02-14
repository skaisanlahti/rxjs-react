import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  distinctUntilChanged,
  firstValueFrom,
  from,
  map,
  of,
  share,
  switchMap,
  tap,
  timer,
} from "rxjs";

export class RequestStream<T, P = void> {
  cache: BehaviorSubject<T | undefined>;
  isLoading: BehaviorSubject<boolean>;
  isSuccess: BehaviorSubject<boolean>;
  isError: BehaviorSubject<boolean>;
  timestamp: BehaviorSubject<number>;
  sendRequest: Subject<P>;
  requestHandler: (params: P) => Observable<T>;
  data: (params: P) => Observable<T | undefined>;

  constructor(request: (params: P) => Promise<T>, staleAfter = 3000) {
    this.cache = new BehaviorSubject<T | undefined>(undefined);
    this.isSuccess = new BehaviorSubject(false);
    this.isLoading = new BehaviorSubject(false);
    this.isError = new BehaviorSubject(false);
    this.timestamp = new BehaviorSubject(0);
    this.sendRequest = new Subject<P>();

    // build loading states and error handling around request
    this.requestHandler = (params: P): Observable<T> => {
      return of(params).pipe(
        tap(() => {
          this.isLoading.next(true);
          this.isSuccess.next(false);
          this.isError.next(false);
          console.log(`${request.name} request`);
        }),
        switchMap((params) => from(request(params))),
        tap((response) => {
          this.cache.next(response);
          this.isLoading.next(false);
          this.isSuccess.next(true);
          this.isError.next(false);
          this.timestamp.next(Date.now());
          console.log(`${request.name} success`);
        }),
        catchError((error) => {
          this.isLoading.next(false);
          this.isSuccess.next(false);
          this.isError.next(true);
          console.error(error);
          return of(error);
        })
      );
    };

    // component subscribes to this instead of cache to get automatic refetch
    this.data = (params: P) => {
      return this.cache.pipe(
        tap(() => {
          // check timestamp to check for stale data
          if (Date.now() - this.timestamp.getValue() > staleAfter) {
            // update timestamp so this doesn't get rerun while loading
            this.timestamp.next(Date.now());
            // trigger request
            this.sendRequest.next(params);
          }
        }),
        distinctUntilChanged(),
        share()
      );
    };

    // must always observe request subject to actually fetch data
    this.sendRequest.pipe(switchMap(this.requestHandler)).subscribe();
  }
}

export function cachedRequest<T, P = void>(
  request: (params: P) => Promise<T>,
  staleAfter: number = 3000 // ms
) {
  const dataStream = new BehaviorSubject<T | undefined>(undefined);
  const isSuccess = new BehaviorSubject(false);
  const isLoading = new BehaviorSubject(false);
  const isError = new BehaviorSubject(false);

  const timestamp = new BehaviorSubject(0);
  const sendRequest = new Subject<P>();

  const requestHandler = (params: P): Observable<T> => {
    return of(params).pipe(
      tap(() => {
        isLoading.next(true);
        isSuccess.next(false);
        isError.next(false);
        console.log(`${request.name} request`);
      }),
      switchMap((params) => from(request(params))),
      tap((response) => {
        dataStream.next(response);
        isLoading.next(false);
        isSuccess.next(true);
        isError.next(false);
        console.log(`${request.name} success`);
        timestamp.next(Date.now());
      }),
      catchError((error) => {
        isLoading.next(false);
        isSuccess.next(false);
        isError.next(true);
        console.error(error);
        return of(error);
      })
    );
  };

  // component subscribes to this to get data
  const send = (params: P) => {
    return dataStream.pipe(
      tap(() => {
        // if stale or no data, do refetch
        if (Date.now() - timestamp.getValue() > staleAfter) {
          timestamp.next(Date.now());
          sendRequest.next(params);
        }
      }),
      distinctUntilChanged(),
      share()
    );
  };

  // must subscribe to run requests, alternatively return observable to subscribe later
  sendRequest.pipe(switchMap((params) => requestHandler(params))).subscribe();

  return {
    send,
    isLoading,
    isSuccess,
    isError,
  };
}

import { Todos } from "../../app/todos/todos-feature";
import todosJson from "../todos.json";

export function mockGetTodos(delay: number) {
  return firstValueFrom(timer(delay).pipe(map(() => todosJson.todos as Todos)));
}

export const getTodos = new RequestStream(mockGetTodos, 5000);
// testStream.dataStream(500).subscribe((data) => console.log("data", data));
