'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import {
  Users,
  UserCheck,
  UserPlus,
  ShieldOff,
  Eye,
  Search,
  Pencil,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import ExportButton from '@/components/admin/ExportButton'
import { cn } from '@/lib/utils'

interface User {
  id: string
  fullName: string | null
  email: string
  image: string | null
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
  status: 'ACTIVE' | 'SUSPENDED'
  createdAt: string
  _count: { enrollments: number; certificates: number }
}

const statusConfig: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: 'ใช้งาน',
    className: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
  },
  SUSPENDED: {
    label: 'ระงับ',
    className: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
  },
}

const roleConfig: Record<string, { label: string; className: string }> = {
  STUDENT: { label: 'นักเรียน', className: 'bg-blue-500/10 text-blue-400' },
  INSTRUCTOR: { label: 'ผู้สอน', className: 'bg-purple-500/10 text-purple-400' },
  ADMIN: { label: 'แอดมิน', className: 'bg-cyan-500/10 text-cyan-400' },
}

const roleTabs = [
  { value: '', label: 'ทั้งหมด' },
  { value: 'STUDENT', label: 'นักเรียน' },
  { value: 'INSTRUCTOR', label: 'ผู้สอน' },
  { value: 'ADMIN', label: 'แอดมิน' },
]

export default function UsersPage() {
  const locale = useLocale()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({ fullName: '', role: '' as string, status: '' as string })
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const json = await res.json()
      if (json.success) setUsers(json.data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    let result = users
    if (roleFilter) {
      result = result.filter((u) => u.role === roleFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (u) =>
          (u.fullName || '').toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      )
    }
    return result
  }, [users, search, roleFilter])

  // Stats
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const totalCount = users.length
  const activeCount = users.filter((u) => u.status === 'ACTIVE').length
  const newThisMonth = users.filter((u) => new Date(u.createdAt) >= startOfMonth).length
  const suspendedCount = users.filter((u) => u.status === 'SUSPENDED').length

  // Edit modal handlers
  const openEdit = (user: User) => {
    setEditUser(user)
    setEditForm({
      fullName: user.fullName || '',
      role: user.role,
      status: user.status,
    })
  }

  const saveEdit = async () => {
    if (!editUser) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const json = await res.json()
      if (json.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editUser.id
              ? { ...u, fullName: editForm.fullName, role: editForm.role as User['role'], status: editForm.status as User['status'] }
              : u
          )
        )
        setEditUser(null)
      } else {
        alert(json.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setSaving(false)
    }
  }

  // Quick role change
  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionLoading(userId + '-role')
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      const json = await res.json()
      if (json.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole as User['role'] } : u))
        )
      } else {
        alert(json.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setActionLoading(null)
    }
  }

  // Suspend / Unsuspend
  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    const confirmMsg =
      newStatus === 'SUSPENDED'
        ? 'ยืนยันระงับผู้ใช้นี้?'
        : 'ยืนยันปลดระงับผู้ใช้นี้?'
    if (!confirm(confirmMsg)) return

    setActionLoading(userId + '-status')
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const json = await res.json()
      if (json.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: newStatus as User['status'] } : u))
        )
      }
    } catch {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return '-'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">จัดการผู้ใช้งาน</h1>
          <p className="mt-1 text-sm text-gray-500">
            ผู้ใช้งานทั้งหมด {totalCount} คน
          </p>
        </div>
        <ExportButton exportType="users" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Users, label: 'ทั้งหมด', value: totalCount, color: 'blue' },
          { icon: UserCheck, label: 'ใช้งาน', value: activeCount, color: 'emerald' },
          { icon: UserPlus, label: 'ใหม่เดือนนี้', value: newThisMonth, color: 'purple' },
          { icon: ShieldOff, label: 'ถูกระงับ', value: suspendedCount, color: 'pink' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${stat.color}-500/10`}
                >
                  <Icon className={`h-5 w-5 text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Search & Filter Tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อหรืออีเมล..."
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-gray-300 placeholder-gray-600 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex gap-2">
          {roleTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setRoleFilter(tab.value)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                roleFilter === tab.value
                  ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30'
                  : 'text-gray-500 hover:bg-white/[0.04] hover:text-gray-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a1628]/50 px-6 py-20 text-center">
          <AlertCircle className="h-8 w-8 text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-300">ไม่พบผู้ใช้งาน</h3>
          <p className="mt-1 text-sm text-gray-500">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ชื่อ</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">อีเมล</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">สถานะ</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">บทบาท</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">คอร์สที่ลง</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ใบรับรอง</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">วันที่สมัคร</th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-gray-500">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredUsers.map((user) => {
                  const status = statusConfig[user.status] ?? statusConfig.ACTIVE
                  const role = roleConfig[user.role] ?? roleConfig.STUDENT
                  const initial = (user.fullName || user.email)[0]?.toUpperCase() || '?'

                  return (
                    <tr key={user.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img src={user.image} alt="" className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-xs font-bold text-blue-300">
                              {initial}
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-200">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">{user.email}</td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={user.role === 'ADMIN' || actionLoading === user.id + '-role'}
                          className={cn(
                            'rounded-md border-0 bg-transparent px-2 py-0.5 text-xs font-medium outline-none transition-colors',
                            role.className,
                            user.role === 'ADMIN' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-white/[0.06]'
                          )}
                        >
                          <option value="STUDENT" className="bg-[#111827] text-gray-300">นักเรียน</option>
                          <option value="INSTRUCTOR" className="bg-[#111827] text-gray-300">ผู้สอน</option>
                          <option value="ADMIN" className="bg-[#111827] text-gray-300">แอดมิน</option>
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">
                        {user._count.enrollments} คอร์ส
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">
                        {user._count.certificates}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/${locale}/admin/users/${user.id}`}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => openEdit(user)}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                            title="แก้ไข"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          {user.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleToggleStatus(user.id, user.status)}
                              disabled={actionLoading === user.id + '-status'}
                              className={cn(
                                'rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                                user.status === 'ACTIVE'
                                  ? 'text-red-400 hover:bg-red-500/10'
                                  : 'text-emerald-400 hover:bg-emerald-500/10'
                              )}
                              title={user.status === 'ACTIVE' ? 'ระงับ' : 'ปลดระงับ'}
                            >
                              {actionLoading === user.id + '-status' ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <ShieldOff className="h-3.5 w-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-white/[0.06] px-5 py-3.5">
            <p className="text-sm text-gray-500">
              แสดง {filteredUsers.length} จาก {users.length} ผู้ใช้
            </p>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#111827] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">แก้ไขผู้ใช้</h3>
              <button
                onClick={() => setEditUser(null)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 outline-none transition-colors focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">บทบาท</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 outline-none transition-colors focus:border-blue-500/50"
                >
                  <option value="STUDENT" className="bg-[#111827]">นักเรียน</option>
                  <option value="INSTRUCTOR" className="bg-[#111827]">ผู้สอน</option>
                  <option value="ADMIN" className="bg-[#111827]">แอดมิน</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">สถานะ</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 outline-none transition-colors focus:border-blue-500/50"
                >
                  <option value="ACTIVE" className="bg-[#111827]">ใช้งาน</option>
                  <option value="SUSPENDED" className="bg-[#111827]">ระงับ</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditUser(null)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/[0.04] hover:text-gray-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
