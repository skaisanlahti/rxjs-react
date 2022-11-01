import { screenNavigator } from "../modules/screen-navigator";
import { useValue } from "./utils/useValue";

export default function ScreenNavigator() {
  const screen = useValue(screenNavigator.currentScreen);
  return <div>ScreenNavigator: {screen}</div>;
}
