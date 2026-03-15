"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function AdminPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (!loading && profile?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [loading, user, profile, router]);

  if (loading) {
    return <main className="p-6">Загрузка...</main>;
  }

  if (!user || profile?.role !== "admin") {
    return null;
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Админ-панель</h1>
        <p className="text-sm text-gray-600">
          Управление платформой Logist.kg
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/users" className="rounded border p-4 hover:bg-gray-50">
          Пользователи
        </Link>

        <Link href="/admin/freights" className="rounded border p-4 hover:bg-gray-50">
          Грузы
        </Link>

        <Link href="/admin/reports" className="rounded border p-4 hover:bg-gray-50">
          Жалобы
        </Link>

        <Link href="/admin/verification" className="rounded border p-4 hover:bg-gray-50">
          Проверка документов
        </Link>

        <Link href="/admin/ads" className="rounded border p-4 hover:bg-gray-50">
          Реклама
        </Link>

        <Link href="/admin/banners" className="rounded border p-4 hover:bg-gray-50">
          Баннеры
        </Link>

        <Link href="/admin/notifications" className="rounded border p-4 hover:bg-gray-50">
          Уведомления
        </Link>

        <Link href="/admin/audit-logs" className="rounded border p-4 hover:bg-gray-50">
          Логи
        </Link>

        <Link href="/admin/settings" className="rounded border p-4 hover:bg-gray-50">
          Настройки
        </Link>
      </div>
    </main>
  );
}
