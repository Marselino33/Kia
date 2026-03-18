import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard, Users, Baby, FileText, ChefHat,
    Brain, LogOut, Menu, X, Shield, ChevronRight
} from 'lucide-react'
import { clearAdminToken } from '../../lib/adminApi'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/pengguna', label: 'Pengguna', icon: Users },
    { path: '/admin/parenting', label: 'Parenting (Anak)', icon: Baby },
    { path: '/admin/kesehatan-ibu', label: 'Kesehatan Ibu', icon: FileText },
    { path: '/admin/phbs', label: 'PHBS', icon: FileText },
    { path: '/admin/gizi', label: 'Gizi & Menu', icon: ChefHat },
    { path: '/admin/quiz', label: 'Quiz', icon: Brain },
]

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () => {
        clearAdminToken()
        toast.success('Logout berhasil')
        navigate('/admin/login')
    }

    const isActive = (item) => {
        if (item.exact) return location.pathname === item.path
        return location.pathname.startsWith(item.path)
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'var(--font-sans, sans-serif)' }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarOpen ? 256 : 72,
                background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
                transition: 'width 0.3s ease',
                display: 'flex', flexDirection: 'column',
                position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
                boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.25rem', display: 'flex', alignItems: 'center',
                    gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '10px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                        <Shield size={18} color="white" />
                    </div>
                    {sidebarOpen && (
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>SEJIWA Admin</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>Panel Kontrol</div>
                        </div>
                    )}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
                        background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
                        cursor: 'pointer', padding: '0.25rem', borderRadius: '6px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* Nav items */}
                <nav style={{ flex: 1, padding: '0.75rem 0.5rem', overflowY: 'auto' }}>
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item)
                        return (
                            <Link key={item.path} to={item.path} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: sidebarOpen ? '0.7rem 0.875rem' : '0.7rem',
                                borderRadius: '0.75rem', marginBottom: '0.25rem',
                                background: active ? 'rgba(99,102,241,0.3)' : 'transparent',
                                border: active ? '1px solid rgba(99,102,241,0.5)' : '1px solid transparent',
                                color: active ? 'white' : 'rgba(255,255,255,0.65)',
                                textDecoration: 'none', transition: 'all 0.15s',
                                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                            }}>
                                <item.icon size={18} style={{ flexShrink: 0 }} />
                                {sidebarOpen && <span style={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400 }}>{item.label}</span>}
                                {sidebarOpen && active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                            </Link>
                        )
                    })}
                </nav>

                {/* Logout */}
                <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button onClick={handleLogout} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: sidebarOpen ? '0.7rem 0.875rem' : '0.7rem',
                        borderRadius: '0.75rem', width: '100%',
                        background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                        color: '#fca5a5', cursor: 'pointer', transition: 'all 0.15s',
                        justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    }}>
                        <LogOut size={18} style={{ flexShrink: 0 }} />
                        {sidebarOpen && <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div style={{ marginLeft: sidebarOpen ? 256 : 72, flex: 1, transition: 'margin-left 0.3s ease', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {children}
            </div>
        </div>
    )
}

// Page header component
export function AdminPageHeader({ title, subtitle, action }) {
    return (
        <div style={{
            background: 'white', padding: '1.5rem 2rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
            <div>
                <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{title}</h1>
                {subtitle && <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>{subtitle}</p>}
            </div>
            {action}
        </div>
    )
}

// Card component
export function AdminCard({ children, style }) {
    return (
        <div style={{
            background: 'white', borderRadius: '1rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            ...style
        }}>
            {children}
        </div>
    )
}

// Stat card
export function StatCard({ label, value, icon: Icon, color }) {
    return (
        <div style={{
            background: 'white', borderRadius: '1rem', padding: '1.5rem',
            border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', gap: '1rem'
        }}>
            <div style={{
                width: 48, height: 48, borderRadius: '12px',
                background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
                <Icon size={22} color={color} />
            </div>
            <div>
                <p style={{ color: '#64748b', fontSize: '0.8125rem', margin: 0 }}>{label}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', margin: 0, lineHeight: 1.2 }}>{value}</p>
            </div>
        </div>
    )
}

// Modal
export function AdminModal({ open, onClose, title, children, width = 560 }) {
    if (!open) return null
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }} onClick={onClose}>
            <div style={{
                background: 'white', borderRadius: '1.25rem', width: '100%', maxWidth: width,
                maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.25)'
            }} onClick={e => e.stopPropagation()}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#1e293b' }}>{title}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.25rem' }}>
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

// Form input helper
export function AdminInput({ label, required, ...props }) {
    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
            </label>}
            {props.type === 'textarea' ? (
                <textarea {...props} style={{
                    width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db',
                    borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none',
                    boxSizing: 'border-box', resize: 'vertical', minHeight: 80,
                    ...props.style
                }} />
            ) : props.type === 'select' ? (
                <select {...props} style={{
                    width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db',
                    borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none',
                    boxSizing: 'border-box', background: 'white',
                    ...props.style
                }}>
                    {props.children}
                </select>
            ) : (
                <input {...props} style={{
                    width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db',
                    borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none',
                    boxSizing: 'border-box',
                    ...props.style
                }} />
            )}
        </div>
    )
}

// Table styles helper
export const tableStyle = {
    width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem'
}
export const thStyle = {
    padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc',
    color: '#475569', fontWeight: 600, fontSize: '0.8125rem',
    borderBottom: '1px solid #e2e8f0'
}
export const tdStyle = {
    padding: '0.875rem 1rem', borderBottom: '1px solid #f1f5f9', color: '#334155'
}
