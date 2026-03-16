"use client";

import { ReactNode } from "react";
import { useSystemSettings } from "@/hooks/use-system-settings";

export default function AppShell({ children }: { children: ReactNode }) {
  const { settings } = useSystemSettings();

  const theme = settings?.siteTheme || "light";
  const primaryColor = settings?.primaryColor || "#000000";
  const fontFamily = settings?.fontFamily || "Inter";
  const backgroundImage = settings?.backgroundImage || "";

  return (
    <div
      data-theme={theme}
      style={{
        fontFamily,
        ["--primary-color" as string]: primaryColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: backgroundImage ? "cover" : undefined,
        backgroundPosition: backgroundImage ? "center" : undefined,
        minHeight: "100vh",
      }}
      className={
        theme === "dark"
          ? "bg-black text-white"
          : "bg-white text-black"
      }
    >
      {children}
    </div>
  );
}
