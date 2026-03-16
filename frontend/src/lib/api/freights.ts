import { apiFetch } from './client'

export function getFreights(params?: Record<string, string | number | undefined>) {
  const search = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        search.set(key, String(value))
      }
    })
  }

  const query = search.toString() ? `?${search.toString()}` : ''

  return apiFetch(`/freights${query}`, {
    method: 'GET',
  })
}

export function getFreightById(id: string) {
  return apiFetch(`/freights/${id}`, {
    method: 'GET',
  })
}

export function createFreight(token: string, data: any) {
  return apiFetch('/freights', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
}

export function getMyFreights(token: string) {
  return apiFetch('/freights/my', {
    method: 'GET',
    token,
  })
}
