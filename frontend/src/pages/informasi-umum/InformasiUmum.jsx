import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { contentService } from '../../api/contentService'
import '../../styles/pages/informasi-umum.css'

export default function InformasiUmum() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        setLoading(true)
        const data = await contentService.getInformasiUmum()
        if (!active) return
        setItems(Array.isArray(data) ? data : [])
      } catch {
        if (!active) return
        setItems([])
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const mappedItems = useMemo(
    () =>
      items.map((item) => ({
        slug: item.slug,
        title: item.judul || 'Tanpa Judul',
        category: item.kategori || 'Informasi Umum',
        excerpt: item.ringkasan || 'Ringkasan belum tersedia.',
        image:
          item.gambar_url ||
          'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=800&h=500&fit=crop',
        readTime: `${item.read_minutes || 5} menit baca`,
      })),
    [items]
  )

  return (
    <main className="informasi-umum-page">
      <div className="informasi-umum-container">
        <div className="informasi-umum-breadcrumb">
          <Link to="/beranda" className="informasi-umum-breadcrumb-link">Beranda</Link>
          <span>›</span>
          <span className="active">Informasi Umum</span>
        </div>

        <header className="informasi-umum-head">
          <h1>Informasi Umum</h1>
          <p>Kumpulan informasi penting untuk mendukung kesehatan, keamanan, dan tumbuh kembang anak di rumah.</p>
        </header>

        <section className="informasi-umum-grid">
          {loading ? (
            <p>Memuat artikel...</p>
          ) : mappedItems.length === 0 ? (
            <p>Belum ada artikel informasi umum.</p>
          ) : (
            mappedItems.map((item) => (
              <article key={item.slug} className="informasi-umum-card">
                <img src={item.image} alt={item.title} className="informasi-umum-card-image" />
                <div className="informasi-umum-card-content">
                  <span className="informasi-umum-category">{item.category}</span>
                  <h2>{item.title}</h2>
                  <p>{item.excerpt}</p>
                  <div className="informasi-umum-card-footer">
                    <span>{item.readTime}</span>
                    <Link to={`/informasi-umum/${item.slug}`} className="informasi-umum-read-link">Lihat Detail</Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  )
}
