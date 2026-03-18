import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function Footer() {
    return (
        <footer style={{
            background: '#fdf8f9',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            padding: '4rem 0 1.5rem',
            color: '#4b5563',
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '2.5rem',
                    marginBottom: '3rem',
                }}>
                    {/* Column 1: Tentang Kami */}
                    <div>
                        <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '1rem', color: '#1f2937' }}>Tentang Kami</h4>
                        <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                            Berdedikasi untuk memberdayakan orang tua dengan pengetahuan ahli dan dukungan praktis untuk kesehatan ibu dan anak.
                        </p>
                    </div>

                    {/* Column 2: Sumber Daya */}
                    <div>
                        <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '1rem', color: '#1f2937' }}>Sumber Daya</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <Link to="#" style={{ color: '#6b7280', fontSize: '0.85rem' }}>Artikel Kami</Link>
                            <Link to="/konten" style={{ color: '#6b7280', fontSize: '0.85rem' }}>Alat Kami</Link>
                            <Link to="#" style={{ color: '#6b7280', fontSize: '0.85rem' }}>Kebijakan Privasi</Link>
                            <Link to="#" style={{ color: '#6b7280', fontSize: '0.85rem' }}>Syarat & Ketentuan</Link>
                        </div>
                    </div>

                    {/* Column 3: Tabel Terhubung */}
                    <div>
                        <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '1rem', color: '#1f2937' }}>Tabel Terhubung</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <Link to="#" style={{ color: '#6b7280', fontSize: '0.85rem' }}>Pelajari Cepat</Link>
                            <Link to="#" style={{ color: '#6b7280', fontSize: '0.85rem' }}>Database Resep</Link>
                            <Link to="#" style={{ color: '#6b7280', fontSize: '0.85rem' }}>Dukungan Komunitas</Link>
                            <Link to="#" style={{ color: '#6b7280', fontSize: '0.85rem' }}>Akun Saya</Link>
                        </div>
                    </div>

                    {/* Column 4: Alirkan Email */}
                    <div>
                        <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '1rem', color: '#1f2937' }}>Alirkan Email</h4>
                        <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                            Dapatkan tips kesehatan ibu dan anak langsung ke inbox Anda.
                        </p>
                        <form style={{ display: 'flex', gap: '0.5rem' }} onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder="Alamat email"
                                style={{
                                    flex: 1,
                                    padding: '0.6rem 0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    fontSize: '0.85rem',
                                    outline: 'none'
                                }}
                            />
                            <button style={{
                                background: '#f472b6',
                                color: 'white',
                                border: 'none',
                                padding: '0.6rem 1rem',
                                borderRadius: '8px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>
                                →
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom divider and copyright */}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2rem', textAlign: 'center' }}>
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                        © 2024 Platform Edukasi KIA, Hak Cipta Dilindungi.
                    </p>
                </div>
            </div>

            <style>{`
            @media (max-width: 1024px) {
                footer .container > div:first-child { grid-template-columns: repeat(2, 1fr); }
            }
            @media (max-width: 640px) {
                footer .container > div:first-child { grid-template-columns: 1fr; }
            }
            `}</style>
        </footer>
    )
}
