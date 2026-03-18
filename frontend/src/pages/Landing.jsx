import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Droplets, Headphones, Users, Info, Stethoscope, Check } from 'lucide-react'
import AdminBar from '../components/AdminBar'
import useAuthStore from '../store/authStore'

export default function Landing() {
    const { user } = useAuthStore()

    const menuCategories = [
        { icon: Droplets, label: 'Gizi', link: '/gizi-menu' },
        { icon: Headphones, label: 'Kebersihan' },
        { icon: Stethoscope, label: 'Kesehatan Ibu', link: '/kesehatan-ibu' },
        { icon: Users, label: 'Pola Asuh' }
    ]

    const recipes = [
        {
            title: "Purée Wortel & Pir Organik",
            stage: "6-8 BULAN",
            time: "15 MENIT",
            image: "https://images.unsplash.com/photo-1556910103-2b02b40a6c94?auto=format&fit=crop&q=80&w=400"
        },
        {
            title: "Bubur Gandum & Pisang Lembut",
            stage: "6-11 BULAN",
            time: "20 MENIT",
            image: "https://images.unsplash.com/photo-1587137537828-3761ba8b0e4f?auto=format&fit=crop&q=80&w=400"
        },
        {
            title: "Salmon Panggang & Kacang Polong",
            stage: "8-9 TAHUN",
            time: "30 MENIT",
            image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=400"
        },
        {
            title: "Pasta Mini Sayur",
            stage: "8+ TAHUN",
            time: "25 MENIT",
            image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=400"
        }
    ]

    const articles = [
        {
            title: "Mengelola Stres Pascapersalinan secara Efektif",
            category: "KESEHATAN IBU",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
        },
        {
            title: "Pentingnya PHBS pada Anak Usia Dini",
            category: "POLA ASUH",
            image: "https://images.unsplash.com/photo-1516534775068-bb57846d985b?auto=format&fit=crop&q=80&w=400"
        },
        {
            title: "Digital Detox untuk Buah Hati Anda",
            category: "POLA ASUH",
            image: "https://images.unsplash.com/photo-1503454537688-e47a98d86367?auto=format&fit=crop&q=80&w=400"
        },
        {
            title: "Pembaruan Jadwal Imunisasi 2024",
            category: "IMUNISASI",
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400"
        }
    ]

    return (
        <div style={{ background: '#fff', color: '#1f2937', minHeight: '100vh', paddingTop: '80px' }}>
            <AdminBar label="Tambah Konten Beranda" onClick={() => {}} />

            {/* HERO SECTION - Resep MPASI */}
            <section style={{ padding: '4rem 0', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(244,114,182,0.1), rgba(236,72,153,0.1))' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '3rem', alignItems: 'center' }}>
                    {/* Left Copy */}
                    <div>
                        <div style={{
                            display: 'inline-block',
                            background: '#f472b6', color: 'white',
                            padding: '0.5rem 1rem', borderRadius: '30px',
                            fontSize: '0.75rem', fontWeight: 700, marginBottom: '2rem'
                        }}>
                            MINGGUIAN
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
                            lineHeight: 1.1, marginBottom: '1.5rem', color: '#111827'
                        }}>
                            Resep MPASI <br />
                            <span style={{ color: '#f472b6' }}>Bergizi untuk<br />Tahap 1</span>
                        </h1>

                        <p style={{
                            fontSize: '0.95rem', color: '#4b5563', lineHeight: 1.7,
                            marginBottom: '2.5rem', maxWidth: '90%'
                        }}>
                            Temukan resep masakan rumahan sehat yang dirancang khusus untuk makanan padat pertama buah hati Anda.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Link to="/gizi-menu" style={{
                                background: '#f472b6', color: 'white',
                                padding: '0.75rem 1.5rem', borderRadius: '30px',
                                fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                boxShadow: '0 4px 14px rgba(244,114,182,0.4)', transition: 'all 0.2s'
                            }}>
                                Eksplorasi Resep <ArrowRight size={18} />
                            </Link>
                            <button style={{
                                background: 'white', color: '#1f2937',
                                padding: '0.75rem 1.5rem', borderRadius: '30px',
                                fontWeight: 600, border: '1px solid #e5e7eb',
                                display: 'inline-flex', alignItems: 'center', cursor: 'pointer'
                            }}>
                                Tonton Panduan
                            </button>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div style={{ position: 'relative', height: '400px' }}>
                        <img src="https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=600"
                            alt="Ibu dan Anak"
                            style={{
                                width: '100%', height: '100%', objectFit: 'cover',
                                borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* KATEGORI MENU ICONS */}
            <section style={{ padding: '4rem 0', background: 'white' }}>
                <div className="container">
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '1.5rem', justifyItems: 'center'
                    }}>
                        {menuCategories.map((cat, idx) => {
                            const Icon = cat.icon
                            const content = (
                                <div style={{ textAlign: 'center', cursor: 'pointer' }} className="hover-scale">
                                    <div style={{
                                        width: 80, height: 80, borderRadius: '12px',
                                        background: '#fff0f5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: '0.75rem', transition: 'all 0.2s'
                                    }}>
                                        <Icon size={32} color="#f472b6" />
                                    </div>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1f2937' }}>
                                        {cat.label}
                                    </p>
                                </div>
                            )
                            return cat.link ? <Link key={idx} to={cat.link}>{content}</Link> : <div key={idx}>{content}</div>
                        })}
                    </div>
                </div>
            </section>

            {/* RESEP BERGIZI */}
            <section style={{ padding: '4rem 0', background: '#fff9fb' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#111827' }}>
                                Resep Bergizi
                            </h2>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                Makanan sempurna untuk setiap tahap perkembangan anak
                            </p>
                        </div>
                        <Link to="/gizi-menu" style={{ color: '#f472b6', fontWeight: 600, fontSize: '0.9rem' }}>
                            Lihat Semua →
                        </Link>
                    </div>

                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {recipes.map((recipe, idx) => (
                            <div key={idx} style={{
                                background: 'white', borderRadius: '16px', overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.2s', cursor: 'pointer'
                            }} className="hover-shadow">
                                <div style={{
                                    height: '180px', overflow: 'hidden', background: '#e5e7eb'
                                }}>
                                    <img src={recipe.image} alt={recipe.title} style={{
                                        width: '100%', height: '100%', objectFit: 'cover'
                                    }} />
                                </div>
                                <div style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                                        <span style={{
                                            fontSize: '0.7rem', fontWeight: 700, color: '#f472b6',
                                            background: '#fff1f2', padding: '0.25rem 0.75rem', borderRadius: '20px'
                                        }}>
                                            {recipe.stage}
                                        </span>
                                        <span style={{
                                            fontSize: '0.7rem', fontWeight: 700, color: '#6b7280',
                                            background: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '20px'
                                        }}>
                                            {recipe.time}
                                        </span>
                                    </div>
                                    <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem', color: '#1f2937' }}>
                                        {recipe.title}
                                    </h3>
                                    <Link to="/gizi-menu" style={{ color: '#f472b6', fontWeight: 600, fontSize: '0.85rem' }}>
                                        Lihat Resep
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PANDUAN TUMBUH KEMBANG */}
            <section style={{ padding: '4rem 0', background: 'white' }}>
                <div className="container" style={{
                    background: 'linear-gradient(135deg, #6b2d5c, #8b3a6a)', borderRadius: '24px', padding: '3rem',
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', color: 'white'
                }}>
                    {/* Left content */}
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                            Panduan Tumbuh Kembang
                        </h2>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem', opacity: 0.9 }}>
                            Pelajari perkembangan yang dipersonalisasi dst video pembelajaran berdasarkan usia kolompok usia Anda.
                        </p>

                        {/* Stage Tabs */}
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                            {['0-3 Bulan', '7-12 Bulan', '1-2 Tahun', '3-5 Tahun'].map((stage, i) => (
                                <button key={i} style={{
                                    padding: '0.5rem 1rem', borderRadius: '20px',
                                    fontWeight: 600, fontSize: '0.85rem',
                                    background: i === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                                    color: 'white', border: 'none', cursor: 'pointer'
                                }}>
                                    {stage}
                                </button>
                            ))}
                        </div>

                        <button style={{
                            background: '#f472b6', color: 'white',
                            padding: '0.75rem 1.5rem', borderRadius: '30px',
                            fontWeight: 700, border: 'none', cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(244,114,182,0.4)'
                        }}>
                            Lihat Panduan Lengkap
                        </button>
                    </div>

                    {/* Right Images */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                        <div style={{
                            borderRadius: '16px', overflow: 'hidden', height: '200px',
                            background: '#ddd', gridColumn: '1 / 2', gridRow: '1 / 3'
                        }}>
                            <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400"
                                alt="Perawatan Bayi"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{
                            borderRadius: '16px', overflow: 'hidden', height: '150px'
                        }}>
                            <img src="https://images.unsplash.com/photo-1503454537688-e47a98d86367?auto=format&fit=crop&q=80&w=400"
                                alt="Mobilitas"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ARTIKEL EDUKASI TERBARU */}
            <section style={{ padding: '4rem 0', background: '#fdf8f9' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#111827' }}>
                                Artikel Edukasi Terbaru
                            </h2>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                Dapatkan informasi terbaru dari para ahli tentang kesehatan ibu dan anak
                            </p>
                        </div>
                        <Link to="/konten" style={{
                            background: '#f472b6', color: 'white',
                            padding: '0.6rem 1.25rem', borderRadius: '30px',
                            fontWeight: 600, fontSize: '0.85rem'
                        }}>
                            Baca Selengkapnya
                        </Link>
                    </div>

                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {articles.map((article, idx) => (
                            <div key={idx} style={{
                                background: 'white', borderRadius: '16px', overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.2s', cursor: 'pointer'
                            }} className="hover-shadow">
                                <div style={{
                                    height: '160px', overflow: 'hidden', background: '#e5e7eb'
                                }}>
                                    <img src={article.image} alt={article.title} style={{
                                        width: '100%', height: '100%', objectFit: 'cover'
                                    }} />
                                </div>
                                <div style={{ padding: '1.25rem' }}>
                                    <span style={{
                                        fontSize: '0.7rem', fontWeight: 700, color: '#f472b6',
                                        background: '#fff1f2', padding: '0.25rem 0.75rem', borderRadius: '20px'
                                    }}>
                                        {article.category}
                                    </span>
                                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', marginTop: '0.75rem', color: '#1f2937' }}>
                                        {article.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style>{`
                .hover-shadow:hover { box-shadow: 0 10px 25px rgba(0,0,0,0.1); transform: translateY(-4px); }
                .hover-scale:hover { transform: scale(1.05); }
                @media (max-width: 900px) {
                    section .container { grid-template-columns: 1fr !important; }
                    .container > div { margin-top: 2rem; }
                }
            `}</style>
        </div>
    )
}
