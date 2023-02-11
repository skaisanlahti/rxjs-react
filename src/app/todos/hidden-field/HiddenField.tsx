import { useSubscribe } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../AppContext";
import { Input } from "../../AppStyles";

export function HiddenField() {
  const app = useApp();
  const mockDelay = useSubscribe(app.api.mockDelay);
  const isHidden = useSubscribe(app.hidden.isDelayFieldHidden);

  if (isHidden) return null;
  return (
    <Input
      placeholder="Mock delay in ms"
      id="mock-delay"
      type="number"
      pattern="\d*"
      value={mockDelay}
      onChange={(e) => {
        const value = Number(e.target.value);
        if (typeof value === "number") app.api.updateDelay.next(value);
      }}
    />
  );
}
