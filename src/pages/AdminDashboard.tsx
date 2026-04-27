import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminRoute } from '@/components/admin/AdminRoute'
import { DashboardStats } from '@/components/admin/DashboardStats'
import { Helmet } from 'react-helmet-async'
import { SITE_NAME } from '@/utils/constants'

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  )
}

export function AdminHome() {
  return (
    <>
      <Helmet>
        <title>Dashboard — {SITE_NAME} Admin</title>
      </Helmet>
      <div>
        <h1 className="font-display text-2xl text-ink-50 mb-6">Dashboard</h1>
        <DashboardStats />
      </div>
    </>
  )
}
