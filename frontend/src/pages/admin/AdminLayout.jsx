import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Baby,
  Bell,
  ChevronDown,
  ChevronRight,
  ChefHat,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Shield,
  X,
  Brain,
  Users,
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { clearAdminToken } from '../../lib/adminApi'
import toast from 'react-hot-toast'
import '../../styles/pages/admin-admin-layout.css'

const SIDEBAR_GROUPS = [
  {
    title: 'Beranda',
    items: [{ path: '/admin', label: 'Ringkasan Dashboard', icon: LayoutDashboard, exact: true }],
  },
  {
    title: 'Manajemen Layout',
    items: [{ path: '/admin/informasi-umum', label: 'Informasi Umum', icon: FileText }],
  },
  {
    title: 'Modul Gizi',
    items: [
      { path: '/admin/gizi-ibu', label: 'Gizi Ibu', icon: ChefHat },
      { path: '/admin/gizi-anak', label: 'Gizi Anak', icon: ChefHat },
      { path: '/admin/mpasi', label: 'MPASI', icon: ChefHat },
    ],
  },
  {
    title: 'Modul Parenting',
    items: [
      { path: '/admin/parenting', label: 'Stimulus Anak', icon: Baby },
      { path: '/admin/pola-asuh', label: 'Pola Asuh', icon: HeartHandshake },
    ],
  },
  {
    title: 'Modul Interaktif',
    items: [
      { path: '/admin/mental-orang-tua', label: 'Mental Orang Tua', icon: Brain },
      { path: '/admin/quiz', label: 'Quiz', icon: Brain },
    ],
  },
  {
    title: 'Pengguna',
    items: [{ path: '/admin/pengguna', label: 'Manajemen Pengguna', icon: Users }],
  },
]

const PAGE_TITLES = [
  { path: '/admin', title: 'Ringkasan Dashboard', subtitle: 'Selamat datang kembali di Portal KIA Digital.' },
  { path: '/admin/informasi-umum', title: 'Manajemen Layout', subtitle: 'Kelola konten informasi umum dan PHBS.' },
  { path: '/admin/gizi-ibu', title: 'Modul Gizi', subtitle: 'Kelola konten gizi ibu, anak, dan MPASI.' },
  { path: '/admin/gizi-anak', title: 'Modul Gizi', subtitle: 'Kelola konten gizi ibu, anak, dan MPASI.' },
  { path: '/admin/mpasi', title: 'Modul Gizi', subtitle: 'Kelola konten gizi ibu, anak, dan MPASI.' },
  { path: '/admin/parenting', title: 'Modul Parenting', subtitle: 'Kelola stimulus anak dan artikel parenting.' },
  { path: '/admin/pola-asuh', title: 'Modul Parenting', subtitle: 'Kelola pola asuh dan langkah praktis.' },
  { path: '/admin/mental-orang-tua', title: 'Modul Interaktif', subtitle: 'Kelola kesehatan mental orang tua.' },
  { path: '/admin/quiz', title: 'Modul Interaktif', subtitle: 'Kelola kuis dan pertanyaan interaktif.' },
  { path: '/admin/pengguna', title: 'Pengguna', subtitle: 'Kelola akun admin dan pengguna aplikasi.' },
]

function resolvePageMeta(pathname) {
  const exactMatch = PAGE_TITLES.find((item) => item.path === pathname)
  if (exactMatch) return exactMatch
  const fallback = PAGE_TITLES.find((item) => pathname.startsWith(item.path))
  return fallback || PAGE_TITLES[0]
}

function initialsFromName(name) {
  return (name || 'Admin')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'A'
}

function normalizeQuery(value) {
  return String(value || '').toLowerCase().trim()
}

function resolveAdminSearchPath(query) {
  const text = normalizeQuery(query)
  if (!text) return null

  if (text.includes('pengguna') || text.includes('user')) return '/admin/pengguna'
  if (text.includes('gizi ibu') || text === 'gizi' || text.includes('nutrisi')) return '/admin/gizi-ibu'
  if (text.includes('gizi anak') || text.includes('anak')) return '/admin/gizi-anak'
  if (text.includes('mpasi') || text.includes('resep')) return '/admin/mpasi'
  if (text.includes('parenting') || text.includes('stimulus')) return '/admin/parenting'
  if (text.includes('pola asuh')) return '/admin/pola-asuh'
  if (text.includes('mental') || text.includes('psikologi') || text.includes('stress')) return '/admin/mental-orang-tua'
  if (text.includes('informasi') || text.includes('phbs') || text.includes('umum')) return '/admin/informasi-umum'
  if (text.includes('quiz') || text.includes('kuis')) return '/admin/quiz'

  return null
}

function NavLinkItem({ item, active, sidebarOpen }) {
  return (
    <Link
      to={item.path}
      className={`admin-shell-nav-item${active ? ' is-active' : ''}${sidebarOpen ? '' : ' is-collapsed'}`}
      title={item.label}
    >
      <item.icon size={18} className="admin-shell-nav-icon" />
      {sidebarOpen && <span className="admin-shell-nav-label">{item.label}</span>}
      {sidebarOpen && active && <ChevronRight size={15} className="admin-shell-nav-chevron" />}
    </Link>
  )
}

