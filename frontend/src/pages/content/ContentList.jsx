import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, BookOpen, Clock, Filter, X } from 'lucide-react'
import api from '../../lib/api'

const PHASES = [
    { value: '', label: 'Semua Fase' },
    { value: 'perencanaan', label: 'Perencanaan' },
    { value: 'kehamilan_1', label: 'Kehamilan Trimester 1' },
    { value: 'kehamilan_2', label: 'Kehamilan Trimester 2' },
    { value: 'kehamilan_3', label: 'Kehamilan Trimester 3' },
    { value: 'persalinan', label: 'Persalinan' },
    { value: 'nifas', label: 'Nifas' },
    { value: 'bayi', label: 'Bayi Baru Lahir' },
    { value: 'balita', label: 'Balita' },
]

const PHASE_COLORS = {
    perencanaan: '#E8307D', kehamilan_1: '#8b5cf6', kehamilan_2: '#7c3aed',
    kehamilan_3: '#6d28d9', persalinan: '#f59e0b', nifas: '#ef4444',
    bayi: '#14b8a6', balita: '#10b981',
}

const SAMPLE_ARTICLES = [
    { id: 1, slug: 'nutrisi-ibu-hamil', title: 'Nutrisi Penting untuk Ibu Hamil', summary: 'Panduan lengkap asupan gizi selama kehamilan untuk ibu dan janin yang sehat.', category: 'Gizi', readMinutes: 5, phase: 'kehamilan_1', tags: ['gizi', 'kehamilan'] },
    { id: 2, slug: 'imunisasi-dasar-bayi', title: 'Jadwal Imunisasi Dasar Bayi 0-12 Bulan', summary: 'Informasi lengkap vaksin wajib bayi dan manfaatnya untuk kekebalan tubuh.', category: 'Imunisasi', readMinutes: 7, phase: 'bayi', tags: ['imunisasi', 'vaksin'] },
    { id: 3, slug: 'tanda-persalinan', title: 'Mengenali Tanda-Tanda Persalinan', summary: 'Persiapkan diri Anda dengan mengetahui tanda persalinan sejak dini.', category: 'Persalinan', readMinutes: 6, phase: 'persalinan', tags: ['persalinan', 'melahirkan'] },
    { id: 4, slug: 'asi-eksklusif', title: 'Panduan ASI Eksklusif 6 Bulan', summary: 'Manfaat dan cara sukses memberikan ASI eksklusif untuk tumbuh kembang optimal.', category: 'Gizi', readMinutes: 5, phase: 'bayi', tags: ['asi', 'menyusui'] },
    { id: 5, slug: 'perkembangan-balita', title: 'Stimulasi Tumbuh Kembang Balita 1-3 Tahun', summary: 'Aktivitas dan stimulasi tepat untuk mendukung perkembangan motorik dan kognitif balita.', category: 'Tumbuh Kembang', readMinutes: 8, phase: 'balita', tags: ['balita', 'stimulasi'] },
    { id: 6, slug: 'perawatan-bayi-baru', title: 'Merawat Bayi Baru Lahir di Rumah', summary: 'Tips merawat bayi baru lahir: memandikan, perawatan tali pusar, dan tanda bahaya.', category: 'Perawatan', readMinutes: 7, phase: 'bayi', tags: ['bayi baru lahir', 'perawatan'] },
    { id: 7, slug: 'anemia-kehamilan', title: 'Mencegah Anemia pada Kehamilan', summary: 'Cara mencegah dan mengatasi anemia yang sering terjadi selama masa kehamilan.', category: 'Kesehatan', readMinutes: 5, phase: 'kehamilan_2', tags: ['anemia', 'kehamilan'] },
    { id: 8, slug: 'kontrasepsi-pasca-melahirkan', title: 'Pilihan KB Pasca Melahirkan', summary: 'Panduan memilih metode kontrasepsi yang aman setelah melahirkan dan menyusui.', category: 'KB', readMinutes: 6, phase: 'nifas', tags: ['kb', 'kontrasepsi'] },
]

function ArticleCard({ article }) {
    const color = PHASE_COLORS[article.phase] || '#E8307D'
    return (
        <Link to={`/konten/${article.slug}`} className="glass-card" style={{ padding: '1.5rem', display: 'block' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: `${color}18`, border: `1px solid ${color}30`, color, fontSize: '0.7rem', fontWeight: 600 }}>
                    {article.category}
                </span>
                {article.phase && (
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.05)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {PHASES.find(p => p.value === article.phase)?.label || article.phase}
                    </span>
                )}
            </div>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.45, marginBottom: '0.5rem' }}>{article.title}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.65, marginBottom: '0.875rem' }}>{article.summary}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                <Clock size={12} /> {article.readMinutes} menit baca
            </div>
        </Link>
    )
}

export default function ContentList() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [articles, setArticles] = useState(SAMPLE_ARTICLES)
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const fase = searchParams.get('fase') || ''

    useEffect(() => {
        setLoading(true)
        const params = new URLSearchParams()
        if (fase) params.set('phase', fase)
        if (search.length > 2) params.set('q', search)

        api.get(`/content?${params}`).then(r => {
            if (r.data?.data?.length) setArticles(r.data.data)
        }).catch(() => { }).finally(() => setLoading(false))
    }, [fase, search])

    const filtered = articles.filter(a => {
        const matchPhase = !fase || a.phase === fase
        const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase())
        return matchPhase && matchSearch
    })

    return (
        <div style={{ paddingTop: 72 }}>
            {/* Header */}
            <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '2.5rem 0' }}>
                <div className="container">
                    <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                        <BookOpen size={24} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--primary-400)', verticalAlign: 'middle' }} />
                        Artikel Edukasi
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Informasi kesehatan ibu dan anak berdasarkan Buku KIA Kemenkes RI
                    </p>

                    {/* Search */}
                    <div style={{ position: 'relative', maxWidth: 480, marginBottom: '1.25rem' }}>
                        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="search" className="form-input" placeholder="Cari artikel..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: '2.75rem', paddingRight: search ? '2.75rem' : undefined }}
                            id="search-articles"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}>
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    {/* Phase Filter */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <Filter size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        {PHASES.map(({ value, label }) => (
                            <button key={value} onClick={() => setSearchParams(value ? { fase: value } : {})}
                                style={{
                                    padding: '0.3rem 0.875rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600,
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    background: fase === value ? 'var(--gradient-primary)' : '#f8fafc',
                                    border: fase === value ? 'none' : '1px solid var(--border-color)',
                                    color: fase === value ? 'white' : 'var(--text-secondary)',
                                }}
                            >{label}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Articles Grid */}
            <div className="container" style={{ paddingBlock: '2rem' }}>
                {loading ? (
                    <div className="grid-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
                                <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: '0.75rem' }} />
                                <div className="skeleton" style={{ height: 16, marginBottom: '0.5rem' }} />
                                <div className="skeleton" style={{ height: 16, width: '80%' }} />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                        <p>Tidak ada artikel yang ditemukan.</p>
                    </div>
                ) : (
                    <div className="grid-3">
                        {filtered.map(a => <ArticleCard key={a.id} article={a} />)}
                    </div>
                )}
            </div>
        </div>
    )
}
