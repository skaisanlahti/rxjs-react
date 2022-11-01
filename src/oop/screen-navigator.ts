import { BehaviorSubject } from "rxjs";

export enum SCREEN {
  INIT,
  MAIN_MENU,
}

class ScreenNavigator {
  private _currentScreen = new BehaviorSubject(SCREEN.INIT);

  public currentScreen = this._currentScreen.asObservable();

  public goTo(screen: SCREEN) {
    this._currentScreen.next(screen);
  }
}

export const screenNavigator = new ScreenNavigator();
