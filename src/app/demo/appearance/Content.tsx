"use client";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useLanguage from "@/hooks/use-language";
import { useIsMobile } from "@/hooks/use-mobile";
import useRootLayout from "@/hooks/use-root-layout";
import useTheme from "@/hooks/use-theme";
import { useTranslations } from "next-intl";

export default function Content() {
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const { locale, setLocale, m } = useLanguage();
  const t = useTranslations();
  const { defaultIsMobile, defaultLanguage } = useRootLayout();
  return (
    <>
      <CardContent className="p-4 prose prose-sm">
        <ul>
          <li>Dark Mode: {theme === "dark" ? "Yes" : "No"}</li>
          <li>App Language: {locale}</li>
          <li>User Language: {defaultLanguage}</li>

          <li>Using Mobile Layout: {isMobile ? "Yes" : "No"}</li>
          <li>Detected Mobile: {defaultIsMobile ? "Yes" : "No"}</li>
        </ul>
      </CardContent>
      <CardFooter className="p-4 border-t border-border [.border-t]:pt-4 block space-y-4">
        <div className="space-y-2">
          <Label htmlFor="theme" className="text-sm font-bold">
            {t(m.demo.appearance.changeTheme)}
          </Label>
          <RadioGroup
            id="theme"
            value={theme}
            onValueChange={setTheme}
            className="grid grid-cols-3 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="t1" />
              <Label htmlFor="t1">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="t2" />
              <Label htmlFor="t2">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="t3" />
              <Label htmlFor="t3">System</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label htmlFor="theme" className="text-sm font-bold">
            {t(m.demo.appearance.changeLanguage)}
          </Label>
          <RadioGroup
            id="theme"
            value={locale}
            onValueChange={setLocale}
            className="grid grid-cols-3 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en" id="l1" />
              <Label htmlFor="l1">English</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="zh-CN" id="l2" />
              <Label htmlFor="l2">中文(简体)</Label>
            </div>
          </RadioGroup>
        </div>
      </CardFooter>
    </>
  );
}
