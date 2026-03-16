import { apiFetch } from './client'

export function createVehicle(token: string, data: any) {
  return apiFetch('/vehicles', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
}

export function getMyVehicles(token: string) {
  return apiFetch('/vehicles/my', {
    method: 'GET',
    token,
  })
}

export function deleteVehicle(token: string, id: string) {
  return apiFetch(`/vehicles/${id}`, {
    method: 'DELETE',
    token,
  })
}
