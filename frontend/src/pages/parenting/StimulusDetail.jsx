import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Play, ArrowLeft, ChevronRight, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';
import api from '../../lib/api';
import '../../styles/pages/parenting-stimulus-detail.css';

function extractSection(content, section) {
  if (!content) return '';
  const pattern = new RegExp(`##\\s*${section}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, 'i');
  const match = content.match(pattern);
  return match ? match[1].trim() : '';
}

function normalizeListLine(line) {
  return (line || '')
    .replace(/^\s*[-*]\s+/, '')
    .replace(/^\s*\d+[.)]\s+/, '')
    .replace(/^#+\s*/, '')
    .replace(/\*\*/g, '')
    .trim();
}

function toList(text) {
  return (text || '')
    .split('\n')
    .map((line) => normalizeListLine(line))
    .filter(Boolean);
}

function cleanContentItems(items) {
  const blockedPatterns = [
    /^\+\d+$/,
    /^https?:\/\//i,
    /^(sumber|source)\s*:/i,
    /^universitas\b/i,
    /^www\./i,
  ];

  const seen = new Set();
  const cleaned = [];

  for (const rawItem of items || []) {
    const item = normalizeListLine(rawItem).replace(/\s+/g, ' ').trim();
    if (!item || item.length < 4) continue;
    if (blockedPatterns.some((pattern) => pattern.test(item))) continue;

    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    cleaned.push(item);
  }

  return cleaned;
}

function splitItem(item) {
  const text = normalizeListLine(item);
  const splitIndex = text.indexOf(':');

  if (splitIndex > 0 && splitIndex < 80) {
    return {
      title: text.slice(0, splitIndex + 1).trim(),
      description: text.slice(splitIndex + 1).trim(),
    };
  }

  return {
    title: text,
    description: '',
  };
}

function parseStep(rawStep) {
  const cleaned = normalizeListLine(rawStep);
  const splitIndex = cleaned.indexOf(':');
  if (splitIndex > 0 && splitIndex < 80) {
    return {
      title: cleaned.slice(0, splitIndex + 1).trim(),
      description: cleaned.slice(splitIndex + 1).trim(),
    };
  }
  return { title: cleaned, description: '' };
}

function parseVideoUrl(content) {
  const fromVideoSection = extractSection(content, 'Video');
  const directUrl = (fromVideoSection || content || '').match(/https?:\/\/[^\s)]+/i);
  return directUrl ? directUrl[0] : '';
}

function toEmbedVideoUrl(url) {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const videoId = parsed.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0`;
      }

      const pathParts = parsed.pathname.split('/').filter(Boolean);
      if (pathParts[0] === 'embed' && pathParts[1]) {
        return `https://www.youtube.com/embed/${pathParts[1]}?rel=0`;
      }
      if (pathParts[0] === 'shorts' && pathParts[1]) {
        return `https://www.youtube.com/embed/${pathParts[1]}?rel=0`;
      }
    }

    if (host === 'youtu.be') {
      const videoId = parsed.pathname.replace('/', '');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0`;
      }
    }

    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = parsed.pathname.split('/').filter(Boolean).pop();
      if (id) {
        return `https://player.vimeo.com/video/${id}`;
      }
    }
  } catch {
    return '';
  }

  return '';
}

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
  const { slug } = useParams();
  const [apiActivity, setApiActivity] = useState(null);
  const [relatedApi, setRelatedApi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [detailRes, listRes] = await Promise.all([
          api.get(`/parenting/${slug}`),
          api.get('/parenting'),
        ]);
        const detail = detailRes?.data?.data;
        if (detail) {
          const isi = detail.isi || '';
          const langkahSection = extractSection(isi, 'Langkah-Langkah') || extractSection(isi, 'Langkah-Langkah Instruksi');
          const manfaatSection = extractSection(isi, 'Manfaat');
          const peralatanSection = extractSection(isi, 'Peralatan');

          const parsedInstructions = cleanContentItems(toList(langkahSection || isi));
          const parsedBenefits = cleanContentItems(toList(manfaatSection));
          const parsedEquipment = cleanContentItems(toList(peralatanSection));
          const parsedVideoUrl = parseVideoUrl(isi);

          setApiActivity({
            id: detail.id,
            title: detail.judul,
            subtitle: detail.ringkasan || 'Konten stimulasi anak',
            image: detail.gambar_url || activities[1].image,
            heroLabel: (detail.phase || 'Parenting').toUpperCase(),
            summary: detail.ringkasan || detail.isi || '',
            instructions: parsedInstructions,
            equipment: parsedEquipment,
            benefits: parsedBenefits,
            videoUrl: parsedVideoUrl,
            tips: ['Lakukan konsisten setiap hari', 'Sesuaikan dengan usia anak', 'Dampingi dengan suasana menyenangkan'],
          });
        }

        const rows = Array.isArray(listRes?.data?.data) ? listRes.data.data : [];
        const related = rows
          .filter((item) => item.slug !== slug)
          .slice(0, 6)
          .map((item) => ({
            id: item.id,
            slug: item.slug,
            category: item.kategori || 'PARENTING',
            title: item.judul,
            age: item.phase || '-',
            image: item.gambar_url || activities[1].image,
          }));
        setRelatedApi(related);
      } catch {
        setApiActivity(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  const activity = useMemo(() => {
    if (apiActivity) {
      return {
        ...apiActivity,
        instructions: apiActivity.instructions.length ? apiActivity.instructions : activities[1].instructions,
        equipment: apiActivity.equipment?.length ? apiActivity.equipment : activities[1].equipment,
        benefits: apiActivity.benefits?.length ? apiActivity.benefits : activities[1].benefits,
      };
    }
    return activities[1];
  }, [apiActivity]);

  const relatedActivities = useMemo(() => {
    if (relatedApi.length) {
      return relatedApi;
    }
    return [
      { id: 2, slug: 'mengenal-tekstur', category: 'SENSORIK', title: 'Mengenal Tekstur dengan Benda Sekitar', age: '12-18 Bulan', image: 'https://images.unsplash.com/photo-1491013516836-7db643ee1251?w=280&h=180&fit=crop' },
      { id: 3, slug: 'bercerita-boneka', category: 'BAHASA', title: 'Bercerita dengan Boneka Tangan', age: '2-3 Tahun', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=280&h=180&fit=crop' },
    ];
  }, [relatedApi]);

  const embeddedVideoUrl = useMemo(() => toEmbedVideoUrl(activity.videoUrl), [activity.videoUrl]);
  const canEmbedVideo = Boolean(embeddedVideoUrl);

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
            {loading && <p>Memuat detail aktivitas...</p>}

            <section className="stimulus-detail-section stimulus-detail-video-priority">
              <div className="stimulus-detail-section-head">
                <Play size={20} />
                <h2>Video Materi</h2>
              </div>

              {canEmbedVideo ? (
                <div className="stimulus-detail-video-embed-wrap stimulus-detail-video-embed-top">
                  <iframe
                    title={`Video ${activity.title}`}
                    src={embeddedVideoUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : (
                <p className="stimulus-detail-video-note">Video belum tersedia untuk materi ini.</p>
              )}
            </section>

            <section className="stimulus-detail-section stimulus-detail-intro-card">
              <div className="stimulus-detail-section-head">
                <BookOpen size={20} />
                <h2>{activity.title}</h2>
              </div>
              <p className="stimulus-detail-intro-text">{activity.subtitle}</p>
              <button
                type="button"
                className="stimulus-detail-video-toggle"
                onClick={() => navigate(`/kuis-parenting/konten/parenting/${slug}`)}
              >
                Kerjakan Kuis Materi Ini
              </button>
            </section>

            <section className="stimulus-detail-section">
              <div className="stimulus-detail-section-head">
                <BookOpen size={20} />
                <h2>Langkah-Langkah Instruksi</h2>
              </div>
              <ol className="stimulus-detail-step-list">
                {activity.instructions.map((step, index) => (
                  <li key={`${index}-${step}`} className="stimulus-detail-step-item">
                    <span className="stimulus-detail-step-number">{index + 1}</span>
                    <div>
                      {(() => {
                        const parsed = parseStep(step);
                        return (
                          <>
                            <h3>{parsed.title}</h3>
                            {parsed.description && <p>{parsed.description}</p>}
                          </>
                        );
                      })()}
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
                    <div>
                      {(() => {
                        const parsed = splitItem(item);
                        return (
                          <>
                            <strong>{parsed.title}</strong>
                            {parsed.description ? <p>{parsed.description}</p> : null}
                          </>
                        );
                      })()}
                    </div>
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
                    <div>
                      {(() => {
                        const parsed = splitItem(benefit);
                        return (
                          <>
                            <strong>{parsed.title}</strong>
                            {parsed.description ? <p>{parsed.description}</p> : null}
                          </>
                        );
                      })()}
                    </div>
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
                  <button type="button" key={item.id} className="stimulus-detail-related-item" onClick={() => navigate(`/stimulus/${item.slug}`)}>
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
