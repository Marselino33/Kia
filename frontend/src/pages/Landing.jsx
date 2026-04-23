import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Droplets,
  Users,
  Smile,
  AlertCircle,
  BookOpen,
  Brain,
  Activity,
  PlayCircle,
  Music
} from 'lucide-react'
import '../styles/pages/landing.css'

export default function Landing() {

  const menuCategories = [
    { icon: Music, label: 'Stimuli Anak', link: '/stimulus' },
    { icon: Users, label: 'Pola Asuh', link: '/pola-asuh' },
    { icon: BookOpen, label: 'Kuis Pemahaman', link: '/kuis-parenting' },
      { icon: BookOpen, label: 'Kuis Parenting', link: '/parenting-kuis' },
    { icon: Activity, label: 'Gizi Ibu', link: '/gizi-ibu-trimester1' },
    { icon: Droplets, label: 'Gizi Anak', link: '/gizi-anak' },
    { icon: Smile, label: 'Resep MPASI', link: '/resep-mpasi' },
    { icon: Brain, label: 'Kesehatan Mental', link: '/mental-health' },
    { icon: AlertCircle, label: 'Self-Check Stres', link: '/mental-health-check' }
  ]

  const recipes = [
    {
      title: "Bubur MPASI Bayi 9 Bulan",
      stage: "6-9 Bulan",
      time: "15 Menit",
      tag: "Populer",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "Snack Bayi",
      stage: "9-12 Bulan",
      time: "30 Menit",
      tag: "Premium",
      image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd0a54d?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "Puree Alpukat Telur",
      stage: "8 Bulan",
      time: "10 Menit",
      tag: "Favorit",
      image: "https://images.unsplash.com/photo-1585521537019-3346a1be7dee?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "Sup Bayi Ayam & Sayur",
      stage: "12+ Bulan",
      time: "20 Menit",
      tag: "Sehat",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"
    }
  ]

  const parentingHighlights = [
    {
      title: "Stimulasi Motorik Kasar Bayi 0-6 Bulan",
      category: "Video",
      image: "https://images.unsplash.com/photo-1503454537688-e47a98d86367?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "Membangun Minat Baca Sejak Dini",
      category: "Artikel",
      image: "https://images.unsplash.com/photo-1516534775068-bb57846d985b?auto=format&fit=crop&q=80&w=400"
    }
  ]

  return (
    <div className="landing-page">

      {/* HERO */}
      <section className="landing-hero">
        <div className="landing-hero-overlay">
          <div className="container">
            <div className="landing-hero-content">
              <div className="landing-hero-pill">NUTRISI & GIZI</div>

              <h1 className="landing-hero-title">
                Ide Resep MPASI <br />
                <span className="accent">Bergizi Bulan Ini</span>
              </h1>

              <p className="landing-hero-desc">
                Penuhi kebutuhan nutrisi 1000 hari pertama kehidupan si kecil
                dengan menu yang lezat dan mudah dibuat.
              </p>

              <Link to="/resep-mpasi" className="landing-hero-btn">
                Lihat Resep <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section className="landing-menu-section">
        <div className="container">
          <div className="landing-menu-grid">
            {menuCategories.map((cat, idx) => {
              const Icon = cat.icon
              return (
                <Link to={cat.link} key={idx} className="landing-menu-item">
                  <div className="landing-menu-icon-wrap">
                    <Icon size={28} color="#3b82f6" />
                  </div>
                  <p>{cat.label}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* GIZI */}
      <section className="landing-section gray">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Sorotan Gizi</h2>
              <p>Inspirasi menu MPASI sehat setiap hari</p>
            </div>
            <Link to="/resep-mpasi">Lihat Semua →</Link>
          </div>

          <div className="card-grid">
            {recipes.map((r, i) => (
              <div key={i} className="card">
                <div className="card-image">
                  <img src={r.image} alt={r.title} />
                  <span className="badge right">{r.stage}</span>
                </div>

                <div className="card-body">
                  <h3>{r.title}</h3>

                  <div className="meta">
                    <span>⏱ {r.time}</span>
                    <span>{r.tag}</span>
                  </div>

                  <Link to="/resep-mpasi">Lihat Resep →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARENTING */}
      <section className="landing-section">
        <div className="container">
          <div className="section-head">
            <h2>Sorotan Parenting</h2>
            <Link to="/konten">Lihat Lainnya →</Link>
          </div>

          <div className="parent-grid">
            {parentingHighlights.map((p, i) => (
              <div key={i} className="card">
                <div className="parent-img">
                  <img src={p.image} alt={p.title} />
                  <span className="badge left">{p.category}</span>

                  <div className="overlay"></div>

                  <div className="play">
                    <PlayCircle size={30} />
                  </div>
                </div>

                <div className="card-body">
                  <h3>{p.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}