"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/context/auth-context";

type SystemSettings = {
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

export default function AdminSettingsPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [form, setForm] = useState<SystemSettings>({
    siteTheme: "light",
    primaryColor: "#000000",
    fontFamily: "Inter",
    backgroundImage: "",
    telegram: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
    youtube: "",
    tiktok: "",
    supportEmail: "",
    supportPhone: "",
    siteTitle: "Logist.kg",
    heroTitle: "",
    heroSubtitle: "",
  });

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (!loading && profile?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [loading, user, profile, router]);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user || profile?.role !== "admin") return;

      try {
        setPageLoading(true);
        setError("");

        const ref = doc(db, "system_settings", "main");
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setForm((prev) => ({
            ...prev,
            ...(snap.data() as SystemSettings),
          }));
        }
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки настроек");
      } finally {
        setPageLoading(false);
      }
    };

    if (!loading && user && profile?.role === "admin") {
      fetchSettings();
    }
  }, [loading, user, profile]);

  const updateField = (key: keyof SystemSettings, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSaving(true);

      await setDoc(
        doc(db, "system_settings", "main"),
        {
          ...form,
          updatedAt: serverTimestamp(),
          updatedBy: user?.uid || null,
        },
        { merge: true }
      );

      setSuccess("Настройки сохранены");
    } catch (err: any) {
      setError(err.message || "Ошибка сохранения настроек");
    } finally {
      setSaving(false);
    }
  };

  if (loading || pageLoading) {
    return <main className="p-6">Загрузка...</main>;
  }

  if (!user || profile?.role !== "admin") {
    return null;
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Настройки платформы</h1>
        <p className="text-sm text-gray-600">
          Управление темой, текстами, контактами и соцсетями.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <section className="rounded border p-5">
          <h2 className="mb-4 text-lg font-semibold">Основные настройки</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Название сайта"
              value={form.siteTitle || ""}
              onChange={(e) => updateField("siteTitle", e.target.value)}
              className="w-full rounded border p-3"
            />

            <select
              value={form.siteTheme || "light"}
              onChange={(e) => updateField("siteTheme", e.target.value)}
              className="w-full rounded border p-3"
            >
              <option value="light">Светлая</option>
              <option value="dark">Тёмная</option>
              <option value="auto">Авто</option>
            </select>

            <input
              type="text"
              placeholder="Основной цвет (#000000)"
              value={form.primaryColor || ""}
              onChange={(e) => updateField("primaryColor", e.target.value)}
              className="w-full rounded border p-3"
            />

            <input
              type="text"
              placeholder="Шрифт"
              value={form.fontFamily || ""}
              onChange={(e) => updateField("fontFamily", e.target.value)}
              className="w-full rounded border p-3"
            />

            <input
              type="text"
              placeholder="URL фона"
              value={form.backgroundImage || ""}
              onChange={(e) => updateField("backgroundImage", e.target.value)}
              className="w-full rounded border p-3 md:col-span-2"
            />
          </div>
        </section>

        <section className="rounded border p-5">
          <h2 className="mb-4 text-lg font-semibold">Главная страница</h2>

          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Главный заголовок"
              value={form.heroTitle || ""}
              onChange={(e) => updateField("heroTitle", e.target.value)}
              className="w-full rounded border p-3"
            />

            <textarea
              placeholder="Подзаголовок"
              value={form.heroSubtitle || ""}
              onChange={(e) => updateField("heroSubtitle", e.target.value)}
              className="min-h-[120px] w-full rounded border p-3"
            />
          </div>
        </section>

        <section className="rounded border p-5">
          <h2 className="mb-4 text-lg font-semibold">Социальные сети и контакты</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Telegram"
              value={form.telegram || ""}
              onChange={(e) => updateField("telegram", e.target.value)}
              className="w-full rounded border p-3"
            />

            <input
              type="text"
              placeholder="WhatsApp"
              value={form.whatsapp || ""}
              onChange={(e) => updateField("whatsapp", e.target.value)}
              className="w-full rounded border p-3"
            />

            <input
              type="text"
              placeholder="Instagram"
              value={form.instagram || ""}
              onChange={(e) => updateField("instagram", e.target.value)}
              className="w-full rounded border p-3"
            />

            <input
              type="text"
              placeholder="Facebook"
              value={form.facebook || ""}
              onChange={(e) => updateField("facebook", e.target.value)}
              className="w-full rounded border p-3"
            />

            <input
              type="text"
              placeholder="YouTube"
              value={form.youtube || ""}
              onChange={(e) => updateField("youtube", e.target.value)}
              className="w-full rounded border p-3"
            />

            <input
              type="text"
              placeholder="TikTok"
              value={form.tiktok || ""}
              onChange={(e) => updateField("tiktok", e.target.value)}
              className="w-full rounded border p-3"
            />

            <input
              type="email"
              placeholder="Email поддержки"
              value={form.supportEmail || ""}
              onChange={(e) => updateField("supportEmail", e.target.value)}
              className="w-full rounded border p-3"
            />

            <input
              type="text"
              placeholder="Телефон поддержки"
              value={form.supportPhone || ""}
              onChange={(e) => updateField("supportPhone", e.target.value)}
              className="w-full rounded border p-3"
            />
          </div>
        </section>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-green-600">{success}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded bg-black px-6 py-3 text-white disabled:opacity-50"
        >
          {saving ? "Сохранение..." : "Сохранить настройки"}
        </button>
      </form>
    </main>
  );
}
