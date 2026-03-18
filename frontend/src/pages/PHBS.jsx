import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../lib/api'
import AdminBar from '../components/AdminBar'

const PHBS_CATEGORIES = [
    { key: 'semua', label: 'Semua Artikel', icon: '📄' },
    { key: 'kebersihan_diri', label: 'Kebersihan Diri', icon: '🧼' },
    { key: 'sanitasi_lingkungan', label: 'Sanitasi Lingkungan', icon: '🏠' },
    { key: 'pencegahan_penyakit', label: 'Pencegahan Penyakit', icon: '💊' },
    { key: 'gaya_hidup_sehat', label: 'Gaya Hidup Sehat', icon: '💪' },
]

const CATEGORY_COLORS = {
    kebersihan_diri: { bg: '#fff1f2', label: 'KEBERSIHAN DIRI', color: '#ec4899' },
    sanitasi_lingkungan: { bg: '#f0fdf4', label: 'SANITASI LINGKUNGAN', color: '#10b981' },
    pencegahan_penyakit: { bg: '#fef3c7', label: 'PENCEGAHAN PENYAKIT', color: '#f59e0b' },
    gaya_hidup_sehat: { bg: '#e0f2fe', label: 'GAYA HIDUP SEHAT', color: '#06b6d4' },
}

const SAMPLE_PHBS = [
    {
        id: 1,
        slug: 'cara-mencuci-tangan-6-langkah',
        title: 'Cara Mencuci Tangan 6 Langkah WHO',
        summary: 'Mencuci tangan dengan sabun secara benar adalah pertahanan terbaik untuk penyakit menular...',
        category: 'kebersihan_diri',
        readMinutes: 3,
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400'
    },
    {
        id: 2,
        slug: 'menjaga-kebersihan-sumber-air-rumah',
        title: 'Menjaga Kebersihan Sumber Air Rumah',
        summary: 'Posisi air yang dijaga kebersihan keluarga tidak konsumsi dengan air kumuh yang...',
        category: 'sanitasi_lingkungan',
        readMinutes: 5,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5f400f6f0?w=400'
    },
    {
        id: 3,
        slug: 'pilih-6-buang-sampah-pada-tempatnya',
        title: 'Pilih & Buang Sampah pada Tempatnya',
        summary: 'Pengajaran anak membuang sampah sesuai kategorinya dengan cara yang...',
        category: 'gaya_hidup_sehat',
        readMinutes: 4,
        image: 'https://images.unsplash.com/photo-1532996122724-8f3c2cd83c5d?w=400'
    },
    {
        id: 4,
        slug: '3m-plus-bebersih-rumah-dari-jentik',
        title: '3M Plus: Bebersih Rumah dari Jentik',
        summary: 'Panduan rutin mingguan untuk membersihkan tempat penampungan air agar tidak...',
        category: 'pencegahan_penyakit',
        readMinutes: 5,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5f400f6f0?w=400'
    },
    {
        id: 5,
        slug: '30-menit-aktivitas-fisik-setiap-hari',
        title: '30 Menit Aktivitas Fisik Setiap Hari',
        summary: 'Jangan biarkan keluarga modern semakin tidak aktif. Siskah giat olahraga...',
        category: 'gaya_hidup_sehat',
        readMinutes: 5,
        image: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400'
    },
    {
        id: 6,
        slug: 'pentingnya-memotong-kuku-teratur',
        title: 'Pentingnya Memotong Kuku Teratur',
        summary: 'Kuku yang panjang menjadi sarang kuman. Simak cara aman memotong...',
        category: 'kebersihan_diri',
        readMinutes: 3,
        image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400'
    },
    {
        id: 7,
        slug: 'mandi-teratur-untuk-kebersihan-kulit',
        title: 'Mandi Teratur untuk Kebersihan Kulit',
        summary: 'Mandi 2x sehari dengan air bersih dan sabun dapat meningkatkan...',
        category: 'kebersihan_diri',
        readMinutes: 3,
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400'
    },
    {
        id: 8,
        slug: 'cuci-tangan-sebelum-makan-dan-menyiapkan-makanan',
        title: 'Cuci Tangan Sebelum Makan & Menyiapkan Makanan',
        summary: 'Kebiasaan sederhana yang dapat mencegah penyakit bawaan makanan...',
        category: 'kebersihan_diri',
        readMinutes: 4,
        image: 'https://images.unsplash.com/photo-1576091160588-112fa86429ff?w=400'
    },
    {
        id: 9,
        slug: 'pemeliharaan-jamban-keluarga',
        title: 'Pemeliharaan Jamban Keluarga',
        summary: 'Jamban yang bersih dan sehat adalah syarat dasar kesehatan keluarga...',
        category: 'sanitasi_lingkungan',
        readMinutes: 5,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5f400f6f0?w=400'
    },
    {
        id: 10,
        slug: 'makanan-bergizi-seimbang-untuk-keluarga',
        title: 'Makanan Bergizi Seimbang untuk Keluarga',
        summary: 'Pola makan seimbang mencakup karbohidrat, protein, lemak, vitamin...',
        category: 'gaya_hidup_sehat',
        readMinutes: 6,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
    },
    {
        id: 11,
        slug: 'vaksinasi-lengkap-untuk-perlindungan-maksimal',
        title: 'Vaksinasi Lengkap untuk Perlindungan Maksimal',
        summary: 'Vaksin adalah investasi terbaik untuk kesehatan jangka panjang anak...',
        category: 'pencegahan_penyakit',
        readMinutes: 5,
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400'
    },
    {
        id: 12,
        slug: 'tidak-merokok-demi-kesehatan-keluarga',
        title: 'Tidak Merokok Demi Kesehatan Keluarga',
        summary: 'Asap rokok dari orang tua berdampak negatif pada kesehatan anak...',
        category: 'gaya_hidup_sehat',
        readMinutes: 4,
        image: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400'
    },
]

