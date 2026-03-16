'use client'

import Link from 'next/link'

export default function AdminSidebar() {
  return (
    <aside className="w-64 border-r bg-white p-6">
      <h2 className="mb-6 text-lg font-bold">Админка</h2>

      <nav className="flex flex-col gap-3 text-sm">

        <Link href="/admin">Dashboard</Link>

        <Link href="/admin/users">Пользователи</Link>

        <Link href="/admin/freights">Грузы</Link>

        <Link href="/admin/reports">Жалобы</Link>

        <Link href="/admin/verification">Верификация</Link>

        <Link href="/admin/banners">Баннеры</Link>

        <Link href="/admin/ads">Реклама</Link>

        <Link href="/admin/settings">Настройки</Link>

        <Link href="/admin/audit-logs">Audit Logs</Link>

      </nav>
    </aside>
  )
}