import { apiFetch } from './client'

export function getAdminUsers(token: string) {
  return apiFetch('/admin/users', {
    method: 'GET',
    token,
  })
}

export function getAdminReports(token: string) {
  return apiFetch('/admin/reports', {
    method: 'GET',
    token,
  })
}

export function getAdminSettings(token: string) {
  return apiFetch('/admin/settings', {
    method: 'GET',
    token,
  })
}

export function getAdminAuditLogs(token: string) {
  return apiFetch('/admin/audit-logs', {
    method: 'GET',
    token,
  })
}
