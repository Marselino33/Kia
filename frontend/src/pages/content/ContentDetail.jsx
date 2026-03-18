import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Bookmark, BookmarkCheck, Share2, BookOpen } from 'lucide-react'
import api from '../../lib/api'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const ARTICLES_DB = {
    'nutrisi-ibu-hamil': {
        id: 1, title: 'Nutrisi Penting untuk Ibu Hamil', category: 'Gizi', readMinutes: 5, phase: 'Kehamilan Trimester 1',
        sourceRef: 'Buku KIA Kemenkes 2024, hal. 24-28',
        body: `## Mengapa Nutrisi Sangat Penting saat Hamil?

Selama kehamilan, kebutuhan nutrisi ibu meningkat untuk mendukung pertumbuhan janin, pembentukan plasenta, dan persiapan produksi ASI. Kekurangan nutrisi dapat berdampak serius pada kesehatan ibu dan perkembangan bayi.

## Zat Gizi Utama yang Dibutuhkan

### 1. Asam Folat (400-600 mcg/hari)
Sangat penting di trimester pertama untuk mencegah cacat tabung saraf (neural tube defects). Sumber: sayuran hijau, kacang-kacangan, buah jeruk, dan suplemen asam folat.

### 2. Zat Besi (27 mg/hari)
Mencegah anemia pada ibu hamil. Konsumsi tablet Fe setiap hari yang diberikan di Puskesmas. Sumber alami: daging merah, hati sapi, bayam, dan kacang-kacangan.

### 3. Kalsium (1.000 mg/hari)
Penting untuk pembentukan tulang dan gigi janin. Sumber: susu, yogurt, keju, ikan teri, dan tahu/tempe.

### 4. Protein (71 g/hari)
Membangun sel dan jaringan baru. Sumber: daging, ikan, telur, kedelai, dan produk susu.

### 5. Omega-3 (DHA)
Mendukung perkembangan otak dan mata janin. Sumber: ikan salmon, ikan tuna, dan kacang kenari.

## Pola Makan yang Dianjurkan

- Makan **3x sehari** dengan **2x camilan sehat**
- Perbanyak sayur dan buah berwarna-warni
- Batasi kafein (maksimal 200mg/hari = 1 cangkir kopi)
- Hindari ikan dengan merkuri tinggi (hiu, todak)
- Masak makanan hingga matang sempurna

## Makanan yang Harus Dihindari

❌ Makanan mentah (sushi, sashimi, telur mentah)
❌ Keju dan susu tidak pasteurisasi
❌ Alkohol sepenuhnya
❌ Daging setengah matang

> **Ingat**: Konsultasikan kebutuhan suplemen dengan bidan atau dokter kandungan Anda.`,
    },
    'imunisasi-dasar-bayi': {
        id: 2, title: 'Jadwal Imunisasi Dasar Bayi 0-12 Bulan', category: 'Imunisasi', readMinutes: 7, phase: 'Bayi (0-12 bulan)',
        sourceRef: 'Buku KIA Kemenkes 2024, hal. 54-60',
        body: `## Pentingnya Imunisasi Dasar Lengkap

Imunisasi adalah cara paling efektif dan aman melindungi bayi dari penyakit berbahaya. Pemerintah Indonesia mewajibkan **Imunisasi Dasar Lengkap (IDL)** yang diberikan secara gratis di Puskesmas dan Posyandu.

## Jadwal Imunisasi Lengkap

| Usia | Vaksin | Lokasi |
|------|--------|--------|
| Lahir | HB-0, BCG, Polio 0 | Rumah sakit/Puskesmas |
| 1 bulan | BCG (bila belum dapat) | Puskesmas |
| 2 bulan | DPT-HB-Hib 1, Polio 1 | Posyandu |
| 3 bulan | DPT-HB-Hib 2, Polio 2 | Posyandu |
| 4 bulan | DPT-HB-Hib 3, Polio 3, IPV | Posyandu |
| 9 bulan | Campak-Rubella | Posyandu |

## Efek Samping Wajar Pasca Imunisasi

Beberapa bayi mengalami:
- Demam ringan (37-38°C) selama 1-2 hari
- Kemerahan dan nyeri di tempat suntikan
- Rewel dan menangis lebih sering

**Cara mengatasi**: Kompres dingin di bekas suntikan. Bila demam >38.5°C lebih dari 2 hari, segera bawa ke Puskesmas.

## KIPI (Kejadian Ikutan Pasca Imunisasi)

Reaksi berat sangat jarang terjadi (1 per juta dosis). Imunisasi jauh lebih aman dari risiko penyakit yang dicegahnya.`,
    },
    'asi-eksklusif': {
        id: 4, title: 'Panduan ASI Eksklusif 6 Bulan', category: 'Gizi', readMinutes: 5, phase: 'Bayi (0-12 bulan)',
        sourceRef: 'Buku KIA Kemenkes 2024, hal. 45-52',
        body: `## Apa itu ASI Eksklusif?

ASI Eksklusif adalah pemberian **Air Susu Ibu saja** tanpa tambahan makanan atau minuman apapun (termasuk air putih) selama **6 bulan pertama** kehidupan bayi.

## 7 Manfaat ASI Eksklusif

1. **Nutrisi sempurna** — komposisi ASI berubah sesuai kebutuhan bayi
2. **Meningkatkan imunitas** — antibodi dalam ASI melindungi dari infeksi
3. **Mencegah alergi** — mengurangi risiko asma dan eksim
4. **Perkembangan otak optimal** — DHA dalam ASI mendukung kecerdasan
5. **Bonding ibu-bayi** — memperkuat ikatan emosional
6. **Menurunkan risiko SIDS** — kematian mendadak pada bayi
7. **Hemat & praktis** — selalu tersedia di suhu tepat

## Tips Sukses Menyusui

✅ Mulai menyusui dalam 1 jam pertama setelah lahir
✅ Menyusui on-demand (kapan bayi minta)
✅ Pastikan perlekatan (latch-on) yang benar
✅ Kosongkan satu payudara sebelum ganti sisi
✅ Minum cukup air dan makan bergizi

## Tanda Bayi Cukup ASI

- BAK minimal 6x/hari (popok basah)
- Berat badan naik sesuai kurva pertumbuhan
- Bayi tenang dan aktif setelah menyusu`,
    },
}

