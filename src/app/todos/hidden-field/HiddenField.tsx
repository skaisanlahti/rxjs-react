import { useStateSubject } from "../../../shared/hooks/observable-hooks";
import { useApp } from "../../AppContext";
import { Input } from "../../AppStyles";

export function HiddenField() {
  const app = useApp();
  const mockDelay = useStateSubject(app.api.mockDelay);
  const isHidden = useStateSubject(app.hidden.isDelayFieldHidden);

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
