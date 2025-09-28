"use client";

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
} & ThemeProviderProps;

export function ThemeProvider({ children, ...props }: Props) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
