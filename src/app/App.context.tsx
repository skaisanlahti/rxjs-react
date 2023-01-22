import { createCtx } from "../shared/hooks/createCtx";
import { Application } from "./App.module";

export const [useApp, AppProvider] = createCtx<Application>();
