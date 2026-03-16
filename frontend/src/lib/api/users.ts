import { apiFetch } from './client'

export function getMyProfile(token: string) {
  return apiFetch('/users/me', {
    method: 'GET',
    token,
  })
}

export function updateMyProfile(token: string, data: any) {
  return apiFetch('/users/me', {
    method: 'PATCH',
    token,
    body: JSON.stringify(data),
  })
}

export function getPublicUser(id: string) {
  return apiFetch(`/users/${id}`, {
    method: 'GET',
  })
}
