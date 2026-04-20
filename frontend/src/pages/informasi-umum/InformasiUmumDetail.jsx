import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getInformasiUmumBySlug, informasiUmumItems } from './informasiUmumData'
import '../../styles/pages/informasi-umum-detail.css'

export default function InformasiUmumDetail() {
  const { slug } = useParams()

  const item = useMemo(() => getInformasiUmumBySlug(slug), [slug])

  if (!item) return <Navigate to="/informasi-umum" replace />

  const related = informasiUmumItems.filter((entry) => entry.slug !== item.slug).slice(0, 4)

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
              <span className="active">{item.title}</span>
            </div>

            <h1>{item.title}</h1>
            <img src={item.image} alt={item.title} className="informasi-umum-detail-hero" />

            <blockquote>{item.quote}</blockquote>

            <section className="informasi-umum-detail-section">
              <h2>Ringkasan</h2>
              <p>{item.intro}</p>
            </section>

            <section className="informasi-umum-detail-section">
              <h2>Langkah Praktis di Rumah</h2>
              <ul>
                {item.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </section>

            <div className="informasi-umum-detail-panels">
              <section className="informasi-umum-detail-panel">
                <h3>Checklist Harian</h3>
                <ul>
                  {item.checklist.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>

              <section className="informasi-umum-detail-panel">
                <h3>Kapan Perlu Konsultasi?</h3>
                <ul>
                  {item.consultWhen.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
            </div>
          </section>

          <aside className="informasi-umum-detail-sidebar">
            <h3>Topik Lainnya</h3>
            <div className="informasi-umum-related-list">
              {related.map((entry) => (
                <Link key={entry.slug} to={`/informasi-umum/${entry.slug}`} className="informasi-umum-related-item">
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
