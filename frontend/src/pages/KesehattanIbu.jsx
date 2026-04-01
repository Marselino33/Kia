import { useState } from 'react'
import AdminBar from '../components/AdminBar'
import { Link } from 'react-router-dom'
import { Heart, Users, Phone, Mail } from 'lucide-react'

const RECOVERY_GUIDES = [
    {
        id: 1,
        icon: '😢',
        title: 'Mengelola Baby Blues',
        description: 'Memahami gejala dan cara mengatasi perasaan sedih setelah melahirkan. Langkah-langkah praktis untuk pemulihan emosional Anda.',
        link: '/kesehatan-ibu/baby-blues'
    },
    {
        id: 2,
        icon: '⏰',
        title: 'Pentingnya Me-Time',
        description: 'Mengalokasikan waktu untuk diri sendiri sangat penting bagi kesehatan mental. Tips sederhana untuk self-care rutin.',
        link: '/kesehatan-ibu/me-time'
    },
    {
        id: 3,
        icon: '👥',
        title: 'Membangun Support System',
        description: 'Cara membangun sistem dukungan keluarga dan komunitas untuk menjalani motherhood dengan lebih tenang dan bahagia.',
        link: '/kesehatan-ibu/support-system'
    }
]

const DAILY_TIPS = [
    {
        icon: '❤️',
        title: 'Self-Love',
        description: 'Luangkan waktu untuk mencintai dan menghargai diri sendiri setiap hari.'
    },
    {
        icon: '🧘',
        title: 'Mindfulness',
        description: 'Praktik meditasi sederhana untuk menenangkan pikiran dan mengurangi stres.'
    },
    {
        icon: '🎯',
        title: 'Parentalitas',
        description: 'Strategi praktis untuk menjadi ibu yang lebih tenang dan sabar.'
    },
    {
        icon: '☀️',
        title: 'Self-Care',
        description: 'Rutinitas perawatan diri yang sederhana namun efektif untuk kesejahteraan Anda.'
    }
]

const REFLECTION_QUIZ = [
    {
        question: 'Seberapa sering Anda merasa merasa tenang menghadapi tantangan parenting anak Anda?',
        options: [
            'Selalu',
            'Sering',
            'Kadang-kadang',
            'Jarang'
        ]
    }
]

