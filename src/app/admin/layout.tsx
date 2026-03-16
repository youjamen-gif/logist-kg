'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import AdminSidebar from '@/components/admin/admin-sidebar'

type AdminLayoutProps = {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, token, loading: authLoading } = useAuth()

  if (authLoading) {
    return <main className="mx-auto max-w-7xl px-6 py-10">Загрузка...</main>
  }

  if (!user || !token) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Админка</h1>
          <p className="text-sm text-red-600">Нужно войти в аккаунт.</p>
          <div className="mt-4">
            <Link
              href="/login"
              className="inline-flex rounded border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Перейти ко входу
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (user.role !== 'admin') {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Админка</h1>
          <p className="text-sm text-red-600">
            Доступ только для администратора.
          </p>
          <div className="mt-4">
            <Link
              href="/dashboard"
              className="inline-flex rounded border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Вернуться в кабинет
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Админ-панель</h1>
          <p className="mt-2 text-sm text-gray-600">
            Управление платформой Logist.kg
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Кабинет
          </Link>
          <Link
            href="/"
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            На сайт
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div>
          <AdminSidebar />
        </div>

        <div className="min-w-0">{children}</div>
      </div>
    </main>
  )
}
