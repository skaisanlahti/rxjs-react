import { BehaviorSubject } from "rxjs";

export type HiddenFieldModuleType = ReturnType<typeof HiddenFieldModule>;

interface Dependencies {}

export default function HiddenFieldModule({}: Dependencies = {}) {
  const isDelayFieldHidden = new BehaviorSubject(true);

  return { isDelayFieldHidden };
}
