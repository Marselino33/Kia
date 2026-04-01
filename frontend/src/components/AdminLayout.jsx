import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { clearAdminToken } from '../lib/adminApi'
import toast from 'react-hot-toast'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ children }) {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    if (window.confirm('Yakin ingin keluar?')) {
      clearAdminToken()
      toast.success('Berhasil keluar')
      navigate('/admin/login')
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f5f5f5' }}>
      <AdminSidebar isOpen={sidebarOpen} onLogout={handleLogout} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header
          style={{
            height: 72,
            background: 'white',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            paddingInline: '1.5rem',
            gap: '1rem',
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
            }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>Ringkasan Dashboard</h1>
          </div>

          <input
            type="text"
            placeholder="Cari data..."
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              width: 200,
              fontSize: '0.9rem',
            }}
          />
        </header>

        <main style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
