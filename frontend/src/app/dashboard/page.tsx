'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth-context'
import { getMyFreights } from '@/lib/api/freights'
import { getMyBids } from '@/lib/api/bids'
import { getMyVehicles } from '@/lib/api/vehicles'
import { getMyProfile } from '@/lib/api/users'

type FreightItem = {
  id: string
  originCity: string
  destinationCity: string
  status: string
  price?: number
  currency?: string
  createdAt?: string
}

type BidItem = {
  id: string
  price: number
  status: string
  freight?: {
    id: string
    originCity: string
    destinationCity: string
    status: string
  }
}

type VehicleItem = {
  id: string
  plateNumber: string
  trailerNumber?: string
  truckType: string
  capacity: number
}

type ProfileItem = {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  rating?: number
  reviewsCount?: number
  status?: string
}

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth()

  const [profile, setProfile] = useState<ProfileItem | null>(null)
  const [freights, setFreights] = useState<FreightItem[]>([])
  const [bids, setBids] = useState<BidItem[]>([])
  const [vehicles, setVehicles] = useState<VehicleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      if (!token || !user) return

      try {
        setLoading(true)
        setError('')

        const tasks: Promise<any>[] = [getMyProfile(token)]

        if (['shipper', 'dispatcher', 'admin'].includes(user.role)) {
          tasks.push(getMyFreights(token))
        } else {
          tasks.push(Promise.resolve([]))
        }

        if (['driver', 'admin'].includes(user.role)) {
          tasks.push(getMyBids(token))
          tasks.push(getMyVehicles(token))
        } else {
          tasks.push(Promise.resolve([]))
          tasks.push(Promise.resolve([]))
        }

        const [profileData, freightsData, bidsData, vehiclesData] =
          await Promise.all(tasks)

        setProfile(profileData as ProfileItem)
        setFreights((freightsData as FreightItem[]) || [])
        setBids((bidsData as BidItem[]) || [])
        setVehicles((vehiclesData as VehicleItem[]) || [])
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки кабинета')
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      loadData()
    }
  }, [token, user, authLoading])

  if (authLoading || loading) {
    return <main className="mx-auto max-w-7xl px-6 py-10">Загрузка...</main>
  }

  if (!user || !token) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Кабинет</h1>
          <p className="text-sm text-red-600">Нужно войти в аккаунт.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Личный кабинет</h1>
        <p className="mt-2 text-sm text-gray-600">
          Управление аккаунтом и активностью на платформе.
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="mb-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Профиль</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded border p-4">
              <p className="text-xs text-gray-500">Имя</p>
              <p className="mt-1 font-medium">{profile?.name || '—'}</p>
            </div>

            <div className="rounded border p-4">
              <p className="text-xs text-gray-500">Email</p>
              <p className="mt-1 font-medium">{profile?.email || '—'}</p>
            </div>

            <div className="rounded border p-4">
              <p className="text-xs text-gray-500">Роль</p>
              <p className="mt-1 font-medium">{profile?.role || '—'}</p>
            </div>

            <div className="rounded border p-4">
              <p className="text-xs text-gray-500">Телефон</p>
              <p className="mt-1 font-medium">{profile?.phone || '—'}</p>
            </div>

            <div className="rounded border p-4">
              <p className="text-xs text-gray-500">Рейтинг</p>
              <p className="mt-1 font-medium">
                {profile?.rating ?? 0} ({profile?.reviewsCount ?? 0} отзывов)
              </p>
            </div>

            <div className="rounded border p-4">
              <p className="text-xs text-gray-500">Статус</p>
              <p className="mt-1 font-medium">{profile?.status || '—'}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Быстрые действия</h2>

          <div className="grid gap-3">
            <Link
              href="/find-cargo"
              className="rounded border px-4 py-3 hover:bg-gray-50"
            >
              Найти груз
            </Link>

            {['shipper', 'dispatcher', 'admin'].includes(user.role) ? (
              <Link
                href="/post-cargo"
                className="rounded border px-4 py-3 hover:bg-gray-50"
              >
                Разместить груз
              </Link>
            ) : null}

            {['driver', 'admin'].includes(user.role) ? (
              <>
                <Link
                  href="/vehicles"
                  className="rounded border px-4 py-3 hover:bg-gray-50"
                >
                  Мои машины
                </Link>

                <Link
                  href="/my-bids"
                  className="rounded border px-4 py-3 hover:bg-gray-50"
                >
                  Мои отклики
                </Link>
              </>
            ) : null}

            <Link
              href="/notifications"
              className="rounded border px-4 py-3 hover:bg-gray-50"
            >
              Уведомления
            </Link>

            {user.role === 'admin' ? (
              <Link
                href="/admin"
                className="rounded border px-4 py-3 hover:bg-gray-50"
              >
                Админка
              </Link>
            ) : null}
          </div>
        </section>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {['shipper', 'dispatcher', 'admin'].includes(user.role) ? (
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Мои грузы</h2>
              <Link href="/post-cargo" className="text-sm hover:underline">
                Добавить
              </Link>
            </div>

            {freights.length === 0 ? (
              <p className="text-sm text-gray-600">Грузов пока нет.</p>
            ) : (
              <div className="space-y-3">
                {freights.slice(0, 5).map((item) => (
                  <div key={item.id} className="rounded border p-4">
                    <div className="font-medium">
                      {item.originCity} → {item.destinationCity}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {item.price
                        ? `${item.price} ${item.currency || 'KGS'}`
                        : 'Договорная'}{' '}
                      · {item.status}
                    </div>
                    <div className="mt-3">
                      <Link
                        href={`/cargo/${item.id}`}
                        className="text-sm hover:underline"
                      >
                        Открыть
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {['driver', 'admin'].includes(user.role) ? (
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Мои отклики</h2>
              <Link href="/my-bids" className="text-sm hover:underline">
                Все
              </Link>
            </div>

            {bids.length === 0 ? (
              <p className="text-sm text-gray-600">Откликов пока нет.</p>
            ) : (
              <div className="space-y-3">
                {bids.slice(0, 5).map((item) => (
                  <div key={item.id} className="rounded border p-4">
                    <div className="font-medium">
                      {item.freight?.originCity || '—'} →{' '}
                      {item.freight?.destinationCity || '—'}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {item.price} · {item.status}
                    </div>
                    {item.freight?.id ? (
                      <div className="mt-3">
                        <Link
                          href={`/cargo/${item.freight.id}`}
                          className="text-sm hover:underline"
                        >
                          Открыть груз
                        </Link>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}
      </div>

      {['driver', 'admin'].includes(user.role) ? (
        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Мои машины</h2>
            <Link href="/vehicles" className="text-sm hover:underline">
              Управление
            </Link>
          </div>

          {vehicles.length === 0 ? (
            <p className="text-sm text-gray-600">Машин пока нет.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {vehicles.slice(0, 6).map((item) => (
                <div key={item.id} className="rounded border p-4">
                  <div className="font-medium">{item.plateNumber}</div>
                  <div className="mt-1 text-sm text-gray-600">
                    {item.trailerNumber || 'Без прицепа'}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {item.truckType} · {item.capacity} т
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </main>
  )
}