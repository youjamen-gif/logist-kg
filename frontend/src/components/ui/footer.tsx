"use client";

import Link from "next/link";
import { useSystemSettings } from "@/hooks/use-system-settings";

export default function Footer() {
  const { settings } = useSystemSettings();

  return (
    <footer className="border-t bg-white/90">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <h2 className="mb-3 text-lg font-bold">
            {settings?.siteTitle || "Logist.kg"}
          </h2>
          <p className="text-sm text-gray-600">
            Платформа для поиска и размещения грузов.
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Навигация</h3>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/find-cargo" className="hover:underline">
              Найти груз
            </Link>
            <Link href="/post-cargo" className="hover:underline">
              Разместить груз
            </Link>
            <Link href="/login" className="hover:underline">
              Войти
            </Link>
            <Link href="/register" className="hover:underline">
              Регистрация
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Контакты и соцсети</h3>

          <div className="flex flex-col gap-2 text-sm text-gray-700">
            {settings?.supportEmail ? (
              <a href={`mailto:${settings.supportEmail}`} className="hover:underline">
                {settings.supportEmail}
              </a>
            ) : null}

            {settings?.supportPhone ? (
              <a href={`tel:${settings.supportPhone}`} className="hover:underline">
                {settings.supportPhone}
              </a>
            ) : null}

            {settings?.telegram ? (
              <a href={settings.telegram} target="_blank" rel="noreferrer" className="hover:underline">
                Telegram
              </a>
            ) : null}

            {settings?.whatsapp ? (
              <a href={settings.whatsapp} target="_blank" rel="noreferrer" className="hover:underline">
                WhatsApp
              </a>
            ) : null}

            {settings?.instagram ? (
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="hover:underline">
                Instagram
              </a>
            ) : null}

            {settings?.facebook ? (
              <a href={settings.facebook} target="_blank" rel="noreferrer" className="hover:underline">
                Facebook
              </a>
            ) : null}

            {settings?.youtube ? (
              <a href={settings.youtube} target="_blank" rel="noreferrer" className="hover:underline">
                YouTube
              </a>
            ) : null}

            {settings?.tiktok ? (
              <a href={settings.tiktok} target="_blank" rel="noreferrer" className="hover:underline">
                TikTok
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
