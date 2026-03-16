'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth-context'
import {
  createVehicle,
  deleteVehicle,
  getMyVehicles,
} from '@/lib/api/vehicles'

type VehicleItem = {
  id: string
  plateNumber: string
  trailerNumber?: string
  truckType: string
  capacity: number
  dimensions?: string
  techPassportUrl?: string
}

export default function VehiclesPage() {
  const { user, token, loading: authLoading } = useAuth()

  const [vehicles, setVehicles] = useState<VehicleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    plateNumber: '',
    trailerNumber: '',
    truckType: 'tent',
    capacity: '',
    dimensions: '',
  })

  const loadVehicles = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError('')
      const data = (await getMyVehicles(token)) as VehicleItem[]
      setVehicles(data || [])
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки машин')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && token) {
      loadVehicles()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [authLoading, token])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Нужно войти в аккаунт')
      return
    }

    try {
      setSubmitting(true)

      await createVehicle(token, {
        plateNumber: form.plateNumber,
        trailerNumber: form.trailerNumber || undefined,
        truckType: form.truckType,
        capacity: Number(form.capacity),
        dimensions: form.dimensions || undefined,
      })

      setForm({
        plateNumber: '',
        trailerNumber: '',
        truckType: 'tent',
        capacity: '',
        dimensions: '',
      })

      await loadVehicles()
    } catch (err: any) {
      setError(err.message || 'Ошибка добавления машины')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!token) return

    try {
      setError('')
      await deleteVehicle(token, id)
      setVehicles((prev) => prev.filter((item) => item.id !== id))
    } catch (err: any) {
      setError(err.message || 'Ошибка удаления машины')
    }
  }

  if (authLoading || loading) {
    return <main className="mx-auto max-w-6xl px-6 py-10">Загрузка...</main>
  }

  if (!user || !token) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Мои машины</h1>
          <p className="text-sm text-red-600">Нужно войти в аккаунт.</p>
        </div>
      </main>
    )
  }

  if (!['driver', 'admin'].includes(user.role)) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Мои машины</h1>
          <p className="text-sm text-red-600">
            Только водитель может управлять машинами.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Мои машины</h1>
        <p className="mt-2 text-sm text-gray-600">
          Добавляйте транспорт и управляйте своим автопарком.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Добавить машину</h2>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <input
            name="plateNumber"
            type="text"
            placeholder="Госномер"
            value={form.plateNumber}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <input
            name="trailerNumber"
            type="text"
            placeholder="Номер прицепа"
            value={form.trailerNumber}
            onChange={handleChange}
            className="w-full rounded border p-3"
          />

          <select
            name="truckType"
            value={form.truckType}
            onChange={handleChange}
            className="w-full rounded border p-3"
          >
            <option value="tent">Тент</option>
            <option value="refrigerator">Рефрижератор</option>
            <option value="container">Контейнер</option>
            <option value="flatbed">Площадка</option>
          </select>

          <input
            name="capacity"
            type="number"
            step="0.1"
            placeholder="Грузоподъёмность"
            value={form.capacity}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <input
            name="dimensions"
            type="text"
            placeholder="Габариты"
            value={form.dimensions}
            onChange={handleChange}
            className="w-full rounded border p-3 md:col-span-2"
          />

          {error ? (
            <p className="text-sm text-red-600 md:col-span-2">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-black px-4 py-3 text-white disabled:opacity-50 md:col-span-2"
          >
            {submitting ? 'Сохранение...' : 'Добавить машину'}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Список машин</h2>

        {vehicles.length === 0 ? (
          <p className="text-sm text-gray-600">Машин пока нет.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((item) => (
              <div key={item.id} className="rounded border p-4">
                <div className="font-medium">{item.plateNumber}</div>
                <div className="mt-1 text-sm text-gray-600">
                  {item.trailerNumber || 'Без прицепа'}
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {item.truckType} · {item.capacity} т
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {item.dimensions || 'Габариты не указаны'}
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}