"use client";

import { useLayoutEffect } from "react";
import useSkinStore from "./store";
import { getSkinStyles } from "./utils/get-skin-styles";

export function SkinStyle({ defaultSkin }: { defaultSkin: string }) {
  const skin = useSkinStore((s) => s.skin);
  const setSkin = useSkinStore((s) => s.actions.setSkin);
  useLayoutEffect(() => {
    setSkin(defaultSkin);
  }, [defaultSkin, setSkin]);
  return <style id="skin-style">{getSkinStyles(skin)}</style>;
}
