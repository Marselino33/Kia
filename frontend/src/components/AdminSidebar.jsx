import { Link, useLocation } from 'react-router-dom'
import { Heart, Home, Utensils, BookOpen, Pill, ClipboardList, Settings, Users, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', icon: Home, label: 'Beranda', path: '/admin', section: 'main' },
  { id: 'nutrition', icon: Utensils, label: 'Gizi & Menu', path: '/admin/gizi-ibu', section: 'main' },
  { id: 'parenting', icon: BookOpen, label: 'Parenting & Kuis', path: '/admin/parenting', section: 'main' },
  { id: 'health', icon: Pill, label: 'Mental Orang Tua', path: '/admin/mental-orang-tua', section: 'main' },
  { id: 'informasi-umum', icon: ClipboardList, label: 'Informasi Umum', path: '/admin/informasi-umum', section: 'main' },
  { divider: true, section: 'main' },
  { id: 'users', icon: Users, label: 'Manajemen Pengguna', path: '/admin/pengguna', section: 'management' },
  { id: 'settings', icon: Settings, label: 'Pengaturan', path: '#', section: 'management' },
]

export default function AdminSidebar({ isOpen = true, onLogout, onToggle }) {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <aside
      style={{
        width: isOpen ? 240 : 0,
        minWidth: isOpen ? 240 : 0,
        background: '#0f172a',
        color: '#cbd5e1',
        borderRight: isOpen ? '1px solid #1e293b' : 'none',
        overflow: 'hidden',
        transition: 'width 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '1rem 0.8rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              background: '#E8307D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(232,48,125,0.35)',
            }}
          >
            <Heart size={20} color="white" fill="white" />
          </div>
          {isOpen && (
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', margin: 0 }}>Portal KIA</p>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>ADMIN PANEL</p>
            </div>
          )}
        </Link>

        <button
          onClick={onToggle}
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            border: 'none',
            background: '#1f2937',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {isOpen ? '<' : '>'}
        </button>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.5rem' }}>
        {NAV_ITEMS.map((item, idx) => {
          if (item.divider) {
            return <div key={idx} style={{ height: '1px', background: '#1e293b', margin: '1rem 0' }} />
          }

          if (item.section === 'main' && idx === 5) {
            return (
              <div key={idx}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', padding: '1rem 1rem 0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                  Manajemen
                </p>
              </div>
            )
          }

          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.id}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                color: active ? 'white' : '#cbd5e1',
                background: active ? '#E8307D' : 'transparent',
                borderRadius: '0.65rem',
                margin: '0.25rem 0.5rem',
                textDecoration: 'none',
                transition: 'all 0.2s',
                fontSize: '0.9rem',
                fontWeight: active ? 700 : 500,
                boxShadow: active ? '0 8px 20px rgba(232,48,125,0.25)' : 'none',
                cursor: 'pointer',
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '1rem 0.5rem', borderTop: '1px solid #1e293b' }}>
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.75rem 1rem',
            color: '#e2e8f0',
            background: '#E8307D',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 500,
          }}
        >
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  )
}
