'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createFreight } from '@/lib/api/freights'
import { useAuth } from '@/context/auth-context'

export default function PostCargoPage() {
  const router = useRouter()
  const { token, user, loading } = useAuth()

  const [form, setForm] = useState({
    originCity: '',
    destinationCity: '',
    originCountry: '',
    destinationCountry: '',
    weight: '',
    price: '',
    currency: 'KGS',
    truckType: 'tent',
    description: '',
    loadingDate: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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

    if (!user || !['shipper', 'dispatcher', 'admin'].includes(user.role)) {
      setError('Только грузовладелец или диспетчер может разместить груз')
      return
    }

    try {
      setSubmitting(true)

      const created = (await createFreight(token, {
        originCity: form.originCity,
        destinationCity: form.destinationCity,
        originCountry: form.originCountry,
        destinationCountry: form.destinationCountry,
        weight: Number(form.weight),
        price: form.price ? Number(form.price) : undefined,
        currency: form.currency,
        truckType: form.truckType,
        description: form.description,
        loadingDate: form.loadingDate,
      })) as { id: string }

      router.push(`/cargo/${created.id}`)
    } catch (err: any) {
      setError(err.message || 'Ошибка создания груза')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <main className="mx-auto max-w-4xl px-6 py-10">Загрузка...</main>
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Разместить груз</h1>
          <p className="text-sm text-red-600">Сначала войдите в аккаунт.</p>
        </div>
      </main>
    )
  }

  if (!['shipper', 'dispatcher', 'admin'].includes(user.role)) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Разместить груз</h1>
          <p className="text-sm text-red-600">
            Только грузовладелец или диспетчер может размещать грузы.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Разместить груз</h1>
        <p className="mt-2 text-sm text-gray-600">
          Заполните данные груза и опубликуйте объявление.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="originCity"
            type="text"
            placeholder="Город отправления"
            value={form.originCity}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <input
            name="destinationCity"
            type="text"
            placeholder="Город назначения"
            value={form.destinationCity}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <input
            name="originCountry"
            type="text"
            placeholder="Страна отправления"
            value={form.originCountry}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <input
            name="destinationCountry"
            type="text"
            placeholder="Страна назначения"
            value={form.destinationCountry}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <input
            name="weight"
            type="number"
            step="0.1"
            placeholder="Вес (тонн)"
            value={form.weight}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Цена"
            value={form.price}
            onChange={handleChange}
            className="w-full rounded border p-3"
          />

          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="w-full rounded border p-3"
          >
            <option value="KGS">KGS</option>
            <option value="USD">USD</option>
            <option value="KZT">KZT</option>
            <option value="RUB">RUB</option>
          </select>

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
            name="loadingDate"
            type="date"
            value={form.loadingDate}
            onChange={handleChange}
            className="w-full rounded border p-3 md:col-span-2"
            required
          />

          <textarea
            name="description"
            placeholder="Описание груза"
            value={form.description}
            onChange={handleChange}
            className="min-h-[140px] w-full rounded border p-3 md:col-span-2"
          />
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <div className="mt-6">
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-black px-6 py-3 text-white disabled:opacity-50"
          >
            {submitting ? 'Публикация...' : 'Опубликовать груз'}
          </button>
        </div>
      </form>
    </main>
  )
}