import { Observable, catchError, tap } from "rxjs";
import { DataSubject } from "./DataSubject";

export function withLoadingStates<T, P = void>(
  loader: (params: P) => Observable<T>
) {
  const subject = new DataSubject<T>();
  const loaderWithSideEffects = (params: P) => {
    subject.loading();
    return loader(params).pipe(
      tap((res) => subject.success(res)),
      catchError((error, res) => {
        subject.error(error);
        return res;
      })
    );
  };
  return [subject, loaderWithSideEffects] as const;
}
