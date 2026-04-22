import { Link } from 'react-router-dom'
import { Rss, Mail, Share2 } from 'lucide-react'

export default function Footer() {
    return (
        <footer style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            padding: '3.5rem 0 2rem',
            color: 'var(--text-secondary)',
        }}>
            <div className="container">
                {/* Top Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
                    gap: '2.5rem',
                    alignItems: 'flex-start',
                    marginBottom: '2.5rem',
                    paddingBottom: '2.5rem',
                    borderBottom: '1px solid var(--border-color)'
                }}>
                    <div>
                        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
                            <img
                                className="footer-brand-logo"
                                src="/logo-kia-cerdas.png"
                                alt="KIA Cerdas"
                                style={{ width: '78px', height: 'auto', objectFit: 'contain' }}
                            />
                        </Link>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.55, maxWidth: '320px' }}>
                            Mendukung setiap langkah orang tua dalam membersamai tumbuh kembang buah hati tercinta.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ fontWeight: 800, marginBottom: '1.2rem', fontSize: '1rem', color: 'var(--text-primary)' }}>Layanan</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                            <Link to="/konten" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary-500)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>E-Konsultasi</Link>
                            <Link to="/resep-mpasi" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary-500)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>E-Resep MPASI</Link>
                            <Link to="/tumbuh-kembang" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary-500)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Tracking Tumbuh Kembang</Link>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontWeight: 800, marginBottom: '1.2rem', fontSize: '1rem', color: 'var(--text-primary)' }}>Informasi</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                            <Link to="#" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary-500)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Tentang Kami</Link>
                            <Link to="#" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary-500)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Bantuan</Link>
                            <Link to="#" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary-500)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Kebijakan Privasi</Link>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontWeight: 800, marginBottom: '1.2rem', fontSize: '1rem', color: '#0f172a' }}>Ikuti Kami</h4>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a className="footer-social-icon" href="#" style={{
                                width: 48, height: 48, borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s', cursor: 'pointer'
                            }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-100)'; e.currentTarget.style.borderColor = 'var(--primary-200)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}>
                                <Rss size={20} color="var(--primary-500)" />
                            </a>
                            <a className="footer-social-icon" href="#" style={{
                                width: 48, height: 48, borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s', cursor: 'pointer'
                            }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-100)'; e.currentTarget.style.borderColor = 'var(--primary-200)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}>
                                <Mail size={20} color="var(--primary-500)" />
                            </a>
                            <a className="footer-social-icon" href="#" style={{
                                width: 48, height: 48, borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s', cursor: 'pointer'
                            }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-100)'; e.currentTarget.style.borderColor = 'var(--primary-200)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}>
                                <Share2 size={20} color="var(--primary-500)" />
                            </a>
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        © 2024 KIA Sehat. All rights reserved.
                    </p>
                </div>
            </div>

            <style>{`
            @media (max-width: 1024px) {
                footer .container > div:first-child {
                    grid-template-columns: 1fr 1fr;
                }
                .footer-brand-logo { width: 70px !important; }
            }
            @media (max-width: 640px) {
                footer .container > div:first-child {
                    grid-template-columns: 1fr;
                    gap: 2rem;
                }
                .footer-brand-logo { width: 64px !important; }
                .footer-social-icon {
                    width: 50px !important;
                    height: 50px !important;
                }
            }
            `}</style>
        </footer>
    )
}
