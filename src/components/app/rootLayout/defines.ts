import type { SessionPayloadClient } from "@/lib/session.define";

export type RootLayoutContextValue = {
  defaultIsMobile: boolean;
  defaultLanguage: string;
  defaultTheme: string;
  defaultThemeResolved: string;
  session: SessionPayloadClient;
};
