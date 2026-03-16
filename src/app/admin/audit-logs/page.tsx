'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import { getAdminAuditLogs } from '@/lib/api/admin'

type AuditLog = {
  id: string
  action: string
  entityType: string
  entityId?: string
  userId?: string
  createdAt: string
}

export default function AdminAuditLogsPage() {
  const { user, token, loading: authLoading } = useAuth()

  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [entityFilter, setEntityFilter] = useState('all')

  useEffect(() => {
    const loadLogs = async () => {
      if (!token || !user) return

      try {
        setLoading(true)
        setError('')
        const data = await getAdminAuditLogs(token)
        setLogs((data as AuditLog[]) || [])
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки логов')
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && token && user?.role === 'admin') {
      loadLogs()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [authLoading, token, user])

  const uniqueActions = useMemo(() => {
    return Array.from(new Set(logs.map((item) => item.action).filter(Boolean)))
  }, [logs])

  const uniqueEntities = useMemo(() => {
    return Array.from(
      new Set(logs.map((item) => item.entityType).filter(Boolean)),
    )
  }, [logs])

  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      const query = search.toLowerCase()

      const matchesSearch =
        !search ||
        item.id?.toLowerCase().includes(query) ||
        item.action?.toLowerCase().includes(query) ||
        item.entityType?.toLowerCase().includes(query) ||
        item.entityId?.toLowerCase().includes(query) ||
        item.userId?.toLowerCase().includes(query)

      const matchesAction =
        actionFilter === 'all' || item.action === actionFilter

      const matchesEntity =
        entityFilter === 'all' || item.entityType === entityFilter

      return matchesSearch && matchesAction && matchesEntity
    })
  }, [logs, search, actionFilter, entityFilter])

  if (authLoading || loading) {
    return <main className="mx-auto max-w-7xl px-6 py-10">Загрузка...</main>
  }

  if (!user || !token) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Audit logs</h1>
          <p className="text-sm text-red-600">Нужно войти в аккаунт.</p>
        </div>
      </main>
    )
  }

  if (user.role !== 'admin') {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Audit logs</h1>
          <p className="text-sm text-red-600">Доступ только для администратора.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <div className="mb-2">
          <Link href="/admin" className="text-sm text-gray-500 hover:underline">
            ← Назад в админку
          </Link>
        </div>
        <h1 className="text-3xl font-bold">Audit logs</h1>
        <p className="mt-2 text-sm text-gray-600">
          История действий пользователей и системы.
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Всего логов</p>
          <p className="mt-1 text-2xl font-bold">{logs.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">После фильтра</p>
          <p className="mt-1 text-2xl font-bold">{filteredLogs.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Уникальных действий</p>
          <p className="mt-1 text-2xl font-bold">{uniqueActions.length}</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Фильтры</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Поиск по action, entity, userId, ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border p-3"
          />

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full rounded border p-3"
          >
            <option value="all">Все действия</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>

          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="w-full rounded border p-3"
          >
            <option value="all">Все сущности</option>
            {uniqueEntities.map((entity) => (
              <option key={entity} value={entity}>
                {entity}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Список логов</h2>
          <span className="text-sm text-gray-500">
            Найдено: {filteredLogs.length}
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <p className="text-sm text-gray-600">Логи не найдены.</p>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((item) => (
              <div key={item.id} className="rounded border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{item.action}</div>
                    <div className="mt-1 text-sm text-gray-600">
                      {item.entityType} {item.entityId ? `· ${item.entityId}` : ''}
                    </div>
                  </div>

                  <span className="rounded bg-gray-100 px-3 py-1 text-xs">
                    {item.entityType}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">Log ID</p>
                    <p className="mt-1 break-all text-sm font-medium">{item.id}</p>
                  </div>

                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">Action</p>
                    <p className="mt-1 font-medium">{item.action}</p>
                  </div>

                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">User ID</p>
                    <p className="mt-1 break-all text-sm font-medium">
                      {item.userId || '—'}
                    </p>
                  </div>

                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">Дата</p>
                    <p className="mt-1 font-medium">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString('ru-RU')
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
