import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Heart, User, LogOut, Menu, X, LayoutDashboard, Shield } from 'lucide-react'
import useAuthStore from '../store/authStore'
import { isAdminLoggedIn } from '../lib/adminApi'
import toast from 'react-hot-toast'

const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/gizi-menu', label: 'Gizi & Menu' },
    { to: '/mental-health', label: 'Kesehatan Mental', requiresAuth: true },
    { to: '/kuis', label: 'Parenting & Kuis', requiresAuth: true },
    { to: '/kesehatan-ibu', label: 'Kesehatan Ibu' },
    { to: '/phbs', label: 'PHBS' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const { user, logout } = useAuthStore()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => { setMobileOpen(false) }, [location.pathname])

    const handleLogout = async () => {
        await logout()
        toast.success('Berhasil keluar')
        navigate('/')
    }

    return (
        <header style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
            background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'var(--bg-primary, #fff9fb)',
            backdropFilter: scrolled ? 'blur(10px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
            transition: 'all 0.3s ease',
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', height: '80px', gap: '2rem' }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0, color: '#1f2937' }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: '8px',
                        background: '#E8307D',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Heart size={16} color="white" fill="white" />
                    </div>
                    <span>Portal Edukasi KIA</span>
                </Link>

                {/* Desktop Nav */}
                <nav style={{ display: 'flex', gap: '1rem', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {navLinks.filter(link => !link.requiresAuth || user).map(({ to, label }) => {
                        const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to.split('?')[0])
                        return (
                            <Link key={to} to={to} style={{
                                fontSize: '0.9rem', padding: '0.5rem 1rem', borderRadius: '30px',
                                fontWeight: 600, transition: 'all 0.2s',
                                color: isActive ? 'white' : '#4b5563',
                                background: isActive ? '#E8307D' : 'transparent',
                            }}>
                                {label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Auth Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
                    {/* Admin Panel Link */}
                    {isAdminLoggedIn() ? (
                        <Link to="/admin" style={{
                            fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '30px',
                            fontWeight: 600, background: 'linear-gradient(135deg, #E8307D, #f472b6)',
                            color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem'
                        }}>
                            <Shield size={16} /> Admin
                        </Link>
                    ) : (
                        <Link to="/admin/login" style={{
                            fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '30px',
                            fontWeight: 600, background: 'rgba(232,48,125,0.1)',
                            color: '#E8307D', display: 'flex', alignItems: 'center', gap: '0.4rem'
                        }}>
                            <Shield size={16} /> Masuk
                        </Link>
                    )}
                    {user ? (
                        <>
                            <Link to="/beranda" style={{
                                width: 40, height: 40, borderRadius: '50%', overflow: 'hidden',
                                background: '#e5e7eb',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative', border: '2px solid white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                            }}>
                                {user.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#9ca3af' }}>
                                        {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                )}
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f472b6', background: 'transparent', padding: '0.5rem 1rem' }}>Masuk</Link>
                        </>
                    )}

                    {/* Mobile Toggle */}
                    <button
                        className="btn btn-ghost"
                        style={{ display: 'none', padding: '0.5rem', color: '#1f2937' }}
                        id="mobile-menu-btn"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div style={{
                    background: 'white', borderTop: '1px solid rgba(0,0,0,0.05)', padding: '1rem',
                    display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                }}>
                    {navLinks.filter(link => !link.requiresAuth || user).map(({ to, label }) => (
                        <Link key={to} to={to} style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#4b5563', borderRadius: '8px' }}>
                            {label}
                        </Link>
                    ))}

                    {/* Admin Links in Mobile */}
                    {isAdminLoggedIn() ? (
                        <Link to="/admin" style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#E8307D', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(232,48,125,0.1)' }}>
                            <Shield size={18} /> Admin Panel
                        </Link>
                    ) : (
                        <Link to="/admin/login" style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#E8307D', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(232,48,125,0.1)' }}>
                            <Shield size={18} /> Masuk
                        </Link>
                    )}

                    <hr style={{ margin: '0.5rem 0', borderColor: 'rgba(0,0,0,0.05)' }} />

                    {user ? (
                        <>
                            <Link to="/beranda" style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <LayoutDashboard size={18} /> Beranda
                            </Link>
                            <button onClick={handleLogout} style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#ef4444', textAlign: 'left', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <LogOut size={18} /> Keluar
                            </button>
                        </>
                    ) : (
                        <Link to="/login" style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#f472b6', textAlign: 'center', background: 'rgba(244,114,182,0.1)', borderRadius: '8px' }}>
                            Masuk Akun
                        </Link>
                    )}
                </div>
            )}

            <style>{`
        @media (max-width: 992px) {
          #mobile-menu-btn { display: flex !important; }
          nav { display: none !important; }
        }
      `}</style>
        </header>
    )
}
