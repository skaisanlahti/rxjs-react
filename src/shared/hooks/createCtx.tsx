import React from "react";

// https://gist.github.com/sw-yx/f18fe6dd4c43fddb3a4971e80114a052

export function createCtx<A>() {
  const ctx = React.createContext<A | undefined>(undefined);
  function useCtx() {
    const c = React.useContext(ctx);
    if (!c) throw new Error("useCtx must be inside a Provider with a value");
    return c;
  }
  return [useCtx, ctx.Provider] as const;
}
