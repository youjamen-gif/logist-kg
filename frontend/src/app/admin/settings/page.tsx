'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import { getAdminSettings } from '@/lib/api/admin'

type AdminSetting = {
  id: string
  key: string
  value: string
  description?: string
  updatedAt?: string
}

export default function AdminSettingsPage() {
  const { user, token, loading: authLoading } = useAuth()

  const [settings, setSettings] = useState<AdminSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadSettings = async () => {
      if (!token || !user) return

      try {
        setLoading(true)
        setError('')
        const data = await getAdminSettings(token)
        setSettings((data as AdminSetting[]) || [])
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки настроек')
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && token && user?.role === 'admin') {
      loadSettings()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [authLoading, token, user])

  const filteredSettings = useMemo(() => {
    return settings.filter((item) => {
      if (!search) return true

      const query = search.toLowerCase()
      return (
        item.key?.toLowerCase().includes(query) ||
        item.value?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      )
    })
  }, [settings, search])

  if (authLoading || loading) {
    return <main className="mx-auto max-w-7xl px-6 py-10">Загрузка...</main>
  }

  if (!user || !token) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Настройки</h1>
          <p className="text-sm text-red-600">Нужно войти в аккаунт.</p>
        </div>
      </main>
    )
  }

  if (user.role !== 'admin') {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Настройки</h1>
          <p className="text-sm text-red-600">Доступ только для администратора.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2">
            <Link href="/admin" className="text-sm text-gray-500 hover:underline">
              ← Назад в админку
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Настройки платформы</h1>
          <p className="mt-2 text-sm text-gray-600">
            Системные параметры и конфигурация Logist.kg
          </p>
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Всего настроек</p>
          <p className="mt-1 text-2xl font-bold">{settings.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">После фильтра</p>
          <p className="mt-1 text-2xl font-bold">{filteredSettings.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Статус</p>
          <p className="mt-1 text-2xl font-bold">Active</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Поиск</h2>

        <input
          type="text"
          placeholder="Поиск по ключу, значению или описанию"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border p-3"
        />
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Список настроек</h2>
          <span className="text-sm text-gray-500">
            Найдено: {filteredSettings.length}
          </span>
        </div>

        {filteredSettings.length === 0 ? (
          <p className="text-sm text-gray-600">Настройки не найдены.</p>
        ) : (
          <div className="space-y-4">
            {filteredSettings.map((item) => (
              <div key={item.id} className="rounded border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-medium break-all">{item.key}</div>
                    {item.description ? (
                      <div className="mt-1 text-sm text-gray-600">
                        {item.description}
                      </div>
                    ) : null}
                  </div>

                  <span className="rounded bg-gray-100 px-3 py-1 text-xs">
                    setting
                  </span>
                </div>

                <div className="mt-4 rounded border p-3">
                  <p className="text-xs text-gray-500">Значение</p>
                  <p className="mt-1 break-all text-sm text-gray-800">
                    {item.value || '—'}
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">ID</p>
                    <p className="mt-1 break-all text-sm font-medium">{item.id}</p>
                  </div>

                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">Обновлено</p>
                    <p className="mt-1 font-medium">
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleString('ru-RU')
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