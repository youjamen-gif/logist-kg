import { apiFetch } from './client'

export type AuthUser = {
  id: string
  email: string
  role: string
  name: string
}

export type AuthResponse = {
  user: AuthUser
  accessToken: string
}

export function register(data: {
  name: string
  email: string
  phone?: string
  password: string
  role: string
}) {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function login(data: {
  email: string
  password: string
}) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getMe(token: string) {
  return apiFetch('/users/me', {
    method: 'GET',
    token,
  })
}
