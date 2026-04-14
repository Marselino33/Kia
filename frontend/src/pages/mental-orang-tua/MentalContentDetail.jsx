import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getMentalContentBySlug, mentalContents } from './mentalContentData'
import '../../styles/pages/mental-health-detail.css'

export default function MentalContentDetail() {
  const { slug } = useParams()
  const item = getMentalContentBySlug(slug)

  useEffect(() => {
    if (!item) return
    try {
      localStorage.setItem('lastMentalContentSlug', item.slug)
    } catch {
      // Ignore storage errors in restricted environments.
    }
  }, [item])

  if (!item) return <Navigate to="/mental-health" replace />

  const related = mentalContents.filter((entry) => entry.slug !== item.slug)

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
