import { useEffect } from "react";
import { Observable } from "rxjs";

export function useObservableEffect<T>(
  action: Observable<T>,
  deps: any[] = []
) {
  useEffect(() => {
    const sub = action.subscribe();
    return () => sub.unsubscribe();
  }, deps);
}
