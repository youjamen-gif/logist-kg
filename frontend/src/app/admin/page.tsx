'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import {
  getAdminAuditLogs,
  getAdminReports,
  getAdminSettings,
  getAdminUsers,
} from '@/lib/api/admin'

type AdminUser = {
  id: string
  name?: string
  email?: string
  role?: string
  status?: string
  phoneVerified?: boolean
  documentsVerified?: boolean
}

type AdminReport = {
  id: string
  reportType?: string
  status?: string
  message?: string
  createdByUserId?: string
  targetEntityType?: string
  targetEntityId?: string
}

type AdminSetting = {
  id: string
  key: string
  value: string
}

type AuditLog = {
  id: string
  action: string
  entityType: string
  entityId?: string
  createdAt: string
}

export default function AdminPage() {
  const { user, token } = useAuth()

  const [users, setUsers] = useState<AdminUser[]>([])
  const [reports, setReports] = useState<AdminReport[]>([])
  const [settings, setSettings] = useState<AdminSetting[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadAdminData = async () => {
      if (!token || user?.role !== 'admin') return

      try {
        setLoading(true)
        setError('')

        const [usersData, reportsData, settingsData, logsData] =
          await Promise.all([
            getAdminUsers(token),
            getAdminReports(token),
            getAdminSettings(token),
            getAdminAuditLogs(token),
          ])

        setUsers((usersData as AdminUser[]) || [])
        setReports((reportsData as AdminReport[]) || [])
        setSettings((settingsData as AdminSetting[]) || [])
        setAuditLogs((logsData as AuditLog[]) || [])
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки админки')
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [token, user])

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Обзор</h2>
        <p className="mt-2 text-sm text-gray-600">
          Основные показатели платформы.
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Пользователи</p>
          <p className="mt-2 text-3xl font-bold">{users.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Жалобы</p>
          <p className="mt-2 text-3xl font-bold">{reports.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Настройки</p>
          <p className="mt-2 text-3xl font-bold">{settings.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Логи</p>
          <p className="mt-2 text-3xl font-bold">{auditLogs.length}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Последние пользователи</h2>
            <Link href="/admin/users" className="text-sm hover:underline">
              Все
            </Link>
          </div>

          {users.length === 0 ? (
            <p className="text-sm text-gray-600">Пользователей нет.</p>
          ) : (
            <div className="space-y-3">
              {users.slice(0, 5).map((item) => (
                <div key={item.id} className="rounded border p-4">
                  <div className="font-medium">{item.name || 'Без имени'}</div>
                  <div className="mt-1 text-sm text-gray-600">
                    {item.email || '—'}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {item.role || '—'} · {item.status || '—'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Последние жалобы</h2>
            <Link href="/admin/reports" className="text-sm hover:underline">
              Все
            </Link>
          </div>

          {reports.length === 0 ? (
            <p className="text-sm text-gray-600">Жалоб нет.</p>
          ) : (
            <div className="space-y-3">
              {reports.slice(0, 5).map((item) => (
                <div key={item.id} className="rounded border p-4">
                  <div className="font-medium">
                    {item.reportType || 'Жалоба'}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {item.status || 'new'}
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    {item.message || 'Без текста'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}