export default function AdminLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchValue, setSearchValue] = useState('')

  const pageMeta = resolvePageMeta(location.pathname)
  const displayName = user?.user_metadata?.full_name || 'Admin'
  const roleName = user?.user_metadata?.role || 'Administrator'
  const initials = initialsFromName(displayName)

  const groupedItems = useMemo(
    () =>
      SIDEBAR_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => true),
      })),
    []
  )

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path
    return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
  }

  const handleLogout = async () => {
    if (window.confirm('Yakin ingin keluar?')) {
      await logout()
      clearAdminToken()
      toast.success('Berhasil keluar')
      navigate('/login', { replace: true })
    }
  }

  const handleAdminSearchSubmit = (event) => {
    event.preventDefault()
    const query = searchValue.trim()
    if (!query) return

    const resolvedPath = resolveAdminSearchPath(query)
    if (resolvedPath) {
      navigate(resolvedPath)
      setSearchValue('')
      return
    }

    toast.error('Kata kunci tidak cocok dengan modul admin yang tersedia')
  }

  return (
    <div className={`admin-shell${sidebarOpen ? '' : ' is-collapsed'}`}>
      <aside className={`admin-shell-sidebar${sidebarOpen ? ' is-open' : ' is-collapsed'}`}>
        <div className="admin-shell-brand-row">
          <Link to="/admin" className="admin-shell-brand">
            <span className="admin-shell-brand-mark">
              <Shield size={18} color="white" />
            </span>
            {sidebarOpen && (
              <span className="admin-shell-brand-copy">
                <strong>KIA Cerdas</strong>
                <small>Portal Bidan</small>
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen((state) => !state)}
            className="admin-shell-toggle"
            aria-label={sidebarOpen ? 'Ciutkan sidebar' : 'Buka sidebar'}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className="admin-shell-nav">
          {groupedItems.map((group) => (
            <div key={group.title} className="admin-shell-group">
              {sidebarOpen && <div className="admin-shell-group-title">{group.title}</div>}
              <div className="admin-shell-group-items">
                {group.items.map((item) => (
                  <NavLinkItem key={item.path} item={item} active={isActive(item)} sidebarOpen={sidebarOpen} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="admin-shell-footer">
          <button type="button" onClick={handleLogout} className="admin-shell-logout">
            <LogOut size={18} />
            {sidebarOpen && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      <div className="admin-shell-main">
        <header className="admin-shell-topbar">
          <div className="admin-shell-title-wrap">
            <button
              type="button"
              onClick={() => setSidebarOpen((state) => !state)}
              className="admin-shell-mobile-toggle"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="admin-shell-title">{pageMeta.title}</h1>
              <p className="admin-shell-subtitle">{pageMeta.subtitle}</p>
            </div>
          </div>

          <div className="admin-shell-actions">
            <form className="admin-shell-search" onSubmit={handleAdminSearchSubmit}>
              <Search size={16} />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Cari modul: resep, gizi, pengguna..."
              />
            </form>

            <button type="button" className="admin-shell-icon-btn" aria-label="Notifikasi">
              <Bell size={18} />
              <span className="admin-shell-notification-dot" />
            </button>

            <div className="admin-shell-user-chip">
              <div className="admin-shell-avatar">{initials}</div>
              <div className="admin-shell-user-meta">
                <strong>{displayName}</strong>
                <span>{roleName}</span>
              </div>
              <ChevronDown size={16} className="admin-shell-user-chevron" />
            </div>
          </div>
        </header>

        <main className="admin-shell-content">{children}</main>
      </div>
    </div>
  )
}

export function AdminPageHeader({ title, subtitle, action }) {
  return (
    <div className="admin-page-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function AdminCard({ children, className = '' }) {
  return <div className={`admin-card ${className}`.trim()}>{children}</div>
}

export function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-card-icon" style={{ background: `${color}14`, color }}>
        <Icon size={22} />
      </div>
      <div>
        <p className="admin-stat-card-label">{label}</p>
        <p className="admin-stat-card-value">{value}</p>
      </div>
    </div>
  )
}

export function AdminModal({ open, onClose, title, children, width = 560 }) {
  if (!open) return null
  const modalWidthClass =
    width >= 640 ? 'admin-modal-panel admin-modal-panel-640' : width <= 400 ? 'admin-modal-panel admin-modal-panel-400' : 'admin-modal-panel admin-modal-panel-560'

  return (
    <div onClick={onClose} className="admin-modal-overlay">
      <div className={modalWidthClass} onClick={(event) => event.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="admin-modal-close">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function AdminInput({ label, required, className = '', style, ...props }) {
  const inputClassName = `admin-input ${className}`.trim()
  return (
    <div className="admin-form-field" style={style}>
      {label && (
        <label className="admin-form-label">
          {label} {required && <span>*</span>}
        </label>
      )}
      {props.type === 'textarea' ? (
        <textarea {...props} className={`${inputClassName} admin-input-textarea`.trim()} />
      ) : props.type === 'select' ? (
        <select {...props} className={`${inputClassName} admin-input-select`.trim()}>
          {props.children}
        </select>
      ) : (
        <input {...props} className={`${inputClassName} admin-input-field`.trim()} />
      )}
    </div>
  )
}

export const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.875rem',
}

export const thStyle = {
  padding: '0.75rem 1rem',
  textAlign: 'left',
  background: '#f8fafc',
  color: '#475569',
  fontWeight: 600,
  fontSize: '0.8125rem',
  borderBottom: '1px solid #e2e8f0',
}

export const tdStyle = {
  padding: '0.875rem 1rem',
  borderBottom: '1px solid #f1f5f9',
  color: '#334155',
}
