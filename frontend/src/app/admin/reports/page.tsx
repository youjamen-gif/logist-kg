'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import { getAdminReports } from '@/lib/api/admin'

type AdminReport = {
  id: string
  reportType?: string
  status?: string
  message?: string
  createdByUserId?: string
  targetEntityType?: string
  targetEntityId?: string
  createdAt?: string
}

export default function AdminReportsPage() {
  const { user, token, loading: authLoading } = useAuth()

  const [reports, setReports] = useState<AdminReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    const loadReports = async () => {
      if (!token || !user) return

      try {
        setLoading(true)
        setError('')
        const data = await getAdminReports(token)
        setReports((data as AdminReport[]) || [])
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки жалоб')
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && token && user?.role === 'admin') {
      loadReports()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [authLoading, token, user])

  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const query = search.toLowerCase()

      const matchesSearch =
        !search ||
        item.id?.toLowerCase().includes(query) ||
        item.reportType?.toLowerCase().includes(query) ||
        item.status?.toLowerCase().includes(query) ||
        item.message?.toLowerCase().includes(query) ||
        item.createdByUserId?.toLowerCase().includes(query) ||
        item.targetEntityType?.toLowerCase().includes(query) ||
        item.targetEntityId?.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter

      const matchesType = typeFilter === 'all' || item.reportType === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [reports, search, statusFilter, typeFilter])

  const stats = useMemo(() => {
    return {
      total: reports.length,
      newCount: reports.filter((item) => item.status === 'new').length,
      inReview: reports.filter((item) => item.status === 'in_review').length,
      resolved: reports.filter((item) => item.status === 'resolved').length,
      rejected: reports.filter((item) => item.status === 'rejected').length,
    }
  }, [reports])

  const uniqueTypes = useMemo(() => {
    return Array.from(
      new Set(reports.map((item) => item.reportType).filter(Boolean)),
    ) as string[]
  }, [reports])

  if (authLoading || loading) {
    return <main className="mx-auto max-w-7xl px-6 py-10">Загрузка...</main>
  }

  if (!user || !token) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Жалобы</h1>
          <p className="text-sm text-red-600">Нужно войти в аккаунт.</p>
        </div>
      </main>
    )
  }

  if (user.role !== 'admin') {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Жалобы</h1>
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
        <h1 className="text-3xl font-bold">Жалобы</h1>
        <p className="mt-2 text-sm text-gray-600">
          Управление жалобами и спорными ситуациями на платформе.
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Всего</p>
          <p className="mt-2 text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Новые</p>
          <p className="mt-2 text-3xl font-bold">{stats.newCount}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">На рассмотрении</p>
          <p className="mt-2 text-3xl font-bold">{stats.inReview}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Решённые</p>
          <p className="mt-2 text-3xl font-bold">{stats.resolved}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Отклонённые</p>
          <p className="mt-2 text-3xl font-bold">{stats.rejected}</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Фильтры</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Поиск по ID, типу, статусу, сообщению"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border p-3"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded border p-3"
          >
            <option value="all">Все статусы</option>
            <option value="new">new</option>
            <option value="in_review">in_review</option>
            <option value="resolved">resolved</option>
            <option value="rejected">rejected</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded border p-3"
          >
            <option value="all">Все типы</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Список жалоб</h2>
          <span className="text-sm text-gray-500">
            Найдено: {filteredReports.length}
          </span>
        </div>

        {filteredReports.length === 0 ? (
          <p className="text-sm text-gray-600">Жалоб не найдено.</p>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((item) => (
              <div key={item.id} className="rounded border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{item.reportType || 'Жалоба'}</div>
                    <div className="mt-1 text-sm text-gray-600">
                      ID: {item.id}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded bg-gray-100 px-3 py-1 text-xs">
                      {item.status || 'new'}
                    </span>
                    <span className="rounded bg-gray-100 px-3 py-1 text-xs">
                      {item.targetEntityType || 'entity'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">Кто создал</p>
                    <p className="mt-1 break-all text-sm font-medium">
                      {item.createdByUserId || '—'}
                    </p>
                  </div>

                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">Сущность</p>
                    <p className="mt-1 font-medium">
                      {item.targetEntityType || '—'}
                    </p>
                  </div>

                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">ID сущности</p>
                    <p className="mt-1 break-all text-sm font-medium">
                      {item.targetEntityId || '—'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded border p-3">
                  <p className="text-xs text-gray-500">Сообщение</p>
                  <p className="mt-1 text-sm text-gray-700">
                    {item.message || 'Без текста'}
                  </p>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString('ru-RU')
                    : 'Дата не указана'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}