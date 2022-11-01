import { useEffect } from "react";
import { Observable, Observer } from "rxjs";

export function useReaction<T>(
  observable: Observable<T>,
  observer: Partial<Observer<T>>
) {
  useEffect(() => {
    const subscription = observable.subscribe(observer);
    return () => subscription.unsubscribe();
  }, []);
}
