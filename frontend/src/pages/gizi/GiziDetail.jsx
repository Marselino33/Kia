import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Clock, Flame, Users, Heart, Share2, Bookmark, ChevronRight, Star } from 'lucide-react'
import api from '../../lib/api'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const USIA_BADGE_COLORS = {
  ibu_hamil: { bg: '#E8307D', label: 'IBU HAMIL' },
  bayi_0_6: { bg: '#8b5cf6', label: 'BAYI 0-6 BLN' },
  mpasi_6_24: { bg: '#10b981', label: 'MPASI 6-24 BLN' },
  ibu_menyusui: { bg: '#f59e0b', label: 'IBU MENYUSUI' },
  balita_2_5: { bg: '#06b6d4', label: 'BALITA 2-5 THN' },
}

const KATEGORI_BADGE = {
  sarapan: { bg: '#fef3c7', color: '#d97706', label: 'SARAPAN' },
  makan_siang: { bg: '#dbeafe', color: '#0284c7', label: 'MAKAN SIANG' },
  makan_malam: { bg: '#fce7f3', color: '#be123c', label: 'MAKAN MALAM' },
  snack: { bg: '#e0e7ff', color: '#4f46e5', label: 'SNACK' },
}

export default function GiziDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [resep, setResep] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [related, setRelated] = useState([])
  const [servingsCount, setServingsCount] = useState(2)

  // Sample resep data - replace dengan backend call
  const SAMPLE_RESEP_DETAIL = {
    'creamy-salmon-sweet-potato': {
      id: 1,
      nama: 'Creamy Salmon & Sweet Potato Mash',
      slug: 'creamy-salmon-sweet-potato',
      deskripsi: 'A brain-boosting meal rich in Omega-3s and Vitamin A for growing toddlers.',
      kategori: 'makan_siang',
      usia_kategori: 'mpasi_6_24',
      durasi_menit: 20,
      kalori: 185,
      servings: 2,
      nutrisi: ['DHA', 'Omega-3', 'Vitamin A'],
      gambar_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      badge: { text: 'New Recipe', color: '#E8307D' },
      bahan: [
        { item: 'Fresh Salmon', jumlah: '100g', satuan: 'fillet' },
        { item: 'Sweet Potato', jumlah: '1 medium', satuan: 'peeled & cubed' },
        { item: 'Coconut Milk', jumlah: '1/4 cup', satuan: 'unsweetened' },
        { item: 'Fresh Spinach', jumlah: 'Small handful', satuan: 'chopped' },
        { item: 'Olive Oil', jumlah: '1 teaspoon', satuan: '' },
      ],
      instruksi: [
        {
          step: 1,
          judul: 'Prepare the Sweet Potato',
          deskripsi: 'Place the cubed sweet potato in a steamer basket over boiling water. Cover and steam for 10-12 minutes or until tender when pierced with a fork.',
        },
        {
          step: 2,
          judul: 'Steam the Salmon',
          deskripsi: 'Add the salmon fillet to the steamer with the sweet potato for the last 5 minutes of cooking. Steam until the salmon is opaque and flakes easily.',
        },
        {
          step: 3,
          judul: 'Wilt the Spinach',
          deskripsi: 'In the final 1 minute, place the chopped spinach on top of the salmon and potatoes just to let it wilt from the steam.',
        },
        {
          step: 4,
          judul: 'Blend and Serve',
          deskripsi: 'Transfer all ingredients to a bowl. Add coconut milk and olive oil. Mash with a fork for texture or blend until smooth, depending on your child\'s age.',
        },
      ],
      tips: [
        'Untuk bayi 6-8 bulan, blender hingga halus. Untuk bayi 9+ bulan, tinggalkan tekstur kasar.',
        'Salmon kaya DHA yang bagus untuk perkembangan otak bayi.',
        'Bisa disiapkan sehari sebelumnya dan disimpan di kulkas dalam wadah tertutup.',
      ],
    },
    'bubur-bayi-bayam-alpukat': {
      id: 2,
      nama: 'Bubur Bayi Bergizi (Bayam & Alpukat)',
      slug: 'bubur-bayi-bayam-alpukat',
      deskripsi: 'Kombinasi sempurna zat besi dan lemak sehat untuk pertumbuhan optimal bayi.',
      kategori: 'sarapan',
      usia_kategori: 'mpasi_6_24',
      durasi_menit: 15,
      kalori: 120,
      servings: 1,
      nutrisi: ['Zat Besi', 'Vitamin C', 'Lemak Sehat'],
      gambar_url: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=800',
      bahan: [
        { item: 'Brown Rice', jumlah: '50g', satuan: 'cooked' },
        { item: 'Fresh Spinach', jumlah: '20g', satuan: 'chopped' },
        { item: 'Avocado', jumlah: '1/4', satuan: 'ripe' },
        { item: 'Breast Milk or Formula', jumlah: '100ml', satuan: '' },
      ],
      instruksi: [
        {
          step: 1,
          judul: 'Cook Rice',
          deskripsi: 'Cook brown rice until very soft. You can use rice cooker with extra water for mushier texture suitable for babies.',
        },
        {
          step: 2,
          judul: 'Steam Spinach',
          deskripsi: 'Steam fresh spinach for 2-3 minutes until soft. Let cool slightly.',
        },
        {
          step: 3,
          judul: 'Blend Ingredients',
          deskripsi: 'Combine cooked rice, steamed spinach, and mashed avocado in a bowl. Add breast milk or formula.',
        },
        {
          step: 4,
          judul: 'Mix Well',
          deskripsi: 'Blend or mash to desired consistency. Serve immediately while warm.',
        },
      ],
      tips: [
        'Alpukat memberikan lemak sehat yang penting untuk perkembangan otak.',
        'Bayam kaya zat besi untuk mencegah anemia pada bayi.',
        'Jangan masak spinach dengan daging merah bersama karena mengurangi penyerapan zat besi.',
      ],
    },
  }

  useEffect(() => {
    const loadResep = async () => {
      setLoading(true)
      try {
        // Try backend first
        const res = await api.get(`/gizi/resep/${slug}`)
        if (res.data?.data) {
          setResep(res.data.data)
        } else {
          // Fallback to sample data
          setResep(SAMPLE_RESEP_DETAIL[slug])
        }
      } catch (err) {
        // Fallback to sample data
        console.log('Using sample data')
        setResep(SAMPLE_RESEP_DETAIL[slug])
      }
      setLoading(false)
    }

    loadResep()
  }, [slug])

  const handleAddToMealPlan = async () => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      navigate('/login')
      return
    }

    try {
      await api.post('/gizi/jadwal', {
        resep_id: resep.id,
        tanggal: new Date().toISOString().split('T')[0],
        servings: servingsCount,
      })
      toast.success('Ditambahkan ke rencana makan minggu ini!')
    } catch (err) {
      toast.error('Gagal menambahkan ke rencana makan')
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      navigate('/login')
      return
    }

    try {
      await api.post(`/gizi/resep/${resep.id}/favorit`)
      setIsFavorite(!isFavorite)
      toast.success(isFavorite ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit')
    } catch (err) {
      toast.error('Gagal update favorit')
    }
  }

  if (loading) {
    return (
      <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!resep) {
    return (
      <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Resep tidak ditemukan</h1>
          <Link to="/gizi-menu" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Kembali ke Menu Gizi
          </Link>
        </div>
      </div>
    )
  }

  const usiaBadge = USIA_BADGE_COLORS[resep.usia_kategori] || {}
  const katBadge = KATEGORI_BADGE[resep.kategori] || {}

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <div style={{ position: 'relative', height: 400, overflow: 'hidden' }}>
        <img
          src={resep.gambar_url}
          alt={resep.nama}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {resep.badge && (
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              background: resep.badge.color,
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {resep.badge.text}
          </div>
        )}

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 44,
            height: 44,
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
          }}
        >
          ✕
        </button>
      </div>

      {/* Content Section */}
      <div className="container" style={{ paddingBlock: '2rem', maxWidth: 1000 }}>
        {/* Header & Info */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{resep.nama}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1rem' }}>
            {resep.deskripsi}
          </p>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {usiaBadge && (
              <span
                style={{
                  background: usiaBadge.bg,
                  color: 'white',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                ✓ {usiaBadge.label}
              </span>
            )}
            {katBadge && (
              <span
                style={{
                  background: katBadge.bg,
                  color: katBadge.color,
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                {katBadge.label}
              </span>
            )}
          </div>

          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: 'var(--radius-md)' }}>
              <Clock size={20} style={{ color: '#E8307D', marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>PREP TIME</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{resep.durasi_menit} mins</p>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: 'var(--radius-md)' }}>
              <Flame size={20} style={{ color: '#f59e0b', marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>CALORIES</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{resep.kalori} kcal</p>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: 'var(--radius-md)' }}>
              <Users size={20} style={{ color: '#10b981', marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>SERVINGS</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{resep.servings} bowls</p>
            </div>
          </div>

          {/* Nutrients */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              padding: '1rem',
              background: '#f0f9ff',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
            }}
          >
            {resep.nutrisi && resep.nutrisi.map((nut, idx) => (
              <span key={idx} style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0284c7' }}>
                ✓ {nut}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleAddToMealPlan}
              className="btn btn-primary"
              style={{
                flex: 1,
                minWidth: 300,
                padding: '0.95rem',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              + Add to Weekly Meal Plan
            </button>

            <button
              onClick={toggleFavorite}
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isFavorite ? '#fde8f3' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Heart size={24} fill={isFavorite ? '#E8307D' : 'none'} color={isFavorite ? '#E8307D' : '#d1d5db'} />
            </button>

            <button
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => {
                navigator.share?.({
                  title: resep.nama,
                  text: resep.deskripsi,
                  url: window.location.href,
                })
              }}
            >
              <Share2 size={20} color="#6b7280" />
            </button>
          </div>
        </div>

        {/* Instructions & Ingredients Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem', marginBottom: '3rem' }}>
          {/* Ingredients */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Ingredients</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, background: '#fee2e2', color: '#991b1b', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
                {resep.bahan?.length} Items
              </span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {resep.bahan && resep.bahan.map((b, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.875rem',
                    background: '#f9fafb',
                    borderRadius: 'var(--radius-md)',
                    alignItems: 'center',
                  }}
                >
                  <input type="checkbox" style={{ width: 18, height: 18, accentColor: '#E8307D' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{b.item}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.jumlah} {b.satuan}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Instructions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {resep.instruksi && resep.instruksi.map((ins, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: '#fde8f3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: '#E8307D',
                      flexShrink: 0,
                    }}
                  >
                    {ins.step}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.35rem' }}>{ins.judul}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {ins.deskripsi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        {resep.tips && (
          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fcd34d',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              💡 Pro Tips
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {resep.tips.map((tip, idx) => (
                <li key={idx} style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  • {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Related Recipes Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>You might also like</h2>
            <Link to="/gizi-menu" style={{ color: '#E8307D', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {Object.values(SAMPLE_RESEP_DETAIL)
              .filter((r) => r.slug !== slug)
              .slice(0, 3)
              .map((recipe) => (
                <Link
                  key={recipe.id}
                  to={`/gizi/${recipe.slug}`}
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                  <div
                    className="glass-card"
                    style={{
                      overflow: 'hidden',
                      transition: 'all 0.3s',
                      height: '100%',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-glow)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <img
                      src={recipe.gambar_url}
                      alt={recipe.nama}
                      style={{ width: '100%', height: 160, objectFit: 'cover' }}
                    />
                    <div style={{ padding: '1rem' }}>
                      <p style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700, marginBottom: '0.35rem' }}>
                        {recipe.kategori.toUpperCase()}
                      </p>
                      <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>{recipe.nama}</h3>
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>⏱ {recipe.durasi_menit}m</span>
                        <span>🔥 {recipe.kalori}kcal</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
