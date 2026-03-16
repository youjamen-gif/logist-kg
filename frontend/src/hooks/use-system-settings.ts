"use client";

import { useEffect, useState } from "react";
// ...удалён firebase импорт...
import { db } from "@/lib/firebase/firebase";

export type SystemSettings = {
  siteTheme?: "light" | "dark" | "auto";
  primaryColor?: string;
  fontFamily?: string;
  backgroundImage?: string;
  telegram?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  supportEmail?: string;
  supportPhone?: string;
  siteTitle?: string;
  heroTitle?: string;
  heroSubtitle?: string;
};

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const ref = doc(db, "system_settings", "main");
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setSettings(snap.data() as SystemSettings);
        } else {
          setSettings(null);
        }
      } catch (error) {
        console.error("Error loading system settings:", error);
        setSettings(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
}
