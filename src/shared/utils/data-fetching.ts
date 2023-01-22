import { BehaviorSubject, Observable, catchError, tap } from "rxjs";

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
  status: "idle",
  isLoading: false,
  isSuccess: false,
  isError: false,
} as const;

export class DataSubject<T> extends BehaviorSubject<Data<T>> {
  constructor() {
    super(initialState);
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
}

type CancelFunc = () => void;

interface QueryFactoryProps<T, P> {
  subject: DataSubject<T>;
  query: (params?: P, signal?: AbortSignal) => Promise<T>;
  effects?: SideEffects<T>;
}

interface SideEffects<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

interface Inputs<P, T> {
  params?: P;
  effects?: SideEffects<T>;
}

export function QueryFactory<T, P>({
  subject,
  query,
  effects,
}: QueryFactoryProps<T, P>) {
  return ({ params, effects: UIEffects }: Inputs<P, T>): CancelFunc => {
    const controller = new AbortController();
    subject.loading();
    query(params, controller.signal)
      .then((data) => {
        subject.success(data);
        if (effects && effects?.onSuccess) effects.onSuccess(data);
        if (UIEffects && UIEffects?.onSuccess) UIEffects.onSuccess(data);
      })
      .catch((error) => {
        subject.error(error);
        if (effects && effects?.onError) effects.onError(error);
        if (UIEffects && UIEffects?.onError) UIEffects.onError(error);
      });

    return () => {
      subject.cancel();
      controller.abort();
    };
  };
}

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
