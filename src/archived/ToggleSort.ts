import { BehaviorSubject } from "rxjs";
import { Sort } from "./Sort";

interface Dependencies {
  sort: BehaviorSubject<Sort>;
}

export default function ToggleSort({ sort }: Dependencies) {
  return () => {
    if (sort.value === "desc") {
      sort.next("asc");
    } else {
      sort.next("desc");
    }
  };
}
