'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth-context'
import { apiFetch } from '@/lib/api/client'

type NotificationItem = {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

async function getMyNotifications(token: string) {
  return apiFetch<NotificationItem[]>('/notifications/my', {
    method: 'GET',
    token,
  })
}

async function markNotificationRead(token: string, id: string) {
  return apiFetch(`/notifications/${id}/read`, {
    method: 'PATCH',
    token,
  })
}

async function markAllNotificationsRead(token: string) {
  return apiFetch('/notifications/read-all', {
    method: 'PATCH',
    token,
  })
}

export default function NotificationsPage() {
  const { user, token, loading: authLoading } = useAuth()

  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const loadNotifications = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError('')
      const data = await getMyNotifications(token)
      setNotifications(data || [])
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки уведомлений')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && token) {
      loadNotifications()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [authLoading, token])

  const handleReadOne = async (id: string) => {
    if (!token) return

    try {
      setActionLoading(true)
      await markNotificationRead(token, id)

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isRead: true } : item,
        ),
      )
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления уведомления')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReadAll = async () => {
    if (!token) return

    try {
      setActionLoading(true)
      await markAllNotificationsRead(token)

      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true })),
      )
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления уведомлений')
    } finally {
      setActionLoading(false)
    }
  }

  if (authLoading || loading) {
    return <main className="mx-auto max-w-6xl px-6 py-10">Загрузка...</main>
  }

  if (!user || !token) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Уведомления</h1>
          <p className="text-sm text-red-600">Нужно войти в аккаунт.</p>
        </div>
      </main>
    )
  }

  const unreadCount = notifications.filter((item) => !item.isRead).length

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Уведомления</h1>
          <p className="mt-2 text-sm text-gray-600">
            Все системные события и обновления по вашим действиям.
          </p>
        </div>

        <button
          onClick={handleReadAll}
          disabled={actionLoading || notifications.length === 0 || unreadCount === 0}
          className="rounded border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          Отметить все как прочитанные
        </button>
      </div>

      {error ? (
        <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Всего</p>
          <p className="mt-1 text-2xl font-bold">{notifications.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Непрочитанные</p>
          <p className="mt-1 text-2xl font-bold">{unreadCount}</p>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Прочитанные</p>
          <p className="mt-1 text-2xl font-bold">
            {notifications.length - unreadCount}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-600">Уведомлений пока нет.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`rounded border p-4 ${
                  item.isRead ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      {item.type}
                    </div>
                  </div>

                  <span
                    className={`rounded px-3 py-1 text-xs ${
                      item.isRead ? 'bg-gray-100' : 'bg-black text-white'
                    }`}
                  >
                    {item.isRead ? 'Прочитано' : 'Новое'}
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-700">{item.message}</p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-gray-500">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString('ru-RU')
                      : '—'}
                  </span>

                  {!item.isRead ? (
                    <button
                      onClick={() => handleReadOne(item.id)}
                      disabled={actionLoading}
                      className="rounded border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                      Отметить как прочитанное
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}