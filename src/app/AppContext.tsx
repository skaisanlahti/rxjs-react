import { createCtx } from "../shared/hooks/createCtx";
import { Application } from "./AppModule";

export const [useApp, AppProvider] = createCtx<Application>();
