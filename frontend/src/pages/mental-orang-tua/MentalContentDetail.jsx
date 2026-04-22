import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import api from '../../lib/api'
import '../../styles/pages/mental-health-detail.css'

function buildList(text) {
  return String(text || '')
    .split(/\n|\.|;/)
    .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, 5)
}

export default function MentalContentDetail() {
  const { slug } = useParams()
  const [apiItem, setApiItem] = useState(null)
  const [relatedItems, setRelatedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setLoadFailed(false)
      try {
        const [detailRes, listRes] = await Promise.all([
          api.get(`/mental-orang-tua/${slug}`),
          api.get('/mental-orang-tua'),
        ])
        const detail = detailRes?.data?.data
        if (detail) {
          const signs = buildList(detail.isi)
          const defaultAction = detail.ringkasan || detail.judul
          setApiItem({
            slug: detail.slug,
            title: detail.judul,
            category: detail.kategori || 'EDUKASI',
            readTime: `${detail.read_minutes || 5} menit baca`,
            image: detail.gambar_url || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop',
            quote: detail.ringkasan || detail.judul,
            intro: detail.ringkasan || detail.isi || '',
            signs: signs.length ? signs : [defaultAction],
            actions: ['Validasi emosi dan minta dukungan keluarga', 'Atur waktu istirahat dan jeda harian'],
            consultWhen: ['Jika perlu dukungan profesional'],
          })
        } else {
          setApiItem(null)
        }
        const rows = Array.isArray(listRes?.data?.data) ? listRes.data.data : []
        setRelatedItems(rows.filter((entry) => entry.slug !== slug).slice(0, 4))
      } catch {
        setLoadFailed(true)
        setApiItem(null)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [slug])

  const item = useMemo(() => apiItem, [apiItem])

  useEffect(() => {
    if (!item) return
    try {
      localStorage.setItem('lastMentalContentSlug', item.slug)
    } catch {
      // Ignore storage errors in restricted environments.
    }
  }, [item])

  if (loading) {
    return (
      <main className="mental-detail-page">
        <div className="mental-detail-container">
          <p>Memuat detail konten mental...</p>
        </div>
      </main>
    )
  }

  if (!item && loadFailed) {
    return <Navigate to="/mental-health" replace />
  }

  if (!item) {
    return (
      <main className="mental-detail-page">
        <div className="mental-detail-container">
          <p>Konten mental tidak ditemukan.</p>
          <Link to="/mental-health">Kembali ke daftar konten mental</Link>
        </div>
      </main>
    )
  }

  const related = relatedItems.map((entry) => ({
    slug: entry.slug,
    category: entry.kategori || 'EDUKASI',
    title: entry.judul,
    readTime: `${entry.read_minutes || 5} menit baca`,
    image: entry.gambar_url || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop',
  }))

  return (
    <main className="mental-detail-page">
      <div className="mental-detail-container">
        <div className="mental-detail-layout">
          <section className="mental-detail-main">
            <div className="mental-detail-breadcrumb">
              <Link to="/beranda">Beranda</Link>
              <span>›</span>
              <Link to="/mental-health">Mental Orang Tua</Link>
              <span>›</span>
              <span className="active">{item.title}</span>
            </div>

            <span className="mental-detail-category">{item.category}</span>
            <h1>{item.title}</h1>
            <img src={item.image} alt={item.title} className="mental-detail-hero" />

            <blockquote>{item.quote}</blockquote>

            <section className="mental-detail-section">
              <h2>Ringkasan</h2>
              <p>{item.intro}</p>
            </section>

            <div className="mental-detail-grid">
              <section className="mental-detail-card">
                <h3>Tanda yang Perlu Diperhatikan</h3>
                <ul>
                  {item.signs.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </section>

              <section className="mental-detail-card">
                <h3>Langkah yang Bisa Dilakukan</h3>
                <ul>
                  {item.actions.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="mental-detail-alert">
              <h3>Kapan Perlu Bantuan Profesional?</h3>
              <ul>
                {item.consultWhen.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </section>
          </section>

          <aside className="mental-detail-sidebar">
            <h3>Konten Lainnya</h3>
            <div className="mental-detail-related-list">
              {related.map((entry) => (
                <Link key={entry.slug} to={`/mental-health/${entry.slug}`} className="mental-detail-related-item">
                  <img src={entry.image} alt={entry.title} />
                  <div>
                    <span>{entry.category}</span>
                    <h4>{entry.title}</h4>
                    <p>{entry.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
