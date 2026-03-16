'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'

export default function RegisterPage() {
  const router = useRouter()
  const { registerUser } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'driver',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    setError('')

    try {
      setLoading(true)
      await registerUser(form)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">Регистрация</h1>
        <p className="mb-6 text-sm text-gray-600">
          Создайте аккаунт в Logist.kg
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Имя"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <input
            name="phone"
            type="text"
            placeholder="Телефон"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded border p-3"
          />

          <input
            name="password"
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded border p-3"
          >
            <option value="driver">Водитель</option>
            <option value="shipper">Грузовладелец</option>
            <option value="dispatcher">Диспетчер</option>
          </select>

          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-black px-4 py-3 text-white disabled:opacity-50"
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </main>
  )
}