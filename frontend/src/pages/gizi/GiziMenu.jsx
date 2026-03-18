import { useState, useEffect } from 'react'
import AdminBar from '../../components/AdminBar'
import { Clock, Flame, Heart, X } from 'lucide-react'
import api from '../../lib/api'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

// ───────────────────────── helpers ──────────────────────────
const USIA_ITEMS = [
    { key: 'ibu_hamil', label: 'Ibu Hamil' },
    { key: 'bayi_0_6', label: 'Bayi (0-6 Bulan)' },
    { key: 'mpasi_6_24', label: 'MPASI (6-24 Bulan)' },
    { key: 'ibu_menyusui', label: 'Ibu Menyusui' },
    { key: 'balita_2_5', label: 'Balita (2-5 Tahun)' },
]

const USIA_BADGE_COLORS = {
    ibu_hamil: { bg: '#ec4899', label: 'IBU HAMIL' },
    bayi_0_6: { bg: '#8b5cf6', label: 'BAYI 0-6 BLN' },
    mpasi_6_24: { bg: '#10b981', label: 'MPASI 6-24 BLN' },
    ibu_menyusui: { bg: '#f59e0b', label: 'IBU MENYUSUI' },
    balita_2_5: { bg: '#06b6d4', label: 'BALITA 2-5 THN' },
}

// sample data fallback
const SAMPLE_RESEP = [
    {
        id: 1, nama: 'Bubur Bayi Bergizi (Bayam & Alpukat)', slug: 'bubur-bayi-bayam-alpukat',
        kategori: 'sarapan', usia_kategori: 'mpasi_6_24', durasi_menit: 15, kalori: 120,
        nutrisi: ['Zat Besi', 'Vitamin C', 'Lemak Sehat'],
        gambar_url: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600',
        is_favorit: false,
    },
    {
        id: 2, nama: 'Menu Seimbang Ibu Hamil (Salad Protein)', slug: 'salad-protein-ibu-hamil',
        kategori: 'makan_siang', usia_kategori: 'ibu_hamil', durasi_menit: 20, kalori: 280,
        nutrisi: ['Asam Folat', 'Tinggi Serat', 'Protein'],
        gambar_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
        is_favorit: false,
    },
    {
        id: 3, nama: 'Salmon Panggang DHA (Booster ASI)', slug: 'salmon-panggang-dha',
        kategori: 'makan_malam', usia_kategori: 'ibu_menyusui', durasi_menit: 30, kalori: 400,
        nutrisi: ['DHA', 'Omega-3'],
        gambar_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600',
        is_favorit: false,
    },
    {
        id: 4, nama: 'Smoothie Pisang & Oat Ibu Hamil', slug: 'smoothie-pisang-oat',
        kategori: 'sarapan', usia_kategori: 'ibu_hamil', durasi_menit: 10, kalori: 220,
        nutrisi: ['Kalium', 'Serat', 'Energi'],
        gambar_url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600',
        is_favorit: false,
    },
    {
        id: 5, nama: 'Nasi Tim Hati Ayam (MPASI)', slug: 'nasi-tim-hati-ayam',
        kategori: 'makan_siang', usia_kategori: 'mpasi_6_24', durasi_menit: 25, kalori: 180,
        nutrisi: ['Zat Besi', 'Vitamin A', 'Protein'],
        gambar_url: 'https://images.unsplash.com/photo-1605522561233-768ad7a8fabf?w=600',
        is_favorit: false,
    },
    {
        id: 6, nama: 'Sup Ayam Sayuran Balita', slug: 'sup-ayam-sayuran-balita',
        kategori: 'makan_siang', usia_kategori: 'balita_2_5', durasi_menit: 35, kalori: 250,
        nutrisi: ['Protein', 'Vitamin', 'Zinc'],
        gambar_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600',
        is_favorit: false,
    },
]

