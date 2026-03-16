'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth-context'
import { getMyBids } from '@/lib/api/bids'

type BidItem = {
  id: string
  price: number
  message?: string
  status: string
  createdAt?: string
  freight?: {
    id: string
    originCity: string
    destinationCity: string
    originCountry?: string
    destinationCountry?: string
    weight?: number
    status?: string
    truckType?: string
  }
}

export default function MyBidsPage() {
  const { user, token, loading: authLoading } = useAuth()

  const [bids, setBids] = useState<BidItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBids = async () => {
      if (!token) return

      try {
        setLoading(true)
        setError('')
        const data = (await getMyBids(token)) as BidItem[]
        setBids(data || [])
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки откликов')
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && token) {
      loadBids()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [authLoading, token])

  if (authLoading || loading) {
    return <main className="mx-auto max-w-6xl px-6 py-10">Загрузка...</main>
  }

  if (!user || !token) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Мои отклики</h1>
          <p className="text-sm text-red-600">Нужно войти в аккаунт.</p>
        </div>
      </main>
    )
  }

  if (!['driver', 'admin'].includes(user.role)) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Мои отклики</h1>
          <p className="text-sm text-red-600">
            Только водитель может просматривать свои отклики.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Мои отклики</h1>
        <p className="mt-2 text-sm text-gray-600">
          Все ваши предложения по грузам в одном месте.
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        {bids.length === 0 ? (
          <p className="text-sm text-gray-600">Откликов пока нет.</p>
        ) : (
          <div className="space-y-4">
            {bids.map((item) => (
              <div key={item.id} className="rounded border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">
                      {item.freight?.originCity || '—'} →{' '}
                      {item.freight?.destinationCity || '—'}
                    </div>

                    <div className="mt-1 text-sm text-gray-600">
                      {(item.freight?.originCountry || '—')} /{' '}
                      {(item.freight?.destinationCountry || '—')}
                    </div>
                  </div>

                  <span className="rounded bg-gray-100 px-3 py-1 text-xs">
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">Моя цена</p>
                    <p className="mt-1 font-medium">{item.price}</p>
                  </div>

                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">Статус груза</p>
                    <p className="mt-1 font-medium">
                      {item.freight?.status || '—'}
                    </p>
                  </div>

                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">Тип кузова</p>
                    <p className="mt-1 font-medium">
                      {item.freight?.truckType || '—'}
                    </p>
                  </div>

                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">Вес</p>
                    <p className="mt-1 font-medium">
                      {item.freight?.weight ?? '—'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded border p-3">
                  <p className="text-xs text-gray-500">Сообщение</p>
                  <p className="mt-1 text-sm text-gray-700">
                    {item.message || 'Без сообщения'}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {item.freight?.id ? (
                    <Link
                      href={`/cargo/${item.freight.id}`}
                      className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      Открыть груз
                    </Link>
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
