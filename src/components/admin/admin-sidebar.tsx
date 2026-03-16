'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const adminNavItems = [
  {
    href: '/admin',
    label: 'Обзор',
  },
  {
    href: '/admin/users',
    label: 'Пользователи',
  },
  {
    href: '/admin/freights',
    label: 'Грузы',
  },
  {
    href: '/admin/reports',
    label: 'Жалобы',
  },
  {
    href: '/admin/verification',
    label: 'Верификация',
  },
  {
    href: '/admin/banners',
    label: 'Баннеры',
  },
  {
    href: '/admin/ads',
    label: 'Реклама',
  },
  {
    href: '/admin/settings',
    label: 'Настройки',
  },
  {
    href: '/admin/audit-logs',
    label: 'Audit logs',
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }

    return pathname.startsWith(href)
  }

  return (
    <aside className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Админ-меню</h2>
        <p className="mt-1 text-sm text-gray-500">Управление платформой</p>
      </div>

      <nav className="space-y-2">
        {adminNavItems.map((item) => {
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? 'bg-black text-white'
                  : 'border border-transparent hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