export default function KesehattanIbu() {
    const [selectedAnswer, setSelectedAnswer] = useState(null)

    return (
        <div style={{ paddingTop: 80, minHeight: '100vh', background: '#fdf8f9' }}>
            <AdminBar label="Tambah Konten Parenting" onClick={() => { }} />
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #fce7f3 0%, #e0f2fe 100%)',
                padding: '3rem 1.5rem'
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f472b6', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            🧘 SELF-CARE PRIORITY
                        </div>
                        <h1 style={{
                            fontSize: '2.5rem', fontWeight: 900, color: '#1f2937', marginBottom: '1rem', lineHeight: 1.2
                        }}>
                            Kesehatan Mental<br /><span style={{ color: '#f472b6' }}>Orang Tua</span>
                        </h1>
                        <p style={{
                            fontSize: '1.1rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.7
                        }}>
                            Menjaga kesehatan emosional Anda adalah kunci untuk memberikan buah hati dengan penuh kehangatan, cinta dan kasih sayang. Luangkan waktu untuk merawat diri sendiri.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button style={{
                                background: '#ea580c', color: '#fff', border: 'none',
                                padding: '0.9rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700,
                                cursor: 'pointer', fontSize: '0.95rem'
                            }}>
                                Mulai Belajar Self-Care →
                            </button>
                            <button style={{
                                background: '#fff', color: '#ea580c', border: '2px solid #ea580c',
                                padding: '0.8rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700,
                                cursor: 'pointer', fontSize: '0.95rem'
                            }}>
                                Eksplorasi Topik
                            </button>
                        </div>
                    </div>
                    <div style={{
                        background: '#f0fdf4', borderRadius: '1.5rem', padding: '2rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300
                    }}>
                        <div style={{ fontSize: '4rem' }}>🧘‍♀️</div>
                    </div>
                </div>
            </div>

            {/* Recovery Guides Section */}
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 1.5rem' }}>
                <h2 style={{
                    fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1f2937'
                }}>
                    Panduan Pemulihan Emosional Ibu
                </h2>
                <p style={{
                    fontSize: '1rem', color: '#6b7280', marginBottom: '2rem'
                }}>
                    Langkah-langkah praktis untuk mengelola kesehatan mental pascamelahirkan dan membangun resiliensi.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
                    {RECOVERY_GUIDES.map(guide => (
                        <Link
                            key={guide.id}
                            to={guide.link}
                            style={{ textDecoration: 'none' }}
                        >
                            <div style={{
                                background: '#fff', padding: '2rem', borderRadius: '1.5rem',
                                border: '1px solid #f3f4f6', cursor: 'pointer', transition: 'all 0.3s',
                                height: '100%'
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'
                                    e.currentTarget.style.transform = 'translateY(-4px)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.boxShadow = ''
                                    e.currentTarget.style.transform = 'none'
                                }}
                            >
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{guide.icon}</div>
                                <h3 style={{
                                    fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem', color: '#1f2937'
                                }}>
                                    {guide.title}
                                </h3>
                                <p style={{
                                    fontSize: '0.95rem', color: '#6b7280', lineHeight: 1.6, margin: 0
                                }}>
                                    {guide.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quiz Section */}
            <div style={{
                background: 'linear-gradient(135deg, #fce7f3 0%, #fff0f6 100%)',
                padding: '3rem 1.5rem', marginBottom: '4rem'
            }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f472b6', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        🧠 SELF-REFLECTION
                    </div>
                    <h2 stnyle={{
                        fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem', color: '#1f2937'
                    }}>
                        Self Check: Refleksi Kesehatan Mental Orang Tua
                    </h2>
                    <p style={{
                        fontSize: '1rem', color: '#6b7280', marginBottom: '2rem', lineHeight: 1.7
                    }}>
                        Pahami lebih dalam kondisi emosional Anda dan bagaimana interaksi dengan si kecil. Refleksi kuis adalah langkah awal pengasuhan yang lebih tenang.
                    </p>

                    <div style={{
                        background: '#fff', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #f3f4f6'
                    }}>
                        <h3 style={{
                            fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1f2937'
                        }}>
                            {REFLECTION_QUIZ[0].question}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            {REFLECTION_QUIZ[0].options.map((option, idx) => (
                                <label
                                    key={idx}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        padding: '1rem', borderRadius: '0.75rem',
                                        background: selectedAnswer === idx ? '#fce7f3' : '#f9fafb',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                        border: selectedAnswer === idx ? '2px solid #f472b6' : '2px solid #e5e7eb'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="answer"
                                        checked={selectedAnswer === idx}
                                        onChange={() => setSelectedAnswer(idx)}
                                        style={{
                                            accentColor: '#f472b6', cursor: 'pointer', width: 20, height: 20
                                        }}
                                    />
                                    <span style={{ color: '#4b5563', fontWeight: 500 }}>{option}</span>
                                </label>
                            ))}
                        </div>
                        <button style={{
                            width: '100%', marginTop: '1.5rem', background: '#f472b6', color: '#fff',
                            border: 'none', padding: '1rem', borderRadius: '0.75rem', fontWeight: 700,
                            cursor: 'pointer', fontSize: '1rem', transition: 'all 0.2s'
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = '#E8307D'}
                            onMouseLeave={e => e.currentTarget.style.background = '#f472b6'}
                        >
                            Mulai →
                        </button>
                    </div>
                </div>
            </div>

            {/* Daily Tips Section */}
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 1.5rem' }}>
                <h2 style={{
                    fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1f2937'
                }}>
                    Tips Harian untuk Ibu Bahagia
                </h2>
                <p style={{
                    fontSize: '1rem', color: '#6b7280', marginBottom: '2rem'
                }}>
                    Kebahagiaan Anda adalah hadiah terbaik untuk keluarga.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
                    {DAILY_TIPS.map((tip, idx) => (
                        <div
                            key={idx}
                            style={{
                                background: '#fff', padding: '2rem', borderRadius: '1.5rem',
                                border: '1px solid #f3f4f6', transition: 'all 0.3s'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.boxShadow = ''
                            }}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{tip.icon}</div>
                            <h3 style={{
                                fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', color: '#1f2937'
                            }}>
                                {tip.title}
                            </h3>
                            <p style={{
                                fontSize: '0.95rem', color: '#6b7280', lineHeight: 1.6, margin: 0
                            }}>
                                {tip.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Support Section */}
            <div style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                padding: '3rem 1.5rem', borderRadius: '1.5rem', marginBottom: '4rem',
                maxWidth: 1200, margin: '0 auto 4rem'
            }}>
                <div style={{ textAlign: 'center', color: '#fff' }}>
                    <h2 style={{
                        fontSize: '1.8rem', fontWeight: 900, marginBottom: '1rem'
                    }}>
                        Butuh teman bicara?
                    </h2>
                    <p style={{
                        fontSize: '1rem', marginBottom: '2rem', opacity: 0.95, lineHeight: 1.7
                    }}>
                        Konselor dan psikolog kami siap membantu Anda. Layanan konsultasi KIA Pintar tersedia 24/7 melalui chat rahasia dan aman.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button style={{
                            background: '#fff', color: '#06b6d4', border: 'none',
                            padding: '0.85rem 2rem', borderRadius: '0.75rem', fontWeight: 700,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}>
                            <Mail size={18} /> Tanya Pakar Sekuritas
                        </button>
                        <button style={{
                            background: 'transparent', color: '#fff', border: '2px solid #fff',
                            padding: '0.8rem 2rem', borderRadius: '0.75rem', fontWeight: 700,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}>
                            <Phone size={18} /> Telekonsulatsi Video
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
