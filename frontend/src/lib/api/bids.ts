import { apiFetch } from './client'

export function createBid(token: string, data: any) {
  return apiFetch('/bids', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
}

export function getMyBids(token: string) {
  return apiFetch('/bids/my', {
    method: 'GET',
    token,
  })
}

export function getFreightBids(token: string, freightId: string) {
  return apiFetch(`/bids/freight/${freightId}`, {
    method: 'GET',
    token,
  })
}
