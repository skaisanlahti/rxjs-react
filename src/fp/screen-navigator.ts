import { BehaviorSubject } from "rxjs";
import { Screens } from "../constants/screens";

export const screen = new BehaviorSubject(Screens.Init);

export function changeScreen(state: BehaviorSubject<Screens>, screen: Screens) {
  state.next(screen);
}
