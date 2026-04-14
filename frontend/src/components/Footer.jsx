import { Link } from 'react-router-dom'
import { Rss, Mail, Share2 } from 'lucide-react'

export default function Footer() {
    return (
        <footer style={{
            background: '#f3f4f6',
            borderTop: '1px solid #e5e7eb',
            padding: '3.5rem 0 2rem',
            color: '#64748b',
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
                    borderBottom: '1px solid #e2e8f0'
                }}>
                    <div>
                        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1rem', color: '#0f172a', textDecoration: 'none' }}>
                            <img
                                className="footer-brand-logo"
                                src="/logo-kia-cerdas.png"
                                alt="KIA Cerdas"
                                style={{ width: '78px', height: 'auto', objectFit: 'contain' }}
                            />
                        </Link>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.55, maxWidth: '320px' }}>
                            Mendukung setiap langkah orang tua dalam membersamai tumbuh kembang buah hati tercinta.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ fontWeight: 800, marginBottom: '1.2rem', fontSize: '1rem', color: '#0f172a' }}>Layanan</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                            <Link to="/konten" style={{ color: '#64748b', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#0284c7'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>E-Konsultasi</Link>
                            <Link to="/resep-mpasi" style={{ color: '#64748b', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#0284c7'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>E-Resep MPASI</Link>
                            <Link to="/tumbuh-kembang" style={{ color: '#64748b', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#0284c7'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Tracking Tumbuh Kembang</Link>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontWeight: 800, marginBottom: '1.2rem', fontSize: '1rem', color: '#0f172a' }}>Informasi</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                            <Link to="#" style={{ color: '#64748b', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#0284c7'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Tentang Kami</Link>
                            <Link to="#" style={{ color: '#64748b', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#0284c7'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Bantuan</Link>
                            <Link to="#" style={{ color: '#64748b', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#0284c7'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Kebijakan Privasi</Link>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontWeight: 800, marginBottom: '1.2rem', fontSize: '1rem', color: '#0f172a' }}>Ikuti Kami</h4>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a className="footer-social-icon" href="#" style={{
                                width: 62, height: 62, borderRadius: '50%',
                                background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s', cursor: 'pointer'
                            }} onMouseEnter={(e) => { e.currentTarget.style.background = '#bfdbfe'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#dbeafe'; }}>
                                <Rss size={27} color="#2563eb" />
                            </a>
                            <a className="footer-social-icon" href="#" style={{
                                width: 62, height: 62, borderRadius: '50%',
                                background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s', cursor: 'pointer'
                            }} onMouseEnter={(e) => { e.currentTarget.style.background = '#bfdbfe'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#dbeafe'; }}>
                                <Mail size={27} color="#2563eb" />
                            </a>
                            <a className="footer-social-icon" href="#" style={{
                                width: 62, height: 62, borderRadius: '50%',
                                background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s', cursor: 'pointer'
                            }} onMouseEnter={(e) => { e.currentTarget.style.background = '#bfdbfe'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#dbeafe'; }}>
                                <Share2 size={27} color="#2563eb" />
                            </a>
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
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
