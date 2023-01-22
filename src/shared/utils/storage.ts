import { BehaviorSubject } from "rxjs";

export function loadFromStorage<T>(key: string) {
  const item = localStorage.getItem(key);
  if (item === null) return null;
  return JSON.parse(item) as T;
}

export function saveToStorage<T>(key: string, item: T) {
  try {
    if (!item) return false;
    localStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch {
    return false;
  }
}

export function loadFromStorageToState<T>(
  key: string,
  state: BehaviorSubject<T>
) {
  const item = loadFromStorage<T>(key);
  if (item) state.next(item);
}
