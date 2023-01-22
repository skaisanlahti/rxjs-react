import { BehaviorSubject, Observable } from "rxjs";

export default class State<T> {
  private state: BehaviorSubject<T>;

  constructor(initialState: T) {
    this.state = new BehaviorSubject(initialState);
  }

  get value(): T {
    return this.state.getValue();
  }

  get stream(): Observable<T> {
    return this.state.asObservable();
  }

  set(value: T): void {
    this.state.next(value);
  }

  // dispose() {
  //   this.state.complete();
  // }
}

export function createState<T>(initialState: T) {
  return new State<T>(initialState);
}
