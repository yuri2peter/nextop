"use client";

import { updateSessionClient } from "@/app/actions";
import { useListenMobile } from "@/hooks/use-mobile";
import { useListenThemeResolved } from "@/hooks/use-theme";
import { createContext, useEffect } from "react";
import type { RootLayoutContextValue } from "./defines";
export const RootLayoutContext = createContext<RootLayoutContextValue>(
  {} as RootLayoutContextValue,
);

export function RootLayoutContextProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: RootLayoutContextValue;
}) {
  useEffect(() => {
    updateSessionClient();
  }, []);
  useListenThemeResolved();
  useListenMobile();
  return (
    <RootLayoutContext.Provider value={value}>
      {children}
    </RootLayoutContext.Provider>
  );
}