export default function ContentDetail() {
    const { slug } = useParams()
    const { user } = useAuthStore()
    const [article, setArticle] = useState(ARTICLES_DB[slug] || null)
    const [bookmarked, setBookmarked] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        api.get(`/content/${slug}`).then(r => { if (r.data) setArticle(r.data) }).catch(() => { })
        if (user) {
            api.get(`/bookmarks/${slug}`).then(r => setBookmarked(!!r.data?.bookmarked)).catch(() => { })
        }
    }, [slug, user])

    const toggleBookmark = async () => {
        if (!user) { navigate('/login'); return }
        try {
            if (bookmarked) {
                await api.delete(`/bookmarks/${article.id}`)
                toast.success('Bookmark dihapus')
            } else {
                await api.post('/bookmarks', { content_id: article.id })
                toast.success('Artikel disimpan ke bookmark!')
            }
            setBookmarked(!bookmarked)
        } catch { toast.error('Gagal mengubah bookmark') }
    }

    const shareArticle = () => {
        navigator.clipboard.writeText(window.location.href).then(() => toast.success('Link disalin!')).catch(() => { })
    }

    if (!article) return (
        <div style={{ paddingTop: 72, minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                <p>Artikel tidak ditemukan.</p>
                <Link to="/konten" className="btn btn-secondary" style={{ marginTop: '1rem' }}>← Kembali ke Artikel</Link>
            </div>
        </div>
    )

    // Convert markdown-like body to JSX
    const renderBody = (text) => text.split('\n').map((line, i) => {
        if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.25rem', fontWeight: 700, margin: '1.5rem 0 0.75rem', color: 'var(--text-primary)' }}>{line.slice(3)}</h2>
        if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: '1.05rem', fontWeight: 700, margin: '1.25rem 0 0.5rem', color: 'var(--primary-400)' }}>{line.slice(4)}</h3>
        if (line.startsWith('> **')) return <blockquote key={i} style={{ margin: '1rem 0', padding: '1rem 1.25rem', background: 'rgba(236,72,153,0.08)', borderLeft: '3px solid var(--primary-500)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{line.slice(2)}</blockquote>
        if (line.startsWith('- ') || line.startsWith('✅') || line.startsWith('❌')) return <li key={i} style={{ marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{line.startsWith('- ') ? line.slice(2) : line}</li>
        if (line.startsWith('| ')) return null // skip table lines for simplicity
        if (line.trim() === '') return <br key={i} />
        if (line.startsWith('**') || line.includes('**')) {
            const parts = line.split(/\*\*(.*?)\*\*/)
            return <p key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                {parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: 'var(--text-primary)' }}>{p}</strong> : p)}
            </p>
        }
        return <p key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '0.5rem', fontSize: '0.95rem' }}>{line}</p>
    })

    return (
        <div style={{ paddingTop: 72 }}>
            {/* Top bar */}
            <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link to="/konten" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
                        <ArrowLeft size={16} /> Kembali
                    </Link>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={shareArticle} className="btn btn-ghost" style={{ padding: '0.4rem 0.875rem', fontSize: '0.8rem' }}>
                            <Share2 size={14} /> Bagikan
                        </button>
                        <button onClick={toggleBookmark} className="btn" style={{
                            padding: '0.4rem 0.875rem', fontSize: '0.8rem',
                            background: bookmarked ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.06)',
                            border: bookmarked ? '1px solid rgba(236,72,153,0.3)' : '1px solid var(--border-color)',
                            color: bookmarked ? 'var(--primary-400)' : 'var(--text-secondary)',
                        }}>
                            {bookmarked ? <><BookmarkCheck size={14} /> Tersimpan</> : <><Bookmark size={14} /> Simpan</>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container" style={{ paddingBlock: '2.5rem', maxWidth: 760 }}>
                <div style={{ marginBottom: '1.25rem' }}>
                    <span className="badge badge-pink" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>{article.category}</span>
                    {article.phase && <span className="badge badge-teal" style={{ marginBottom: '0.75rem', marginLeft: '0.5rem', display: 'inline-flex' }}>{article.phase}</span>}
                </div>

                <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, lineHeight: 1.35, marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>{article.title}</h1>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        <Clock size={13} /> {article.readMinutes} menit baca
                    </span>
                    {article.sourceRef && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            📖 {article.sourceRef}
                        </span>
                    )}
                </div>

                <div className="divider" style={{ marginBottom: '2rem' }} />

                <div style={{ lineHeight: 1.8 }}>
                    {article.body && renderBody(article.body)}
                </div>

                {/* Back */}
                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                    <Link to="/konten" className="btn btn-secondary">
                        <ArrowLeft size={16} /> Lihat Artikel Lainnya
                    </Link>
                </div>
            </div>
        </div>
    )
}
