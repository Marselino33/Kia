import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Heart, LogOut, Menu, X, LayoutDashboard, Search, ChevronDown } from 'lucide-react'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { clearAdminToken } from '../lib/adminApi'

const homeLink = { to: '/beranda', label: 'Beranda' }
const infoLink = { to: '/informasi-umum', label: 'Informasi Umum' }

const navDropdowns = [
    {
        key: 'parenting',
        label: 'Parenting',
        items: [
            { to: '/stimulus', label: 'Stimulus Anak' },
            { to: '/pola-asuh', label: 'Pola Asuh' },
            { to: '/kuis-parenting', label: 'Kuis Pemahaman' },
        ],
    },
    {
        key: 'gizi',
        label: 'Gizi',
        items: [
            { to: '/gizi-ibu-trimester1', label: 'Gizi Ibu' },
            { to: '/gizi-anak', label: 'Gizi Anak' },
            { to: '/resep-mpasi', label: 'Resep MPASI' },
        ],
    },
    {
        key: 'mental-orang-tua',
        label: 'Mental Orang Tua',
        items: [
            { to: '/mental-health', label: 'Menjaga Kesehatan Mental Orang Tua' },
            { to: '/mental-health-check', label: 'Self Check Stress Pengasuhan' },
        ],
    },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [openMobileSections, setOpenMobileSections] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [logoFailed, setLogoFailed] = useState(false)
    const { user, logout } = useAuthStore()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        setMobileOpen(false)
        setOpenMobileSections([])
        setActiveDropdown(null)
    }, [location.pathname])

    const handleLogout = async () => {
        await logout()
        clearAdminToken()
        toast.success('Berhasil keluar')
        navigate('/')
    }

    const toggleMobileSection = (key) => {
        setOpenMobileSections((prev) => (
            prev.includes(key)
                ? prev.filter((item) => item !== key)
                : [...prev, key]
        ))
    }

    const isPathActive = (to) => {
        const basePath = to.split('?')[0]
        if (basePath === '/') return location.pathname === '/'
        return location.pathname.startsWith(basePath)
    }

    const isGroupActive = (items) => items.some((item) => isPathActive(item.to))

    return (
        <header style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
            background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
            backdropFilter: scrolled ? 'blur(10px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
            transition: 'all 0.3s ease',
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', height: '80px', gap: '2rem' }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0, color: '#1f2937' }}>
                    {!logoFailed ? (
                        <>
                            <div className="brand-logo-mark" style={{
                                width: 44,
                                height: 44,
                                borderRadius: '10px',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#ecfeff',
                                border: '1px solid rgba(6, 182, 212, 0.25)'
                            }}>
                                <img
                                    src="/logo-kia-cerdas.png"
                                    alt="KIA Cerdas"
                                    onError={() => setLogoFailed(true)}
                                    style={{
                                        width: '125%',
                                        height: '125%',
                                        objectFit: 'cover',
                                        objectPosition: 'center 18%'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                                <span className="brand-logo-text" style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                                    KIA Cerdas
                                </span>
                                <span className="brand-logo-subtext" style={{ fontWeight: 700, fontSize: '0.7rem', color: '#0891b2', marginTop: '0.18rem' }}>
                                    Ibu sehat, generasi hebat
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{
                                width: 32, height: 32, borderRadius: '8px',
                                background: '#06b6d4',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Heart size={16} color="white" fill="white" />
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '1rem' }}>KIA Cerdas</span>
                        </>
                    )}
                </Link>

                {/* Search Bar */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', margin: '0 1rem' }}>
                    <div className="search-bar" style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: '#f3f4f6', padding: '0.6rem 1rem', borderRadius: '30px',
                        maxWidth: '400px'
                    }}>
                        <Search size={18} color="#9ca3af" />
                        <input
                            type="text"
                            placeholder="Cari resep MPASI, tips pola asuh..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                flex: 1, border: 'none', background: 'transparent', outline: 'none',
                                fontSize: '0.9rem', color: '#1f2937'
                            }}
                        />
                    </div>
                </div>

                {/* Desktop Nav */}
                <nav style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <Link to={homeLink.to} style={{
                        fontSize: '0.9rem', fontWeight: 600,
                        color: isPathActive(homeLink.to) ? '#06b6d4' : '#4b5563',
                        borderBottom: isPathActive(homeLink.to) ? '2px solid #06b6d4' : 'none',
                        paddingBottom: '0.25rem',
                        transition: 'all 0.2s'
                    }}>
                        {homeLink.label}
                    </Link>

                    {navDropdowns.map((group) => {
                        const groupActive = isGroupActive(group.items)
                        const open = activeDropdown === group.key

                        return (
                            <div
                                key={group.key}
                                style={{ position: 'relative' }}
                                onMouseEnter={() => setActiveDropdown(group.key)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button
                                    type="button"
                                    onClick={() => setActiveDropdown(open ? null : group.key)}
                                    style={{
                                        fontSize: '0.9rem', fontWeight: 600,
                                        color: groupActive ? '#06b6d4' : '#4b5563',
                                        borderBottom: groupActive ? '2px solid #06b6d4' : 'none',
                                        paddingBottom: '0.25rem',
                                        transition: 'all 0.2s',
                                        border: 'none',
                                        background: 'transparent',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {group.label}
                                    <ChevronDown size={14} />
                                </button>

                                {open && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        paddingTop: '10px',
                                        minWidth: '260px',
                                        zIndex: 2000
                                    }}>
                                        <div style={{
                                        minWidth: '260px',
                                        background: 'white',
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        borderRadius: '12px',
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
                                        padding: '0.5rem',
                                        pointerEvents: 'auto'
                                    }}>
                                        {group.items.map((item) => (
                                            <Link
                                                key={item.to}
                                                to={item.to}
                                                style={{
                                                    display: 'block',
                                                    padding: '0.65rem 0.75rem',
                                                    borderRadius: '8px',
                                                    color: isPathActive(item.to) ? '#06b6d4' : '#4b5563',
                                                    fontWeight: isPathActive(item.to) ? 700 : 600,
                                                    fontSize: '0.85rem',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    <Link to={infoLink.to} style={{
                        fontSize: '0.9rem', fontWeight: 600,
                        color: isPathActive(infoLink.to) ? '#06b6d4' : '#4b5563',
                        borderBottom: isPathActive(infoLink.to) ? '2px solid #06b6d4' : 'none',
                        paddingBottom: '0.25rem',
                        transition: 'all 0.2s'
                    }}>
                        {infoLink.label}
                    </Link>
                </nav>

                {/* Auth Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
                    {user ? (
                        <>
                            <Link to="/profil" style={{
                                width: 40, height: 40, borderRadius: '50%', overflow: 'hidden',
                                background: 'linear-gradient(135deg, #e0f2fe, #dbeafe)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative', border: '2px solid #bfdbfe', boxShadow: '0 4px 14px rgba(3,105,161,0.16)'
                            }}>
                                {user.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0284c7' }}>
                                        {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                )}
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" state={{ from: location.pathname, source: 'navbar-login' }} className="btn" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#06b6d4', background: 'transparent', padding: '0.5rem 1rem' }}>Masuk</Link>
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
                    <Link to={homeLink.to} style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#4b5563', borderRadius: '8px' }}>
                        {homeLink.label}
                    </Link>

                    {navDropdowns.map((group) => {
                        const sectionOpen = openMobileSections.includes(group.key)
                        return (
                            <div key={group.key} style={{ borderRadius: '10px', border: '1px solid rgba(0,0,0,0.06)' }}>
                                <button
                                    type="button"
                                    onClick={() => toggleMobileSection(group.key)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: 'white',
                                        border: 'none',
                                        color: '#374151',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {group.label}
                                    <ChevronDown size={16} style={{ transform: sectionOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                                </button>

                                {sectionOpen && (
                                    <div style={{ padding: '0 0.5rem 0.5rem' }}>
                                        {group.items.map((item) => (
                                            <Link
                                                key={item.to}
                                                to={item.to}
                                                style={{
                                                    display: 'block',
                                                    padding: '0.6rem 0.75rem',
                                                    borderRadius: '8px',
                                                    color: '#4b5563',
                                                    fontWeight: 600,
                                                    fontSize: '0.85rem',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    <Link to={infoLink.to} style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#4b5563', borderRadius: '8px' }}>
                        {infoLink.label}
                    </Link>

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
                        <Link to="/login" state={{ from: location.pathname, source: 'navbar-login-mobile' }} style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#06b6d4', textAlign: 'center', background: 'rgba(6,182,212,0.1)', borderRadius: '8px' }}>
                            Masuk Akun
                        </Link>
                    )}
                </div>
            )}

            <style>{`
        @media (max-width: 992px) {
          #mobile-menu-btn { display: flex !important; }
          nav { display: none !important; }
          .search-bar { maxWidth: 100% !important; }
                    .brand-logo-subtext { display: none !important; }
                    .brand-logo-text { font-size: 0.95rem !important; }
                    .brand-logo-mark { width: 38px !important; height: 38px !important; }
        }
      `}</style>
        </header>
    )
}
