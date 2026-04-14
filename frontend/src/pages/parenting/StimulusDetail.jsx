import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Play, ArrowLeft, ChevronRight, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';
import '../../styles/pages/parenting-stimulus-detail.css';

const activities = {
  1: {
    id: 1,
    category: 'SENSORIK',
    categoryClass: 'sensorik',
    title: 'Stimulus Motorik Kasar: Merangkak & Meraih Mainan',
    subtitle: 'Sesuai untuk usia 6-9 bulan - Fokus: Kekuatan Otot & Koordinasi',
    image: 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=1200&h=720&fit=crop',
    heroLabel: '6-9 BULAN',
    summary: 'Aktivitas ini membantu bayi memperkuat otot leher, bahu, lengan, dan koordinasi tubuh melalui permainan sederhana yang aman dan menyenangkan.',
    instructions: [
      'Perluas area bermain dengan alas yang datar dan bersih.',
      'Pancing dengan mainan berwarna cerah yang diletakkan sedikit di luar jangkauan tangan.',
      'Berikan dukungan verbal atau tepukan saat si kecil mulai bergerak maju.',
      'Apresiasi keberhasilan kecil agar bayi terdorong mencoba lagi.'
    ],
    equipment: [
      'Mainan berbunyi',
      'Matras lembut',
      'Kamera rekam'
    ],
    benefits: [
      'Menguatkan otot inti dan lengan',
      'Melatih koordinasi mata-tangan',
      'Mendorong rasa ingin tahu bayi'
    ],
    tips: [
      'Gunakan pengawasan penuh selama stimulasi.',
      'Hentikan bila bayi terlihat lelah atau rewel.',
      'Pilih waktu bayi sedang segar dan kenyang.'
    ],
  },
  2: {
    id: 2,
    category: 'SENSORIK',
    categoryClass: 'sensorik',
    title: 'Mengenal Tekstur dengan Benda Sekitar',
    subtitle: 'Usia 12-18 bulan - Fokus: Sensorik & Eksplorasi',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&h=720&fit=crop',
    heroLabel: '12-18 BULAN',
    summary: 'Permainan ini melatih anak mengenal perbedaan tekstur melalui benda aman di rumah. Cocok untuk menstimulasi rasa ingin tahu dan bahasa.',
    instructions: [
      'Siapkan 3-4 benda dengan tekstur berbeda.',
      'Ajak anak menyentuh, menunjuk, dan menyebutkan rasa benda.',
      'Dampingi tanpa memaksa dan beri pujian.',
      'Ulangi dengan kata sederhana agar kosakata berkembang.'
    ],
    equipment: ['Kotak sensory', 'Kain lembut', 'Bola kecil'],
    benefits: ['Stimulasi sensorik', 'Pengayaan kosakata', 'Fokus perhatian'],
    tips: ['Pastikan semua benda aman ditelan.', 'Cuci tangan sebelum dan sesudah bermain.', 'Jaga durasi tetap singkat dan menyenangkan.'],
  },
  3: {
    id: 3,
    category: 'BAHASA',
    categoryClass: 'bahasa',
    title: 'Bercerita dengan Boneka Tangan',
    subtitle: 'Usia 2-3 tahun - Fokus: Bahasa & Interaksi',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&h=720&fit=crop',
    heroLabel: '2-3 TAHUN',
    summary: 'Bercerita dengan boneka membantu anak meniru suara, mengenali emosi, dan melatih kemampuan bahasa secara alami.',
    instructions: [
      'Gunakan boneka dengan ekspresi yang jelas.',
      'Buat dialog pendek yang mudah diikuti.',
      'Ajak anak menjawab pertanyaan sederhana.',
      'Ulangi cerita favorit untuk memperkuat memori.'
    ],
    equipment: ['Boneka tangan', 'Buku cerita', 'Panggung kecil'],
    benefits: ['Bahasa ekspresif', 'Imaginasi', 'Kepercayaan diri'],
    tips: ['Berikan jeda saat anak ingin menyela.', 'Gunakan suara yang berbeda agar menarik.', 'Hubungkan cerita dengan pengalaman sehari-hari.'],
  },
};