const ITEMS_PER_PAGE = 6

function PHBSCard({ item }) {
    const catColor = CATEGORY_COLORS[item.category] || { bg: '#f3f4f6', label: item.category, color: '#6b7280' }

    return (
        <Link to={`/konten/${item.slug}`} className="glass-card" style={{
            borderRadius: '1rem', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            transition: 'all 0.3s', cursor: 'pointer'
        }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '' }}
        >
            {/* Image */}
            <div style={{ height: 180, overflow: 'hidden', background: '#e5e7eb' }}>
                <img src={item.image} alt={item.title} style={{
                    width: '100%', height: '100%', objectFit: 'cover'
                }} />
            </div>

            {/* Content */}
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                {/* Category badge */}
                <div style={{
                    display: 'inline-block',
                    background: catColor.bg,
                    color: catColor.color,
                    padding: '0.3rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: 'fit-content'
                }}>
                    {catColor.label}
                </div>

                {/* Title */}
                <h3 style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.3, margin: 0, color: '#1f2937' }}>
                    {item.title}
                </h3>

                {/* Summary */}
                <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.5, margin: 0, flex: 1 }}>
                    {item.summary}
                </p>

                {/* Read time & link */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={13} /> {item.readMinutes} min baca
                    </span>
                    <span style={{ color: '#f472b6', fontWeight: 700, fontSize: '0.9rem' }}>Baca →</span>
                </div>
            </div>
        </Link>
    )
}

