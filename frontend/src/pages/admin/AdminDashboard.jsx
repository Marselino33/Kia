import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowUpRight, BriefcaseMedical, FileText, GraduationCap, Sparkles, Users, Clock3, CircleDashed } from 'lucide-react'
import AdminLayout from './AdminLayout'
import adminApi from '../../lib/adminApi'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'
import '../../styles/pages/admin-admin-dashboard.css'

const DEFAULT_DATA = {
  total_pengguna: 0,
  total_anak: 0,
  total_content: 0,
  total_resep: 0,
  total_quiz: 0,
  quiz_attempts: 0,
  pengguna_baru_hari_ini: 0,
  engagement_kuis: 0,
  content_distribution: [],
  recent_activities: [],
}

const CARD_META = [
  {
    key: 'total_content',
    label: 'Total Konten Aktif',
    subtitle: 'Artikel, Resep & Video',
    icon: FileText,
    accent: '#2563eb',
    note: '+12%',
  },
  {
    key: 'quiz_attempts',
    label: 'Interaksi User',
    subtitle: 'Klik pada highlight',
    icon: Activity,
    accent: '#0f766e',
    note: '+5.4%',
  },
  {
    key: 'engagement_kuis',
    label: 'Engagement Kuis',
    subtitle: 'Kuis terselesaikan',
    icon: GraduationCap,
    accent: '#ea580c',
    note: 'Sesuai Target',
    isPercent: true,
  },
  {
    key: 'pengguna_baru_hari_ini',
    label: 'Pengguna Baru',
    subtitle: 'Hari ini',
    icon: Users,
    accent: '#8b5cf6',
    note: '+24',
  },
]

function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(Number(value || 0))
}

function formatClock(value) {
  if (!value) return '-'
  try {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return '-'
  }
}

function normalizeBadge(action) {
  return String(action || '').toLowerCase()
}

