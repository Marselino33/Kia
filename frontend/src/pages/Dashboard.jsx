import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Baby, Activity, Bookmark, Heart, TrendingUp, ChevronRight, Clock } from 'lucide-react'
import useAuthStore from '../store/authStore'
import api from '../lib/api'

const quickLinks = [
    { to: '/konten?fase=kehamilan_1', label: 'Kehamilan Trimester 1', color: '#E8307D', icon: Heart },
    { to: '/konten?fase=persalinan', label: 'Panduan Persalinan', color: '#8b5cf6', icon: Baby },
    { to: '/kuis', label: 'Kuis Edukasi', color: '#f59e0b', icon: Activity },
]

const sampleArticles = [
    { id: 1, slug: 'nutrisi-ibu-hamil', title: 'Nutrisi Penting untuk Ibu Hamil', category: 'Kehamilan', readMinutes: 5, phase: 'kehamilan_1' },
    { id: 2, slug: 'imunisasi-dasar-bayi', title: 'Jadwal Imunisasi Dasar Bayi', category: 'Imunisasi', readMinutes: 7, phase: 'bayi' },
    { id: 3, slug: 'tanda-persalinan', title: 'Tanda-Tanda Persalinan yang Perlu Diketahui', category: 'Persalinan', readMinutes: 6, phase: 'persalinan' },
    { id: 4, slug: 'asi-eksklusif', title: 'Manfaat ASI Eksklusif untuk Bayi', category: 'Gizi', readMinutes: 5, phase: 'bayi' },
]

function StatCard({ icon: Icon, value, label, color, bg }) {
    return (
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} color={color} />
            </div>
            <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{label}</div>
            </div>
        </div>
    )
}

export default function Dashboard() {
    const { user } = useAuthStore()
    const [articles, setArticles] = useState(sampleArticles)
    const [bookmarks, setBookmarks] = useState([])
    const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Ibu'

    useEffect(() => {
        // Try to fetch from backend; fallback to sample data
        api.get('/content?limit=4').then(r => setArticles(r.data?.data || sampleArticles)).catch(() => { })
        api.get('/bookmarks').then(r => setBookmarks(r.data?.data || [])).catch(() => { })
    }, [])

    const phaseColors = {
        kehamilan_1: '#E8307D', kehamilan_2: '#8b5cf6', kehamilan_3: '#06b6d4',
        persalinan: '#f59e0b', bayi: '#14b8a6', balita: '#10b981',
    }

    return (
        <div style={{ paddingTop: 72 }}>
            <div className="container" style={{ paddingBlock: '2.5rem' }}>

                {/* Greeting */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '0.35rem' }}>
                        Halo, <span className="gradient-text">{firstName}!</span> 👋
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Terus belajar dan jaga kesehatan ibu & anak.</p>
                </div>

                {/* Stats */}
                <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
                    <StatCard icon={BookOpen} value={articles.length} label="Artikel Dibaca" color="#E8307D" bg="rgba(232,48,125,0.12)" />
                    <StatCard icon={Bookmark} value={bookmarks.length} label="Disimpan" color="#8b5cf6" bg="rgba(139,92,246,0.12)" />
                    <StatCard icon={Activity} value="0" label="Kuis Selesai" color="#14b8a6" bg="rgba(20,184,166,0.12)" />
                    <StatCard icon={Baby} value="0" label="Data Anak" color="#f59e0b" bg="rgba(245,158,11,0.12)" />
                </div>

                {/* Quick Links */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem' }}>Akses Cepat</h2>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {quickLinks.map(({ to, label, color, icon: Icon }) => (
                            <Link key={to} to={to} style={{
                                display: 'flex', alignItems: 'center', gap: '0.6rem',
                                padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-full)',
                                background: `${color}15`, border: `1px solid ${color}30`,
                                color, fontWeight: 600, fontSize: '0.875rem',
                                transition: 'all 0.2s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = `${color}25`; e.currentTarget.style.transform = 'translateY(-2px)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = `${color}15`; e.currentTarget.style.transform = 'none' }}
                            >
                                <Icon size={15} /> {label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>

                    {/* Artikel Rekomendasi */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Artikel Rekomendasi</h2>
                            <Link to="/konten" style={{ color: 'var(--primary-400)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                Lihat Semua <ChevronRight size={14} />
                            </Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {articles.map((a) => (
                                <Link key={a.id} to={`/konten/${a.slug}`} className="glass-card" style={{
                                    padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', textDecoration: 'none',
                                }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                                        background: `${phaseColors[a.phase] || '#ec4899'}20`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <BookOpen size={18} color={phaseColors[a.phase] || '#ec4899'} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                            <span className="badge badge-pink" style={{ fontSize: '0.7rem' }}>{a.category}</span>
                                        </div>
                                        <h3 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem', lineHeight: 1.4 }}>{a.title}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Clock size={11} /> {a.readMinutes} menit baca
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar: Tips Hari Ini */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--gradient-card)' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <Heart size={16} color="#E8307D" fill="#E8307D" />
                                <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Tips Hari Ini</h3>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                                Konsumsi 400mcg asam folat setiap hari selama kehamilan untuk mencegah cacat tabung saraf pada janin.
                            </p>
                            <div style={{ marginTop: '0.75rem', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(236,72,153,0.1)', fontSize: '0.75rem', color: 'var(--primary-400)' }}>
                                📖 Sumber: Buku KIA Kemenkes 2024
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>🎯 Tantangan Mingguan</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.7 }}>
                                Baca 3 artikel tentang gizi ibu hamil minggu ini dan selesaikan kuis!
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>0 / 3 artikel</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--primary-400)', fontWeight: 600 }}>0%</span>
                            </div>
                            <div style={{ height: 6, background: '#e2e8f0', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: '0%', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-full)' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    )
}
