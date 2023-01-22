import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    color: {
      dark: string;
      light: string;
    };
  }
}