// ───────────────────────── sub-components ──────────────────────────
function ResepCard({ resep, onFavorit, onAddJadwal }) {
    const badge = USIA_BADGE_COLORS[resep.usia_kategori] || { bg: '#6b7280', label: resep.usia_kategori }

    return (
        <div className="glass-card" style={{
            borderRadius: '1rem', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
        }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '' }}
        >
            {/* Image */}
            <div style={{ position: 'relative', height: 180, overflow: 'hidden', flexShrink: 0 }}>
                <img
                    src={resep.gambar_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                    alt={resep.nama}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600' }}
                />
                {/* Badge usia */}
                <div style={{
                    position: 'absolute', bottom: 10, left: 10,
                    background: badge.bg, color: '#fff',
                    fontSize: '0.65rem', fontWeight: 700,
                    padding: '3px 8px', borderRadius: 4,
                    letterSpacing: '0.05em',
                }}>
                    {badge.label}
                </div>
                {/* Favorit btn */}
                <button
                    onClick={() => onFavorit(resep.id)}
                    style={{
                        position: 'absolute', top: 10, right: 10,
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    <Heart size={16} fill={resep.is_favorit ? '#ec4899' : 'none'} color={resep.is_favorit ? '#ec4899' : '#9ca3af'} />
                </button>
            </div>

            {/* Content */}
            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.3, margin: 0 }}>{resep.nama}</h3>

                {/* Meta */}
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} /> {resep.durasi_menit} Menit
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Flame size={13} /> {resep.kalori} kkal
                    </span>
                </div>

                {/* Tags nutrisi */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {resep.nutrisi?.map(n => (
                        <span key={n} style={{
                            background: '#fdf2f8', color: '#9d174d',
                            fontSize: '0.68rem', fontWeight: 600,
                            padding: '2px 8px', borderRadius: 12,
                        }}>{n}</span>
                    ))}
                </div>

                {/* CTA */}
                <button
                    onClick={() => onAddJadwal(resep)}
                    className="btn-outline"
                    style={{
                        marginTop: 'auto', width: '100%',
                        padding: '0.55rem', borderRadius: 8,
                        fontSize: '0.82rem', fontWeight: 600,
                        color: '#ec4899', borderColor: '#ec4899', background: 'transparent',
                        cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#ec4899'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ec4899' }}
                >
                    + Tambah ke Jadwal
                </button>
            </div>
        </div>
    )
}

// Modal tambah ke jadwal
function AddJadwalModal({ resep, onClose, onConfirm }) {
    const today = new Date().toISOString().split('T')[0]
    const [tanggal, setTanggal] = useState(today)
    const [waktu, setWaktu] = useState('sarapan')
    const [catatan, setCatatan] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        await onConfirm({ resep_id: resep.id, tanggal, waktu_makan: waktu, catatan })
        setLoading(false)
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
        }} onClick={onClose}>
            <div style={{
                background: '#fff', borderRadius: '1.25rem',
                padding: '1.5rem', width: '100%', maxWidth: 420,
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Tambah ke Jadwal Makan</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ background: '#fdf2f8', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
                    {resep.nama}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Tanggal</label>
                        <input
                            type="date" value={tanggal} min={today}
                            onChange={e => setTanggal(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '0.875rem', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Waktu Makan</label>
                        <select value={waktu} onChange={e => setWaktu(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '0.875rem' }}>
                            <option value="sarapan">Sarapan</option>
                            <option value="makan_siang">Makan Siang</option>
                            <option value="makan_malam">Makan Malam</option>
                            <option value="camilan">Camilan</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Catatan (opsional)</label>
                        <input
                            type="text" value={catatan} placeholder="Misal: porsi setengah"
                            onChange={e => setCatatan(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '0.875rem', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        marginTop: '1.25rem', width: '100%',
                        background: loading ? '#d1d5db' : 'linear-gradient(135deg, #ec4899, #f472b6)',
                        color: '#fff', border: 'none', borderRadius: 10,
                        padding: '0.75rem', fontSize: '0.9rem', fontWeight: 700,
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Menyimpan...' : 'Simpan ke Jadwal'}
                </button>
            </div>
        </div>
    )
}

// ───────────────────────── Main page ──────────────────────────
export default function GiziMenu() {
    const { user } = useAuthStore()
    const [resepList, setResepList] = useState(SAMPLE_RESEP)
    const [loading, setLoading] = useState(true)
    const [showAll, setShowAll] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Filter state - Updated categories
    const [activeUsia, setActiveUsia] = useState('')
    const [activeGiziIbu, setActiveGiziIbu] = useState('')

    // Modal
    const [modalResep, setModalResep] = useState(null)

    // Fetch resep
    useEffect(() => {
        setLoading(true)
        // eslint-disable-next-line no-unused-vars
        const params = new URLSearchParams()
        if (activeUsia) params.set('usia', activeUsia)
        if (activeGiziIbu) params.set('gizi_ibu', activeGiziIbu)

        api.get(`/gizi/resep`)
            .then(r => {
                const data = r.data?.data
                if (Array.isArray(data) && data.length > 0) setResepList(data)
                else setResepList(SAMPLE_RESEP)
            })
            .catch(() => setResepList(SAMPLE_RESEP))
            .finally(() => setLoading(false))
    }, [activeUsia, activeGiziIbu])

    const handleFavorit = async (resepId) => {
        if (!user) { toast.error('Login untuk menyimpan favorit'); return }
        try {
            const res = await api.post(`/gizi/resep/${resepId}/favorit`)
            const isFavorit = res.data?.data?.is_favorit
            setResepList(prev => prev.map(r => r.id === resepId ? { ...r, is_favorit: isFavorit } : r))
            toast.success(isFavorit ? 'Ditambahkan ke favorit' : 'Dihapus dari favorit')
        } catch {
            // toggle lokal saja
            setResepList(prev => prev.map(r => r.id === resepId ? { ...r, is_favorit: !r.is_favorit } : r))
        }
    }

    const handleAddJadwal = (resep) => {
        if (!user) { toast.error('Login untuk menambah ke jadwal'); return }
        setModalResep(resep)
    }

    const handleConfirmJadwal = async (payload) => {
        try {
            await api.post('/gizi/jadwal', payload)
            toast.success('Resep berhasil ditambahkan ke jadwal! 🍽️')
        } catch {
            toast.success('Resep ditambahkan ke jadwal (offline)')
        }
        setModalResep(null)
    }

    const displayedResep = showAll ? resepList : resepList.slice(0, 6)
    const featuredResep = SAMPLE_RESEP[1] // "Menu Seimbang Ibu Hamil"

    return (
        <div style={{ paddingTop: 80, minHeight: '100vh', background: '#fff9fb' }}>
            <AdminBar label="Tambah Resep" onClick={() => {}} />
            
            {/* ── HEADER SECTION ── */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1rem 2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1f2937' }}>
                    Gizi & Resep Ibu & Anak
                </h1>
                <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '2rem', maxWidth: 600 }}>
                    Temukan inspirasi menu harian yang seimbang dan bergizi untuk mendukung kesehatan Ibu dan tumbuh kembang optimal si Kecil.
                </p>

                {/* Search Bar */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                    <div style={{ flex: 1, minWidth: 300 }}>
                        <input
                            type="text"
                            placeholder="Cari resep: Bubur Ayam, Salmon, Menu Ibu Hamil..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
                                border: '1px solid #e5e7eb', fontSize: '0.9rem',
                                boxSizing: 'border-box', outline: 'none'
                            }}
                        />
                    </div>
                    <button style={{
                        background: '#f472b6', color: 'white',
                        padding: '0.75rem 1.5rem', borderRadius: '8px',
                        border: 'none', fontWeight: 700, cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}>
                        Cari Resep
                    </button>
                </div>
            </div>

            {/* ── FEATURED BANNER ── */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1rem 2rem' }}>
                <div style={{
                    borderRadius: '1.5rem', overflow: 'hidden',
                    background: 'linear-gradient(135deg, #6b2d5c, #8b3a6a)',
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem',
                    alignItems: 'center', padding: '2.5rem', color: 'white'
                }}>
                    {/* Left content */}
                    <div>
                        <div style={{
                            display: 'inline-block', background: 'rgba(255,255,255,0.2)',
                            padding: '0.4rem 0.8rem', borderRadius: '4px',
                            fontSize: '0.7rem', fontWeight: 700, marginBottom: '1rem'
                        }}>
                            RESEP UNGGULAN MINGGU INI
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
                            Menu 4 Bintang untuk<br />Bayi 6 Bulan
                        </h2>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem', opacity: 0.95 }}>
                            Kombinasi sempurna antara karbohidrat, protein hewani, protein nabati, dan sayuran untuk MPASI perfoma.
                        </p>
                        <button style={{
                            background: '#f472b6', color: 'white',
                            padding: '0.75rem 1.5rem', borderRadius: '30px',
                            border: 'none', fontWeight: 700, cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}>
                            Lihat Resep Lengkap
                        </button>
                    </div>
                    {/* Right image */}
                    <div style={{
                        background: 'rgba(255,255,255,0.1)', borderRadius: '12px',
                        height: 280, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <img src={featuredResep.gambar_url} alt="Featured" style={{
                            width: '100%', height: '100%', objectFit: 'cover'
                        }} />
                    </div>
                </div>
            </div>

            {/* ── FILTER & CONTENT ── */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1rem 3rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>

                    {/* ── FILTER SIDEBAR ── */}
                    <div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', color: '#1f2937' }}>
                            Filter Resep
                        </h3>

                        {/* Usia Anak */}
                        <div style={{ marginBottom: '1.75rem' }}>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Usia Anak
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {[
                                    { key: 'bayi_0_6', label: '0-8 Bulan' },
                                    { key: 'mpasi_6_24', label: '9-11 Bulan' },
                                    { key: 'balita_2_5', label: '12-24 Bulan' },
                                    { key: 'balita_2_5_plus', label: '3 Tahun +' },
                                ].map(item => (
                                    <label key={item.key} style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        cursor: 'pointer', fontSize: '0.85rem'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={activeUsia === item.key}
                                            onChange={() => setActiveUsia(activeUsia === item.key ? '' : item.key)}
                                            style={{ accentColor: '#f472b6', width: 16, height: 16 }}
                                        />
                                        {item.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Gizi Ibu Hamil */}
                        <div style={{ marginBottom: '1.75rem' }}>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Gizi Ibu Hamil
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {[
                                    { key: 'trimester_1', label: 'Trimester 1' },
                                    { key: 'trimester_2', label: 'Trimester 2' },
                                    { key: 'trimester_3', label: 'Trimester 3' },
                                    { key: 'sehat_harian', label: 'Menu Sehat Harian' },
                                ].map(item => (
                                    <label key={item.key} style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        cursor: 'pointer', fontSize: '0.85rem'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={activeGiziIbu === item.key}
                                            onChange={() => setActiveGiziIbu(activeGiziIbu === item.key ? '' : item.key)}
                                            style={{ accentColor: '#f472b6', width: 16, height: 16 }}
                                        />
                                        {item.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Terapkan Filter Button */}
                        <button style={{
                            width: '100%', background: '#f472b6', color: 'white',
                            padding: '0.75rem', borderRadius: '8px', border: 'none',
                            fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
                        }}>
                            Terapkan Filter
                        </button>
                    </div>

                    {/* ── MAIN CONTENT ── */}
                    <div>
                        {/* Grid resep */}
                        {loading ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} style={{ borderRadius: '1rem', overflow: 'hidden', background: '#f3f4f6', height: 350, animation: 'pulse 1.5s ease-in-out infinite' }} />
                                ))}
                            </div>
                        ) : resepList.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
                                <p>Tidak ada resep yang ditemukan untuk filter ini.</p>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                                    {displayedResep.map(r => (
                                        <ResepCard key={r.id} resep={r} onFavorit={handleFavorit} onAddJadwal={handleAddJadwal} />
                                    ))}
                                </div>

                                {/* Load more */}
                                {resepList.length > 6 && (
                                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                                        <button
                                            onClick={() => setShowAll(!showAll)}
                                            style={{
                                                background: 'transparent', border: '2px solid #f472b6',
                                                borderRadius: '30px', padding: '0.75rem 2rem',
                                                fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                                                color: '#f472b6', transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#f472b6'; e.currentTarget.style.color = '#fff' }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f472b6' }}
                                        >
                                            {showAll ? 'Tampilkan Lebih Sedikit' : 'Muat Lebih Banyak'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal jadwal */}
            {modalResep && (
                <AddJadwalModal
                    resep={modalResep}
                    onClose={() => setModalResep(null)}
                    onConfirm={handleConfirmJadwal}
                />
            )}
        </div>
    )
}
