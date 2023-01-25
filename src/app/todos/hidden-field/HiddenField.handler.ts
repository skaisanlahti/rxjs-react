import { debounceTime, merge, tap, withLatestFrom } from "rxjs";
import { keyPress } from "../../../shared/utils/keypress";
import { saveToStorage } from "../../../shared/utils/storage";
import { TodoModuleType } from "../Todos.module";
import { ApiModuleType } from "../api-mock/Api.module";
import { HiddenFieldModuleType } from "./HiddenField.module";

interface Dependencies {
  hidden: HiddenFieldModuleType;
  todos: TodoModuleType;
  api: ApiModuleType;
}

export default function HiddenFieldHandler({
  hidden,
  todos,
  api,
}: Dependencies) {
  return function start() {
    const onUpdate = api.updateDelay.pipe(
      tap((value) => api.mockDelay.next(value)),
      debounceTime(300),
      tap((value) => saveToStorage("delay", value))
    );

    const onKeyPress = keyPress("d").pipe(
      withLatestFrom(hidden.isDelayFieldHidden, todos.isTodoFieldFocused),
      tap(([_, isDelayFieldHidden, isTodoFieldFocused]) => {
        if (isTodoFieldFocused) return;
        return hidden.isDelayFieldHidden.next(!isDelayFieldHidden);
      })
    );

    const subscription = merge(onUpdate, onKeyPress).subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };
}
