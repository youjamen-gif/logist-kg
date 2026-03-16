'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getFreightById } from '@/lib/api/freights'
import { createBid } from '@/lib/api/bids'
import { useAuth } from '@/context/auth-context'

type BidItem = {
  id: string
  price: number
  message?: string
  status: string
  driverUserId: string
}

type FreightItem = {
  id: string
  originCity: string
  destinationCity: string
  originCountry: string
  destinationCountry: string
  weight: number
  price?: number
  currency?: string
  truckType: string
  loadingDate: string
  status: string
  description?: string
  createdByUserId: string
  acceptedDriverId?: string | null
  bids?: BidItem[]
}

export default function CargoDetailsPage() {
  const params = useParams()
  const cargoId = params?.id as string

  const { token, user, loading: authLoading } = useAuth()

  const [cargo, setCargo] = useState<FreightItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [bidPrice, setBidPrice] = useState('')
  const [bidMessage, setBidMessage] = useState('')
  const [bidLoading, setBidLoading] = useState(false)
  const [bidSuccess, setBidSuccess] = useState('')

  const loadCargo = async () => {
    try {
      setLoading(true)
      setError('')
      const data = (await getFreightById(cargoId)) as FreightItem
      setCargo(data)
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки груза')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (cargoId) {
      loadCargo()
    }
  }, [cargoId])

  const handleBidSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBidSuccess('')
    setError('')

    if (!token) {
      setError('Нужно войти в аккаунт')
      return
    }

    try {
      setBidLoading(true)

      await createBid(token, {
        freightId: cargoId,
        price: Number(bidPrice),
        message: bidMessage,
      })

      setBidPrice('')
      setBidMessage('')
      setBidSuccess('Отклик отправлен')
      await loadCargo()
    } catch (err: any) {
      setError(err.message || 'Ошибка отправки отклика')
    } finally {
      setBidLoading(false)
    }
  }

  const canBid =
    user &&
    token &&
    user.role === 'driver' &&
    cargo &&
    cargo.status === 'active'

  if (loading || authLoading) {
    return <main className="mx-auto max-w-6xl px-6 py-10">Загрузка...</main>
  }

  if (error && !cargo) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-red-600">{error}</p>
      </main>
    )
  }

  if (!cargo) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p>Груз не найден</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">
              {cargo.originCity} → {cargo.destinationCity}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {cargo.originCountry} / {cargo.destinationCountry}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded border p-4">
              <p className="text-xs text-gray-500">Вес</p>
              <p className="mt-1 font-medium">{cargo.weight} т</p>
            </div>

            <div className="rounded border p-4">
              <p className="text-xs text-gray-500">Цена</p>
              <p className="mt-1 font-medium">
                {cargo.price
                  ? `${cargo.price} ${cargo.currency || 'KGS'}`
                  : 'Договорная'}
              </p>
            </div>

            <div className="rounded border p-4">
              <p className="text-xs text-gray-500">Тип кузова</p>
              <p className="mt-1 font-medium">{cargo.truckType}</p>
            </div>

            <div className="rounded border p-4">
              <p className="text-xs text-gray-500">Дата загрузки</p>
              <p className="mt-1 font-medium">
                {cargo.loadingDate
                  ? new Date(cargo.loadingDate).toLocaleDateString('ru-RU')
                  : '—'}
              </p>
            </div>

            <div className="rounded border p-4">
              <p className="text-xs text-gray-500">Статус</p>
              <p className="mt-1 font-medium">{cargo.status}</p>
            </div>

            <div className="rounded border p-4">
              <p className="text-xs text-gray-500">Откликов</p>
              <p className="mt-1 font-medium">{cargo.bids?.length || 0}</p>
            </div>
          </div>

          <div className="mt-6 rounded border p-4">
            <p className="mb-2 text-xs text-gray-500">Описание</p>
            <p className="text-sm text-gray-700">
              {cargo.description || 'Описание не указано'}
            </p>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Отклик на груз</h2>

            {!user ? (
              <p className="text-sm text-gray-600">
                Войдите как водитель, чтобы отправить отклик.
              </p>
            ) : user.role !== 'driver' ? (
              <p className="text-sm text-gray-600">
                Только водитель может откликнуться на груз.
              </p>
            ) : cargo.status !== 'active' ? (
              <p className="text-sm text-gray-600">
                Отклик недоступен. Груз не активен.
              </p>
            ) : (
              <form onSubmit={handleBidSubmit} className="space-y-4">
                <input
                  type="number"
                  placeholder="Ваша цена"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  className="w-full rounded border p-3"
                  required
                />

                <textarea
                  placeholder="Сообщение"
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  className="min-h-[120px] w-full rounded border p-3"
                />

                {error ? (
                  <p className="text-sm text-red-600">{error}</p>
                ) : null}

                {bidSuccess ? (
                  <p className="text-sm text-green-600">{bidSuccess}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={!canBid || bidLoading}
                  className="w-full rounded bg-black px-4 py-3 text-white disabled:opacity-50"
                >
                  {bidLoading ? 'Отправка...' : 'Отправить отклик'}
                </button>
              </form>
            )}
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Информация</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>ID груза:</strong> {cargo.id}
              </p>
              <p>
                <strong>Владелец:</strong> {cargo.createdByUserId}
              </p>
              {cargo.acceptedDriverId ? (
                <p>
                  <strong>Принятый водитель:</strong> {cargo.acceptedDriverId}
                </p>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}