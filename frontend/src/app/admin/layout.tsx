'use client'

import { useAuth } from '@/context/auth-context'
import AdminSidebar from '@/components/admin/admin-sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="p-10 text-center">
        Загрузка...
      </main>
    )
  }

  if (!user || user.role !== 'admin') {
    return (
      <main className="p-10 text-center">
        Доступ запрещён
      </main>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  )
}