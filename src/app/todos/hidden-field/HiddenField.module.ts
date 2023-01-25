import { BehaviorSubject } from "rxjs";

export type HiddenFieldModuleType = ReturnType<typeof HiddenFieldModule>;

interface Dependencies {}

export default function HiddenFieldModule({}: Dependencies = {}) {
  return { isDelayFieldHidden: new BehaviorSubject(true) };
}
