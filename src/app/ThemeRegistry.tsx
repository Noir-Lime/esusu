"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { inter } from "./fonts";

/**
 * Creates a Theme Provider as a Client Component.
 * This is because createTheme() cannot be called on the server side due to it relying on React.createContext().
 * As a result, breaking this out to a separate component is the only way to get around this.
 */
export const ThemeRegistry: React.FC<PropsWithChildren> = (props) => {
  const theme_ref = React.useRef(
    createTheme({
      palette: {
        mode: "dark",
      },
      typography: {
        fontFamily: inter.style.fontFamily,
      },
    })
  );

  return (
    <ThemeProvider theme={theme_ref.current}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
};
