'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getFreights } from '@/lib/api/freights'

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
}

type FreightResponse = {
  items: FreightItem[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function FindCargoPage() {
  const [freights, setFreights] = useState<FreightItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    originCity: '',
    destinationCity: '',
    truckType: '',
    originCountry: '',
    destinationCountry: '',
    page: '1',
    limit: '20',
  })

  const loadFreights = async () => {
    try {
      setLoading(true)
      setError('')

      const data = (await getFreights(filters)) as FreightResponse
      setFreights(data.items || [])
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки грузов')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFreights()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await loadFreights()
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Поиск грузов</h1>
        <p className="mt-2 text-sm text-gray-600">
          Найдите подходящие грузы по маршруту и типу транспорта.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border bg-white p-5 shadow-sm">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <input
            name="originCity"
            type="text"
            placeholder="Город отправления"
            value={filters.originCity}
            onChange={handleChange}
            className="w-full rounded border p-3"
          />

          <input
            name="destinationCity"
            type="text"
            placeholder="Город назначения"
            value={filters.destinationCity}
            onChange={handleChange}
            className="w-full rounded border p-3"
          />

          <input
            name="originCountry"
            type="text"
            placeholder="Страна отправления"
            value={filters.originCountry}
            onChange={handleChange}
            className="w-full rounded border p-3"
          />

          <input
            name="destinationCountry"
            type="text"
            placeholder="Страна назначения"
            value={filters.destinationCountry}
            onChange={handleChange}
            className="w-full rounded border p-3"
          />

          <select
            name="truckType"
            value={filters.truckType}
            onChange={handleChange}
            className="w-full rounded border p-3"
          >
            <option value="">Тип кузова</option>
            <option value="tent">Тент</option>
            <option value="refrigerator">Рефрижератор</option>
            <option value="container">Контейнер</option>
            <option value="flatbed">Площадка</option>
          </select>

          <button
            type="submit"
            className="rounded bg-black px-4 py-3 text-white"
          >
            Найти
          </button>
        </form>
      </div>

      {loading ? <p>Загрузка...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {!loading && !error && freights.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-gray-600">Грузы не найдены.</p>
        </div>
      ) : null}

      {!loading && freights.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3">Маршрут</th>
                <th className="px-4 py-3">Вес</th>
                <th className="px-4 py-3">Цена</th>
                <th className="px-4 py-3">Кузов</th>
                <th className="px-4 py-3">Дата</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody>
              {freights.map((item) => (
                <tr key={item.id} className="border-b align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {item.originCity} → {item.destinationCity}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.originCountry} / {item.destinationCountry}
                    </div>
                  </td>

                  <td className="px-4 py-3">{item.weight} т</td>

                  <td className="px-4 py-3">
                    {item.price ? `${item.price} ${item.currency || 'KGS'}` : 'Договорная'}
                  </td>

                  <td className="px-4 py-3">{item.truckType}</td>

                  <td className="px-4 py-3">
                    {item.loadingDate
                      ? new Date(item.loadingDate).toLocaleDateString('ru-RU')
                      : '—'}
                  </td>

                  <td className="px-4 py-3">{item.status}</td>

                  <td className="px-4 py-3">
                    <Link
                      href={`/cargo/${item.id}`}
                      className="rounded border px-3 py-2 hover:bg-gray-50"
                    >
                      Открыть
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </main>
  )
}