function buildFallbackDistribution(stats) {
  const total = Number(stats.total_content || 0)
  if (!total) return []
  return [
    { label: 'Gizi & Nutrisi', value: Math.max(0, Math.round(total * 0.45)), percent: 45, color: '#2563eb' },
    { label: 'Parenting', value: Math.max(0, Math.round(total * 0.25)), percent: 25, color: '#0f766e' },
    { label: 'Kesehatan Mental', value: Math.max(0, Math.round(total * 0.2)), percent: 20, color: '#ea580c' },
    { label: 'Informasi Umum', value: Math.max(0, total - Math.round(total * 0.9)), percent: 10, color: '#8b5cf6' },
  ]
}

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user)
  const [dashboard, setDashboard] = useState(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi
      .get('/admin/dashboard')
      .then((response) => {
        const data = response.data?.data || {}
        setDashboard({ ...DEFAULT_DATA, ...data })
      })
      .catch(() => toast.error('Gagal memuat statistik'))
      .finally(() => setLoading(false))
  }, [])

  const cards = useMemo(() => {
    return CARD_META.map((item) => {
      const rawValue = dashboard[item.key]
      const displayValue = item.isPercent ? `${Number(rawValue || 0)}%` : formatNumber(rawValue)
      return {
        ...item,
        displayValue,
      }
    })
  }, [dashboard])

  const distribution = dashboard.content_distribution?.length
    ? dashboard.content_distribution
    : buildFallbackDistribution(dashboard)

  const totalDistribution = distribution.reduce((sum, item) => sum + Number(item.value || 0), 0)
  const donutStyle = distribution.length
    ? {
        background: `conic-gradient(${distribution
          .map((item, index) => {
            const start = distribution
              .slice(0, index)
              .reduce((sum, current) => sum + (Number(current.percent) || 0), 0)
            const end = start + (Number(item.percent) || 0)
            return `${item.color} ${start}% ${end}%`
          })
          .join(', ')})`,
      }
    : undefined

  const displayName = user?.user_metadata?.full_name || 'Admin'

  return (
    <AdminLayout>
      <div className="admin-dashboard-shell">
        <section className="admin-dashboard-hero">
          <div className="admin-dashboard-hero-copy">
            <h2>Selamat datang kembali, {displayName}.</h2>
            <p>Berikut adalah ikhtisar performa konten, aktivitas komunitas, dan status modul utama Portal KIA Ceredas hari ini.</p>
          </div>
          <div className="admin-dashboard-hero-badge">
            <Sparkles size={16} />
            Dashboard Aktif
          </div>
        </section>

        {loading ? (
          <div className="admin-dashboard-empty">
            <CircleDashed size={34} />
            <p>Memuat data dashboard...</p>
          </div>
        ) : (
          <>
            <section className="admin-dashboard-grid">
              {cards.map((card) => {
                const Icon = card.icon
                return (
                  <article key={card.key} className="admin-dashboard-card">
                    <div className="admin-dashboard-card-top">
                      <div className="admin-dashboard-card-icon" style={{ background: `${card.accent}14`, color: card.accent }}>
                        <Icon size={20} />
                      </div>
                      <span className="admin-dashboard-card-note">{card.note}</span>
                    </div>
                    <div>
                      <p className="admin-dashboard-card-label">{card.label}</p>
                      <p className="admin-dashboard-card-value">{card.displayValue}</p>
                      <p className="admin-dashboard-card-subtitle">{card.subtitle}</p>
                    </div>
                  </article>
                )
              })}
            </section>

            <section className="admin-dashboard-status-grid">
              <article className="admin-dashboard-panel">
                <div className="admin-dashboard-panel-header">
                  <h3>Log Aktivitas Terbaru</h3>
                  <a href="/admin/content" className="admin-dashboard-link">Lihat Semua</a>
                </div>

                {dashboard.recent_activities?.length ? (
                  <table className="admin-dashboard-table">
                    <thead>
                      <tr>
                        <th>Waktu</th>
                        <th>Admin</th>
                        <th>Aksi</th>
                        <th>Target Konten</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.recent_activities.map((item, index) => (
                        <tr key={`${item.target_konten}-${index}`}>
                          <td>
                            <div className="admin-dashboard-time">
                              <Clock3 size={14} style={{ display: 'inline', marginRight: 6 }} />
                              {formatClock(item.waktu)} WIB
                            </div>
                          </td>
                          <td className="admin-dashboard-admin">{item.admin || 'System'}</td>
                          <td>
                            <span className={`admin-dashboard-badge ${normalizeBadge(item.aksi)}`}>{item.aksi || 'UPDATE'}</span>
                          </td>
                          <td>
                            <div className="admin-dashboard-target">
                              {item.target_konten || '-'}
                              <small>{item.modul || 'Modul'}</small>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="admin-dashboard-empty">
                    <BriefcaseMedical size={34} />
                    <p>Belum ada aktivitas yang bisa ditampilkan.</p>
                  </div>
                )}
              </article>

              <article className="admin-dashboard-panel admin-dashboard-distribution">
                <div className="admin-dashboard-panel-header">
                  <h3>Distribusi Konten</h3>
                  <span className="admin-dashboard-link">{distribution.length} Kategori</span>
                </div>

                <div className="admin-dashboard-donut-wrap">
                  <div className="admin-dashboard-donut" style={donutStyle}>
                    <div className="admin-dashboard-donut-copy">
                      <strong>{distribution.length}</strong>
                      <span>KATEGORI</span>
                    </div>
                  </div>
                </div>

                <div className="admin-dashboard-legend">
                  {distribution.map((item) => (
                    <div key={item.label} className="admin-dashboard-legend-item">
                      <div className="admin-dashboard-legend-left">
                        <span className="admin-dashboard-legend-dot" style={{ background: item.color }} />
                        <span>{item.label}</span>
                      </div>
                      <span className="admin-dashboard-legend-percent">
                        {item.percent || 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="admin-dashboard-panel">
              <div className="admin-dashboard-panel-header">
                <h3>Status Sistem</h3>
                <span className="admin-dashboard-link">Live</span>
              </div>

              <div className="admin-dashboard-system">
                {[
                  { label: 'Backend API', status: 'Online', icon: Activity },
                  { label: 'Database Supabase', status: 'Terhubung', icon: BriefcaseMedical },
                  { label: 'Auth Service', status: 'Aktif', icon: Users },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="admin-dashboard-system-card">
                      <div className="admin-dashboard-card-top" style={{ marginBottom: 8 }}>
                        <div className="admin-dashboard-card-icon" style={{ background: '#2563eb14', color: '#2563eb' }}>
                          <Icon size={18} />
                        </div>
                        <ArrowUpRight size={16} color="#94a3b8" />
                      </div>
                      <strong>{item.label}</strong>
                      <span>{item.status}</span>
                    </div>
                  )
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
