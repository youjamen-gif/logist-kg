"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <main className="p-6">Загрузка...</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Личный кабинет</h1>
          <p className="text-sm text-gray-600">
            Добро пожаловать, {profile?.name || user.email}
          </p>
        </div>

        <button
          onClick={logout}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Выйти
        </button>
      </div>

      <div className="mb-8 rounded border p-4">
        <h2 className="mb-3 text-lg font-semibold">Профиль</h2>
        <div className="space-y-2 text-sm">
          <p><strong>UID:</strong> {profile?.uid}</p>
          <p><strong>Email:</strong> {profile?.email || "—"}</p>
          <p><strong>Имя:</strong> {profile?.name || "—"}</p>
          <p><strong>Телефон:</strong> {profile?.phone || "—"}</p>
          <p><strong>Роль:</strong> {profile?.role || "—"}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/find-cargo" className="rounded border p-4 hover:bg-gray-50">
          Найти груз
        </Link>

        <Link href="/post-cargo" className="rounded border p-4 hover:bg-gray-50">
          Разместить груз
        </Link>

        <Link href="/vehicles" className="rounded border p-4 hover:bg-gray-50">
          Мои машины
        </Link>

        <Link href="/bids" className="rounded border p-4 hover:bg-gray-50">
          Мои отклики
        </Link>

        <Link href="/chat" className="rounded border p-4 hover:bg-gray-50">
          Чат
        </Link>

        <Link href="/notifications" className="rounded border p-4 hover:bg-gray-50">
          Уведомления
        </Link>
      </div>
    </main>
  );
}
