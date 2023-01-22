import { useEffect, useState, useSyncExternalStore } from "react";
import {
  BehaviorSubject,
  Subscription,
  distinctUntilChanged,
  map,
  share,
} from "rxjs";

// Rxjs-React-adapter with selector support using useState
export function useStream<T>(subject: BehaviorSubject<T>): T;
export function useStream<T, K>(
  subject: BehaviorSubject<T>,
  selector: (value: T) => K
): K;
export function useStream<T, K>(
  subject: BehaviorSubject<T>,
  selector?: (value: T) => K
): T | K {
  const [state, setState] = useState(
    selector ? selector(subject.getValue()) : subject.getValue()
  );
  useEffect(() => {
    if (selector) {
      const initialValue = subject.getValue();
      const mappedValue = selector(initialValue);
      const innerSubject = new BehaviorSubject(mappedValue);
      const subscription = subject.pipe(map(selector)).subscribe(innerSubject);
      const innerSubscription = innerSubject.subscribe(setState);
      return () => {
        subscription.unsubscribe();
        innerSubscription.unsubscribe();
        innerSubject.complete();
      };
    } else {
      const subscription = subject.subscribe(setState);
      return () => subscription.unsubscribe();
    }
  }, []);
  return state;
}

// Rxjs-React-adapter with selector support using useSyncExternalStore
export function useObservableState<T>(subject: BehaviorSubject<T>): T;
export function useObservableState<T, K>(
  subject: BehaviorSubject<T>,
  selector: (value: T) => K
): K;
export function useObservableState<T, K>(
  subject: BehaviorSubject<T>,
  selector?: (value: T) => K
): T | K {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (selector) {
        const [innerSubject, innerSubscription] = selectSubscribe(
          subject,
          selector
        );
        const subscription = innerSubject.subscribe(onStoreChange);
        return () => {
          subscription.unsubscribe();
          innerSubscription.unsubscribe();
          innerSubject.complete();
        };
      } else {
        const subscription = subject.subscribe(onStoreChange);
        return () => subscription.unsubscribe();
      }
    },
    () => {
      if (selector) {
        return selectSnapshot(subject, selector);
      } else {
        return subject.getValue();
      }
    }
  );
}

function selectSubscribe<T, K>(
  subject: BehaviorSubject<T>,
  selector: (value: T) => K
): readonly [
  innerSubject: BehaviorSubject<K>,
  innerSubscription: Subscription
] {
  const initialValue = subject.getValue();
  const mappedValue = selector(initialValue);
  const innerSubject = new BehaviorSubject<K>(mappedValue);
  const innerSubscription = subject.pipe(map(selector)).subscribe(innerSubject);
  return [innerSubject, innerSubscription] as const;
}

function selectSnapshot<T, K>(
  subject: BehaviorSubject<T>,
  selector: (value: T) => K
) {
  const initialValue = subject.getValue();
  return selector(initialValue);
}

export function select<T, K>(
  subject: BehaviorSubject<T>,
  selector: (value: T) => K
): readonly [
  innerSubject: BehaviorSubject<K>,
  innerSubscription: Subscription,
  cleanUp: () => void
] {
  const initialValue = subject.getValue();
  const mappedValue = selector(initialValue);
  const innerSubject = new BehaviorSubject<K>(mappedValue);
  const innerSubscription = subject
    .pipe(map(selector), distinctUntilChanged(), share())
    .subscribe(innerSubject);
  const cleanUp = () => {
    innerSubscription.unsubscribe();
    innerSubject.complete();
  };
  return [innerSubject, innerSubscription, cleanUp] as const;
}
