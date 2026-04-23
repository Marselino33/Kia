import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { contentService } from '../../api/contentService'
import '../../styles/pages/informasi-umum-detail.css'

function hasHtmlContent(text) {
  return /<[^>]+>/.test(text || '')
}

function normalizePlainArticle(text) {
  return (text || '')
    .replace(/\r\n/g, '\n')
    .replace(/\s*•\s*/g, '\n• ')
    .replace(/\s+(\d+)\.\s+/g, '\n$1. ')
    .trim()
}

function renderPlainArticle(text) {
  const lines = normalizePlainArticle(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const blocks = []
  let pendingList = null

  const flushList = () => {
    if (!pendingList) return
    blocks.push({ ...pendingList })
    pendingList = null
  }

  for (const line of lines) {
    const bullet = line.match(/^•\s+(.+)/)
    if (bullet) {
      if (!pendingList || pendingList.type !== 'ul') {
        flushList()
        pendingList = { type: 'ul', items: [] }
      }
      pendingList.items.push(bullet[1])
      continue
    }

    const ordered = line.match(/^\d+\.\s+(.+)/)
    if (ordered) {
      if (!pendingList || pendingList.type !== 'ol') {
        flushList()
        pendingList = { type: 'ol', items: [] }
      }
      pendingList.items.push(ordered[1])
      continue
    }

    flushList()
    blocks.push({ type: 'p', text: line })
  }

  flushList()

  return (
    <div className="informasi-umum-article-body">
      {blocks.map((block, index) => {
        if (block.type === 'p') {
          return <p key={`p-${index}`}>{block.text}</p>
        }
        if (block.type === 'ul') {
          return (
            <ul key={`ul-${index}`}>
              {block.items.map((item, i) => (
                <li key={`ul-${index}-${i}`}>{item}</li>
              ))}
            </ul>
          )
        }
        return (
          <ol key={`ol-${index}`}>
            {block.items.map((item, i) => (
              <li key={`ol-${index}-${i}`}>{item}</li>
            ))}
          </ol>
        )
      })}
    </div>
  )
}

export default function InformasiUmumDetail() {
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [relatedItems, setRelatedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        setLoading(true)
        setNotFound(false)

        const [detail, list] = await Promise.all([
          contentService.getInformasiUmumBySlug(slug),
          contentService.getInformasiUmum(),
        ])

        if (!active) return

        if (!detail || !detail.slug) {
          setNotFound(true)
          setItem(null)
          setRelatedItems([])
          return
        }

        setItem(detail)
        const related = Array.isArray(list)
          ? list.filter((entry) => entry.slug !== detail.slug).slice(0, 4)
          : []
        setRelatedItems(related)
      } catch {
        if (!active) return
        setNotFound(true)
        setItem(null)
        setRelatedItems([])
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [slug])

  const related = useMemo(
    () =>
      relatedItems.map((entry) => ({
        slug: entry.slug,
        title: entry.judul || 'Tanpa Judul',
        category: entry.kategori || 'Informasi Umum',
        readTime: `${entry.read_minutes || 5} menit baca`,
        image:
          entry.gambar_url ||
          'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=500&h=320&fit=crop',
      })),
    [relatedItems]
  )

  if (loading) {
    return (
      <main className="informasi-umum-detail-page">
        <div className="informasi-umum-detail-container">
          <p>Memuat detail artikel...</p>
        </div>
      </main>
    )
  }

  if (notFound || !item) return <Navigate to="/informasi-umum" replace />

  return (
    <main className="informasi-umum-detail-page">
      <div className="informasi-umum-detail-container">
        <div className="informasi-umum-detail-layout">
          <section className="informasi-umum-detail-main">

            <div className="informasi-umum-detail-breadcrumb">
              <Link to="/beranda">Beranda</Link>
              <span>›</span>
              <Link to="/informasi-umum">Informasi Umum</Link>
              <span>›</span>
              <span className="active">{item.judul}</span>
            </div>

            <h1>{item.judul}</h1>

            <img
              src={
                item.gambar_url ||
                'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=1200&h=600&fit=crop'
              }
              alt={item.judul}
              className="informasi-umum-detail-hero"
            />

            {/* ✅ ISI ARTIKEL */}
            <section className="informasi-umum-detail-section">
              <h2>Isi Artikel</h2>
              {!item.isi ? (
                <div className="informasi-umum-article-body">
                  <p>Konten belum tersedia.</p>
                </div>
              ) : hasHtmlContent(item.isi) ? (
                <div
                  className="informasi-umum-article-body"
                  dangerouslySetInnerHTML={{ __html: item.isi }}
                />
              ) : (
                renderPlainArticle(item.isi)
              )}
            </section>

            {/* ✅ RINGKASAN */}
            <section className="informasi-umum-detail-section">
              <h2>Ringkasan</h2>
              <p>{item.ringkasan || 'Ringkasan belum tersedia.'}</p>
            </section>

            {/* ✅ CARD TAMBAHAN (PAKAI CSS LAMA) */}
            {(item.checklist || item.consultWhen) && (
              <div className="informasi-umum-detail-panels">

                {item.checklist && (
                  <div className="informasi-umum-detail-panel">
                    <h3>Checklist Harian</h3>
                    <ul>
                      {item.checklist.map((list, i) => (
                        <li key={i}>{list}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.consultWhen && (
                  <div className="informasi-umum-detail-panel">
                    <h3>Kapan Perlu Konsultasi?</h3>
                    <ul>
                      {item.consultWhen.map((list, i) => (
                        <li key={i}>{list}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            )}

          </section>

          <aside className="informasi-umum-detail-sidebar">
            <h3>Topik Lainnya</h3>
            <div className="informasi-umum-related-list">
              {related.map((entry) => (
                <Link
                  key={entry.slug}
                  to={`/informasi-umum/${entry.slug}`}
                  className="informasi-umum-related-item"
                >
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