export default function PHBS() {
    const [articles, setArticles] = useState(SAMPLE_PHBS)
    const [loading, setLoading] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('semua')
    const [currentPage, setCurrentPage] = useState(1)

    // Fetch data
    useEffect(() => {
        setLoading(true)
        api.get('/content?kategori=phbs')
            .then(r => { if (r.data?.data?.length) setArticles(r.data.data) })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    // Filter articles
    const filtered = selectedCategory === 'semua' 
        ? articles 
        : articles.filter(a => a.category === selectedCategory)

    // Pagination
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
    const displayedArticles = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE)

    const handleCategoryChange = (key) => {
        setSelectedCategory(key)
        setCurrentPage(1)
    }

    return (
        <div style={{ paddingTop: 80, minHeight: '100vh', background: '#fdf8f9' }}>
            <AdminBar label="Tambah Artikel PHBS" onClick={() => { }} />
            
            {/* Breadcrumb */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem 0', fontSize: '0.9rem' }}>
                <Link to="/" style={{ color: '#f472b6', textDecoration: 'none' }}>Beranda</Link>
                <span style={{ margin: '0 0.5rem', color: '#d1d5db' }}>›</span>
                <span style={{ color: '#f472b6', fontWeight: 700 }}>PHBS</span>
            </div>

            {/* Header */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem', color: '#1f2937' }}>
                    Perilaku Hidup Bersih dan Sehat (PHBS)
                </h1>
                <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: 1.6, maxWidth: 600 }}>
                    Panduan praktis menjaga kesehatan keluarga melalui kebiasaan sehari-hari yang Genar dan higiene.
                </p>
            </div>

            {/* Content Section */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1rem 4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem' }}>

                    {/* Sidebar - Categories */}
                    <div>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Kategori PHBS
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {PHBS_CATEGORIES.map(cat => (
                                <button
                                    key={cat.key}
                                    onClick={() => handleCategoryChange(cat.key)}
                                    style={{
                                        padding: '0.75rem', borderRadius: '8px', border: 'none',
                                        background: selectedCategory === cat.key ? '#fff1f2' : 'transparent',
                                        color: selectedCategory === cat.key ? '#f472b6' : '#6b7280',
                                        fontWeight: selectedCategory === cat.key ? 700 : 500,
                                        fontSize: '0.9rem', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                                        transition: 'all 0.2s',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                                    {cat.label}
                                    {selectedCategory === cat.key && (
                                        <span style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#f472b6' }} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div>
                        {/* Header with count and sort */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>
                                    Menampilkan <strong style={{ color: '#1f2937' }}>{filtered.length} Panduan PHBS</strong>
                                </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>URUTKAN</span>
                                <select style={{
                                    padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #e5e7eb',
                                    fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', background: 'white'
                                }}>
                                    <option>Terbaru</option>
                                    <option>Terpopuler</option>
                                    <option>Paling Banyak Dibaca</option>
                                </select>
                            </div>
                        </div>

                        {/* Grid Articles */}
                        {loading ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} style={{
                                        borderRadius: '1rem', background: '#f3f4f6', height: 350,
                                        animation: 'pulse 1.5s ease-in-out infinite'
                                    }} />
                                ))}
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                                    {displayedArticles.map(article => (
                                        <PHBSCard key={article.id} item={article} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            style={{
                                                width: 36, height: 36, border: '1px solid #e5e7eb',
                                                borderRadius: '6px', background: 'white',
                                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                                opacity: currentPage === 1 ? 0.5 : 1,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            <ChevronLeft size={18} />
                                        </button>

                                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                            const pageNum = i + 1
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    style={{
                                                        width: 36, height: 36, borderRadius: '6px',
                                                        border: pageNum === currentPage ? 'none' : '1px solid #e5e7eb',
                                                        background: pageNum === currentPage ? '#f472b6' : 'white',
                                                        color: pageNum === currentPage ? 'white' : '#1f2937',
                                                        fontWeight: 700, cursor: 'pointer'
                                                    }}
                                                >
                                                    {pageNum}
                                                </button>
                                            )
                                        })}

                                        {totalPages > 5 && (
                                            <span style={{ color: '#9ca3af' }}>...</span>
                                        )}

                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            style={{
                                                width: 36, height: 36, border: '1px solid #e5e7eb',
                                                borderRadius: '6px', background: 'white',
                                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                                opacity: currentPage === totalPages ? 0.5 : 1,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
