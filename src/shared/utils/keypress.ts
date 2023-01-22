import { distinctUntilChanged, filter, fromEvent, merge, share } from "rxjs";

export function keyPress(key: string) {
  const keyDown = fromEvent<KeyboardEvent>(window, "keydown");
  const keyUp = fromEvent<KeyboardEvent>(window, "keyup");
  return merge(keyDown, keyUp).pipe(
    distinctUntilChanged((a, b) => a.code === b.code && a.type === b.type),
    share(),
    filter((event) => event.key === key.valueOf() && event.type === "keydown")
  );
}
