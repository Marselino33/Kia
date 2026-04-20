import { useState } from 'react'
import { Link } from 'react-router-dom'
import { informasiUmumItems } from './informasiUmumData'
import '../../styles/pages/informasi-umum.css'

export default function InformasiUmum() {
  const [items] = useState(informasiUmumItems)

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
          {items.map((item) => (
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
          ))}
        </section>
      </div>
    </main>
  )
}
