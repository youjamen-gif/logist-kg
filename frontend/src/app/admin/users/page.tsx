'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/context/auth-context'
import { getAdminUsers } from '@/lib/api/admin'

type AdminUser = {
  id: string
  name?: string
  email?: string
  phone?: string
  role?: string
  status?: string
  phoneVerified?: boolean
  documentsVerified?: boolean
  createdAt?: string
}

export default function AdminUsersPage() {
  const { user, token } = useAuth()

  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const loadUsers = async () => {
      if (!token || user?.role !== 'admin') return

      try {
        setLoading(true)
        setError('')
        const data = await getAdminUsers(token)
        setUsers((data as AdminUser[]) || [])
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки пользователей')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [token, user])

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const query = search.toLowerCase()

      const matchesSearch =
        !search ||
        item.name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.phone?.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)

      const matchesRole = roleFilter === 'all' || item.role === roleFilter
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, search, roleFilter, statusFilter])

  const stats = useMemo(() => {
    return {
      total: users.length,
      drivers: users.filter((item) => item.role === 'driver').length,
      shippers: users.filter((item) => item.role === 'shipper').length,
      admins: users.filter((item) => item.role === 'admin').length,
      active: users.filter((item) => item.status === 'active').length,
      pending: users.filter((item) => item.status === 'pending').length,
      blocked: users.filter((item) => item.status === 'blocked').length,
    }
  }, [users])

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Пользователи</h2>
        <p className="mt-2 text-sm text-gray-600">
          Список всех пользователей платформы.
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Всего пользователей</p>
          <p className="mt-2 text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Водители</p>
          <p className="mt-2 text-3xl font-bold">{stats.drivers}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Грузовладельцы</p>
          <p className="mt-2 text-3xl font-bold">{stats.shippers}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Админы</p>
          <p className="mt-2 text-3xl font-bold">{stats.admins}</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Активные</p>
          <p className="mt-1 text-2xl font-bold">{stats.active}</p>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">На проверке</p>
          <p className="mt-1 text-2xl font-bold">{stats.pending}</p>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Заблокированные</p>
          <p className="mt-1 text-2xl font-bold">{stats.blocked}</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold">Фильтры</h3>

        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Поиск по имени, email, телефону, ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border p-3"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full rounded border p-3"
          >
            <option value="all">Все роли</option>
            <option value="driver">Водитель</option>
            <option value="shipper">Грузовладелец</option>
            <option value="dispatcher">Диспетчер</option>
            <option value="admin">Администратор</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded border p-3"
          >
            <option value="all">Все статусы</option>
            <option value="active">Активный</option>
            <option value="pending">На проверке</option>
            <option value="blocked">Заблокирован</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">Список пользователей</h3>
          <span className="text-sm text-gray-500">
            Найдено: {filteredUsers.length}
          </span>
        </div>

        {filteredUsers.length === 0 ? (
          <p className="text-sm text-gray-600">Пользователи не найдены.</p>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((item) => (
              <div key={item.id} className="rounded border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{item.name || 'Без имени'}</div>
                    <div className="mt-1 text-sm text-gray-600">
                      {item.email || 'Email не указан'}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {item.phone || 'Телефон не указан'}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded bg-gray-100 px-3 py-1 text-xs">
                      {item.role || '—'}
                    </span>
                    <span className="rounded bg-gray-100 px-3 py-1 text-xs">
                      {item.status || '—'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">ID</p>
                    <p className="mt-1 break-all text-sm font-medium">{item.id}</p>
                  </div>

                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">Телефон подтверждён</p>
                    <p className="mt-1 font-medium">
                      {item.phoneVerified ? 'Да' : 'Нет'}
                    </p>
                  </div>

                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">Документы проверены</p>
                    <p className="mt-1 font-medium">
                      {item.documentsVerified ? 'Да' : 'Нет'}
                    </p>
                  </div>

                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">Дата создания</p>
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
    </div>
  )
}