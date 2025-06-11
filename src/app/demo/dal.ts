import { env } from "@/lib/env.server";

export function verifyDemoEnabled() {
  if (!env().ENABLE_DEMO) {
    throw new Error("Demo is not enabled");
  }
}
