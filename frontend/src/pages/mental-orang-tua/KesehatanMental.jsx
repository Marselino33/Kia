import { useEffect, useState } from 'react'
import { ChevronRight, AlertCircle, Pill, Smile, Users } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../lib/api'
import '../../styles/pages/mental-health.css'
import { mentalContents } from './mentalContentData'

export default function KesehatanMental() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [contentItems, setContentItems] = useState(mentalContents)

  const saveLastMentalSlug = (slug) => {
    const safeSlug = slug || 'baby-blues'
    try {
      localStorage.setItem('lastMentalContentSlug', safeSlug)
    } catch {
      // Ignore storage failures.
    }
  }

  const getMentalHref = (slug) => `/mental-health/${slug || 'baby-blues'}`

  const getLastMentalSlug = () => {
    const fallback = contentItems[0]?.slug || mentalContents[0]?.slug || 'baby-blues'
    try {
      const saved = localStorage.getItem('lastMentalContentSlug')
      if (!saved) return fallback
      const exists = contentItems.some((item) => item.slug === saved)
      return exists ? saved : fallback
    } catch {
      return fallback
    }
  }

  useEffect(() => {
    if (searchParams.get('mode') === 'self-check') {
      navigate('/mental-health-check', { replace: true })
    }
  }, [navigate, searchParams])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/mental-orang-tua')
        const rows = Array.isArray(res?.data?.data) ? res.data.data : []
        if (!rows.length) return
        setContentItems(rows.map((item) => ({
          slug: item.slug,
          title: item.judul,
          category: item.kategori || 'EDUKASI',
          readTime: `${item.read_minutes || 5} menit baca`,
          excerpt: item.ringkasan || item.isi || '',
          image: item.gambar_url || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop',
          quote: item.ringkasan || item.judul,
          intro: item.ringkasan || item.isi || '',
          signs: [item.ringkasan || item.judul],
          actions: ['Baca detail artikel'],
          consultWhen: ['Jika perlu dukungan profesional'],
        })))
      } catch {
        setContentItems(mentalContents)
      }
    }

    load()
  }, [])

  const mentalHealthConditions = [
    {
      id: 'baby-blues',
      title: 'Baby Blues',
      description: 'Baby blues adalah kondisi emosional ringan yang terjadi setelah melahirkan.',
      features: [
        'Suasana perasaan hilang masuk (mood swing)',
        'Mudah menangis tanpa alasan yang jelas',
        'Agak cemas mengenai bayi namun hal ini wajar',
        'Mudah cemas atau bingung untuk mengambil keputusan'
      ],
      background: '#E0F2FE',
      icon: '💙'
    },
    {
      id: 'ppd',
      title: 'Depresi Setelah Melahirkan (PPD)',
      description: 'Postpartum Depression adalah kondisi depresi serius yang memerlukan penanganan profesional.',
      features: [
        'Perasaan sedih, kosong, atau putus asa yang persisten',
        'Hilangnya minat atau kesenangan dalam aktivitas sehari-hari',
        'Gangguan tidur yang tidak terkait dengan jadwal bayi',
        'Perasaan tidak berharga atau bersalah yang intens'
      ],
      background: '#FEE2E2',
      icon: '❤️'
    }
  ]

  const preventionSteps = [
    {
      icon: '👥',
      title: 'Kontrol Diri Faktor Risiko',
      description: 'Identifikasi dan kelola faktor-faktor risiko seperti riwayat depresi atau stresor hidup yang signifikan.'
    },
    {
      icon: '🍽️',
      title: 'Makanan Sehat',
      description: 'Konsumsi makanan bergizi seimbang yang mendukung kesehatan mental dan fisik ibu yang sedang menyusui.'
    },
    {
      icon: '⚖️',
      title: 'Kontrol Diri Faktor Risiko',
      description: 'Perhatikan keseimbangan antara perawatan bayi, istirahat cukup, dan aktivitas yang menyenangkan.'
    },
    {
      icon: '💪',
      title: 'Dukungan Suami & Keluarga',
      description: 'Libatkan suami dan keluarga untuk memberikan dukungan emosional dan praktis dalam pengasuhan.'
    }
  ]

  const managementSteps = [
    {
      icon: <AlertCircle size={28} color="#06b6d4" />,
      title: 'Dengarkan Tubuh dan Emosi',
      description: 'Periksa diri sendiri atau self-assessment rutin untuk mendeteksi perubahan mood dan kesehatan mental.'
    },
    {
      icon: <Users size={28} color="#06b6d4" />,
      title: 'Berbagi Perasaan',
      description: 'Jangan ragu untuk membagi perasaan dan kekhawatiran dengan keluarga, teman, atau profesional kesehatan.'
    },
    {
      icon: <Pill size={28} color="#06b6d4" />,
      title: 'Konsultasi Dokter/Psikolog',
      description: 'Segera konsultasikan dengan dokter kandungan, dokter umum, atau psikolog jika mengalami gejala yang mengganggu.'
    },
    {
      icon: <Smile size={28} color="#06b6d4" />,
      title: 'Terapi Obat-obatan',
      description: 'Dokter dapat meresepkan obat-obatan yang aman untuk ibu menyusui guna mengatasi depresi postpartum.'
    }
  ]

  const supportResource = [
    {
      category: 'Bantuan Menggapai',
      icon: '🤝',
      description: 'Berbagi sarana fasilitas yang dapat membantu. Tunjukkan pada ibu bahwa ia tidak sendirian.'
    },
    {
      category: 'Membagi Perasaan',
      icon: '💬',
      description: 'Dengarkan dan beri dukungan ketika ibu ingin berbagi masalah periksanya. Ciptakan lingkungan yang aman.'
    },
    {
      category: 'Kunjungan Tenaga Kesehatan',
      icon: '👨‍⚕️',
      description: 'Manfaatkan layanan kesehatan profesional untuk monitoring kesehatan mental ibu secara berkala.'
    },
    {
      category: 'Merawat Malnutrisi',
      icon: '🍎',
      description: 'Pastikan ibu mendapat nutrisi yang cukup, tidur teratur, dan istirahat yang memadai.'
    },
    {
      category: 'Konseling Profesional',
      icon: '👥',
      description: 'Fasilitasi akses ke konseling atau terapi psikologis jika diperlukan untuk pemulihan yang lebih baik.'
    },
    {
      category: 'Terapi Obat-obatan',
      icon: '💊',
      description: 'Dukung ibu dalam mengikuti terapi farmakologi yang direkomendasikan oleh tenaga kesehatan profesional.'
    }
  ]

  return (
    <div className="mental-page">
      <section className="mental-section mental-hero">
        <div className="container mental-container">
          <div className="mental-breadcrumb">
            <Link to="/beranda">Beranda</Link>
            <span>›</span>
            <span className="active">Mental Orang Tua</span>
          </div>

          <div className="mental-hero-grid">
            <div>
              <div className="mental-pill">KESEHATAN MENTAL</div>
              <h1 className="mental-title">Memahami Depresi Setelah Melahirkan</h1>
              <p className="mental-subtitle">
                Panduan lengkap mengidentifikasi gejala baby blues dan postpartum depression,
                serta langkah penanganan untuk kesejahteraan ibu dan keluarga.
              </p>
              <a className="mental-primary-btn" href={getMentalHref(getLastMentalSlug())} onClick={() => saveLastMentalSlug(getLastMentalSlug())}>
                Mulai Membaca <ChevronRight size={18} />
              </a>
            </div>
            <div className="mental-hero-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop"
                alt="Mother and child"
                className="mental-hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Conditions Section */}
      <section className="mental-section mental-section-white">
        <div className="container mental-container">
          <div className="mental-section-head">
            <h2 className="mental-section-title">Mengenali Perbedaan Utama</h2>
            <p className="mental-section-caption">
              Penting untuk membedakan antara baby blues dan postpartum depression agar dapat ditangani dengan tepat.
            </p>
          </div>

          <div className="mental-grid-two">
            {mentalHealthConditions.map((condition) => {
              const targetSlug = condition.id === 'baby-blues' ? 'baby-blues' : 'postpartum-depression'
              return <a
                key={condition.id}
                className={`mental-condition-card ${condition.id === 'baby-blues' ? 'mental-condition-blue' : 'mental-condition-red'}`}
                href={getMentalHref(targetSlug)}
                onClick={() => saveLastMentalSlug(targetSlug)}
              >
                <h3 className="mental-condition-title">
                  <span className="mental-condition-emoji">{condition.icon}</span>
                  {condition.title}
                </h3>
                <p className="mental-condition-desc">{condition.description}</p>
                <ul className="mental-feature-list">
                  {condition.features.slice(0, 2).map((feature, idx) => (
                    <li key={idx} className="mental-feature-item">
                      <span className="mental-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </a>})}
          </div>
        </div>
      </section>

      <section className="mental-section mental-section-white">
        <div className="container mental-container">
          <div className="mental-section-head">
            <h2 className="mental-section-title">Konten Mental Orang Tua</h2>
            <p className="mental-section-caption">
              Pilih topik yang ingin Anda pelajari lebih dalam.
            </p>
          </div>

          <div className="mental-content-grid">
            {contentItems.map((item) => (
              <a
                key={item.slug}
                className="mental-content-card"
                href={getMentalHref(item.slug)}
                onClick={() => saveLastMentalSlug(item.slug)}
              >
                <img src={item.image} alt={item.title} className="mental-content-image" />
                <div className="mental-content-body">
                  <span className="mental-content-category">{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <div className="mental-content-footer">
                    <span>{item.readTime}</span>
                    <span className="mental-content-link">Baca Detail</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Management Strategies */}
      <section className="mental-section mental-section-primary">
        <div className="container mental-container">
          <h2 className="mental-section-title mental-section-title-light">Langkah Penanganan & Pemulihan</h2>

          <div className="mental-grid-two">
            {managementSteps.map((step, idx) => (
              <div key={idx} className="mental-management-card">
                <div className="mental-management-head">
                  <div className="mental-management-icon">{step.icon}</div>
                  <h3 className="mental-management-title">{step.title}</h3>
                </div>
                <p className="mental-management-desc">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prevention Steps */}
      <section className="mental-section mental-section-white">
        <div className="container mental-container">
          <h2 className="mental-section-title">Langkah Pencegahan Dini</h2>
          <p className="mental-section-caption">
            Lakukan tindakan pencegahan sejak dini untuk menjaga kesehatan mental selama dan setelah kehamilan.
          </p>

          <div className="mental-grid-two">
            {preventionSteps.map((step, idx) => (
              <div key={idx} className="mental-prevention-card">
                <div className="mental-prevention-icon">{step.icon}</div>
                <div>
                  <h3 className="mental-prevention-title">{step.title}</h3>
                  <p className="mental-prevention-desc">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Resources */}
      <section className="mental-section mental-section-muted">
        <div className="container mental-container">
          <h2 className="mental-section-title">Dukungan & Layanan untuk Ibu</h2>

          <div className="mental-grid-two-tight">
            {supportResource.map((resource, idx) => (
              <div key={idx} className="mental-support-card">
                <div className="mental-support-icon">{resource.icon}</div>
                <div>
                  <h4 className="mental-support-title">{resource.category}</h4>
                  <p className="mental-support-desc">{resource.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mental-section mental-cta">
        <div className="container mental-container mental-cta-wrap">
          <h2 className="mental-cta-title">Butuh Teman Bercerita?</h2>
          <p className="mental-cta-desc">
            Tim psikolog kami siap membantu dan mendengarkan cerita Anda. Jangan ragu untuk menghubungi kami.
          </p>
          <button className="mental-cta-btn" onClick={() => navigate('/mental-health-check')}>
            Mulai Self Check Stress
          </button>
        </div>
      </section>
    </div>
  )
}
