import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Droplets, Headphones, Stethoscope, Users, Smile, AlertCircle, BookOpen, Brain, Activity, PlayCircle, BarChart3, Music } from 'lucide-react'
import AdminBar from '../components/AdminBar'
import useAuthStore from '../store/authStore'
import '../styles/pages/landing.css'

export default function Landing() {
    const { user } = useAuthStore()

    const menuCategories = [
        { icon: Music, label: 'Stimuli Anak', link: '/stimulus' },
        { icon: Users, label: 'Pola Asuh', link: '/pola-asuh' },
        { icon: BookOpen, label: 'Kuis Pemahaman', link: '/kuis-parenting' },
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
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"
        },
        {
            title: "Snack Bayi",
            stage: "9-12 Bulan",
            image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd0a54d?auto=format&fit=crop&q=80&w=400"
        },
        {
            title: "Puree Alpukat Telur",
            stage: "8 Bulan",
            image: "https://images.unsplash.com/photo-1585521537019-3346a1be7dee?auto=format&fit=crop&q=80&w=400"
        },
        {
            title: "Sup Bayi Ayam & Sayur",
            stage: "12+ Bulan",
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
            <section className="landing-hero">
                <div className="container landing-hero-grid">
                    <div>
                        <div className="landing-hero-pill">NUTRISI & GIZI</div>
                        <h1 className="landing-hero-title">
                            Ide Resep MPASI<br />
                            <span className="landing-hero-title-accent">Bergizi Bulan Ini</span>
                        </h1>
                        <p className="landing-hero-desc">
                            Penuhi kebutuhan nutrisi 1000 hari pertama kehidupan si kecil dengan menu yang lezat dan mudah dibuat.
                        </p>
                        <div className="landing-hero-actions">
                            <Link to="/resep-mpasi" className="landing-hero-btn">
                                Lihat Resep <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>

                    <div className="landing-hero-image-wrap">
                        <img
                            src="https://images.unsplash.com/photo-1522903889177-3b2f98432e8e?auto=format&fit=crop&q=80&w=600"
                            alt="Ibu dan Anak"
                            className="landing-hero-image"
                        />
                    </div>
                </div>
            </section>

            <section className="landing-menu-section">
                <div className="container">
                    <div className="landing-menu-grid">
                        {menuCategories.map((cat, idx) => {
                            const Icon = cat.icon
                            const content = (
                                <div className="landing-menu-item">
                                    <div className="landing-menu-icon-wrap">
                                        <Icon size={36} color="#3b82f6" />
                                    </div>
                                    <p className="landing-menu-label">{cat.label}</p>
                                </div>
                            )
                            return cat.link ? <Link key={idx} to={cat.link}>{content}</Link> : <div key={idx}>{content}</div>
                        })}
                    </div>
                </div>
            </section>

            <section className="landing-spotlight-section landing-spotlight-gizi">
                <div className="container">
                    <div className="landing-section-head">
                        <div>
                            <h2 className="landing-section-title">Sorotan Gizi</h2>
                            <p className="landing-section-subtitle">Inspirasi menu MPASI sehat setiap hari</p>
                        </div>
                        <Link to="/resep-mpasi" className="landing-section-link">Lihat Semua →</Link>
                    </div>

                    <div className="landing-recipe-grid">
                        {recipes.map((recipe, idx) => (
                            <div key={idx} className="landing-card hover-shadow">
                                <div className="landing-card-image-wrap">
                                    <img src={recipe.image} alt={recipe.title} className="landing-card-image" />
                                    <div className="landing-card-badge right">{recipe.stage}</div>
                                </div>
                                <div className="landing-card-body">
                                    <h3 className="landing-card-title">{recipe.title}</h3>
                                    <Link to="/resep-mpasi" className="landing-card-link">Lihat Resep →</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="landing-spotlight-section">
                <div className="container">
                    <div className="landing-section-head">
                        <div>
                            <h2 className="landing-section-title">Sorotan Parenting</h2>
                        </div>
                        <Link to="/konten" className="landing-section-link">Lihat Lainnya →</Link>
                    </div>

                    <div className="landing-parenting-grid">
                        {parentingHighlights.map((item, idx) => (
                            <div key={idx} className="landing-card hover-shadow">
                                <div className="landing-parenting-image-wrap">
                                    <img src={item.image} alt={item.title} className="landing-card-image" />
                                    <div className="landing-card-badge left">{item.category}</div>
                                    <div className="landing-play-button">
                                        <PlayCircle size={32} color="#3b82f6" />
                                    </div>
                                </div>
                                <div className="landing-card-body">
                                    <h3 className="landing-parenting-title">{item.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