const relatedActivities = [
  { id: 2, category: 'SENSORIK', title: 'Mengenal Tekstur dengan Benda Sekitar', age: '12-18 Bulan', image: 'https://images.unsplash.com/photo-1491013516836-7db643ee1251?w=280&h=180&fit=crop' },
  { id: 3, category: 'BAHASA', title: 'Bercerita dengan Boneka Tangan', age: '2-3 Tahun', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=280&h=180&fit=crop' },
  { id: 4, category: 'MOTORIK HALUS', title: 'Finger Painting: Warna Pelangi', age: '3-5 Tahun', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=280&h=180&fit=crop' },
  { id: 5, category: 'SOSIAL-EMOSIONAL', title: 'Bermain Cilukba & Ekspresi Wajah', age: '6-9 Bulan', image: 'https://images.unsplash.com/photo-1502661701214-96c8f8c3a1c2?w=280&h=180&fit=crop' },
  { id: 6, category: 'KOGNITIF', title: 'Menyusun Balok Warna-Warni', age: '1-2 Tahun', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=280&h=180&fit=crop' },
  { id: 7, category: 'FISIK', title: 'Melompat Meniru Gerakan Kelinci', age: '3-5 Tahun', image: 'https://images.unsplash.com/photo-1526634332515-d56c5fd1692b?w=280&h=180&fit=crop' },
];

export default function StimulusDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const activity = useMemo(() => activities[id] || activities[1], [id]);

  return (
    <main className="stimulus-detail-page">
      <div className="stimulus-detail-shell">
        <div className="stimulus-detail-breadcrumb">
          <span className="stimulus-detail-link" onClick={() => navigate('/')}>Beranda</span>
          <span className="stimulus-detail-sep">/</span>
          <span className="stimulus-detail-link" onClick={() => navigate('/stimulus')}>Parenting</span>
          <span className="stimulus-detail-sep">/</span>
          <span className="stimulus-detail-current">Stimulus Anak</span>
        </div>

        <div className="stimulus-detail-layout">
          <section className="stimulus-detail-main">
            <button type="button" className="stimulus-detail-back" onClick={() => navigate('/stimulus')}>
              <ArrowLeft size={16} /> Kembali ke daftar
            </button>

            <div className="stimulus-detail-hero-card">
              <div className="stimulus-detail-hero-media">
                <img src={activity.image} alt={activity.title} className="stimulus-detail-hero-image" />
                <button type="button" className="stimulus-detail-play-btn" aria-label="Putar preview">
                  <Play size={28} fill="currentColor" />
                </button>
                <div className="stimulus-detail-hero-overlay">
                  <div className="stimulus-detail-chip">{activity.heroLabel}</div>
                  <h1 className="stimulus-detail-title">{activity.title}</h1>
                  <p className="stimulus-detail-subtitle">{activity.subtitle}</p>
                </div>
              </div>
            </div>

            <section className="stimulus-detail-section">
              <div className="stimulus-detail-section-head">
                <BookOpen size={20} />
                <h2>Langkah-Langkah Instruksi</h2>
              </div>
              <ol className="stimulus-detail-step-list">
                {activity.instructions.map((step, index) => (
                  <li key={step} className="stimulus-detail-step-item">
                    <span className="stimulus-detail-step-number">{index + 1}</span>
                    <div>
                      <h3>{step}</h3>
                      <p>{index === 0
                        ? 'Letakkan si kecil di atas matras atau permukaan yang datar dan bersih dengan posisi tengkurap.'
                        : index === 1
                          ? 'Gunakan mainan berwarna cerah atau berbunyi di depan anak, sedikit di luar jangkauan tangannya.'
                          : index === 2
                            ? 'Berikan dorongan verbal atau tepuk tangan saat si kecil mulai mencoba menggerakkan tubuhnya maju.'
                            : 'Biarkan anak berhasil menyentuh mainan tersebut dan berikan pujian yang hangat.'}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="stimulus-detail-section stimulus-detail-gear-section">
              <div className="stimulus-detail-section-head">
                <Sparkles size={20} />
                <h2>Peralatan yang Diperlukan</h2>
              </div>
              <div className="stimulus-detail-gear-grid">
                {activity.equipment.map((item) => (
                  <div key={item} className="stimulus-detail-gear-card">
                    <CheckCircle2 size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="stimulus-detail-section">
              <div className="stimulus-detail-section-head">
                <h2>Manfaat Utama</h2>
              </div>
              <div className="stimulus-detail-benefit-grid">
                {activity.benefits.map((benefit) => (
                  <div key={benefit} className="stimulus-detail-benefit-card">
                    <CheckCircle2 size={18} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </section>
          </section>

          <aside className="stimulus-detail-sidebar">
            <div className="stimulus-detail-sidebar-card">
              <h2>Daftar Aktivitas Lainnya</h2>
              <div className="stimulus-detail-related-list">
                {relatedActivities.map((item) => (
                  <button type="button" key={item.id} className="stimulus-detail-related-item" onClick={() => navigate(`/stimulus/${item.id}`)}>
                    <img src={item.image} alt={item.title} className="stimulus-detail-related-image" />
                    <div className="stimulus-detail-related-copy">
                      <span className={`stimulus-detail-related-category stimulus-detail-related-category-${item.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>{item.category}</span>
                      <strong>{item.title}</strong>
                      <span>Usia: {item.age}</span>
                    </div>
                  </button>
                ))}
              </div>

              <button type="button" className="stimulus-detail-more-btn" onClick={() => navigate('/stimulus')}>
                Lihat Semua Aktivitas
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="stimulus-detail-sidebar-card stimulus-detail-sidebar-note">
              <h3>Tips Singkat</h3>
              <ul>
                {activity.tips.map((tip) => <li key={tip}>{tip}</li>)}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
