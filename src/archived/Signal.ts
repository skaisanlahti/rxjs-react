import { Subject } from "rxjs";

export default class Signal<T> {
  private signal = new Subject<T>();

  get stream() {
    return this.signal.asObservable();
  }

  emit(value: T) {
    this.signal.next(value);
  }

  dispose() {
    this.signal.complete();
  }
}
