import { useMemo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronDown, BookOpen } from 'lucide-react';
import { contentService } from '../../api/contentService';
import '../../styles/pages/parenting-pola-asuh-detail.css';

function normalizeLine(line) {
  return (line || '')
    .replace(/^\s*[-*]\s+/, '')
    .replace(/^\s*\d+[.)]\s+/, '')
    .replace(/^#+\s*/, '')
    .replace(/\*\*/g, '')
    .trim();
}

function isNoiseLine(line) {
  const value = normalizeLine(line).replace(/\s+/g, ' ').trim();

  if (!value || value.length < 4) return true;

  const blockedPatterns = [
    /^\+\d+$/,
    /^https?:\/\//i,
    /^www\./i,
    /^(sumber|source)\s*:/i,
    /^universitas\b/i,
  ];

  return blockedPatterns.some((pattern) => pattern.test(value));
}

function canonicalStepKey(line) {
  return normalizeLine(line)
    .toLowerCase()
    .replace(/[:;,.!?]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanStepItems(items) {
  const seen = new Set();
  const cleaned = [];

  for (const rawItem of items || []) {
    const item = normalizeLine(rawItem).replace(/\s+/g, ' ').trim();
    if (isNoiseLine(item)) continue;

    const key = canonicalStepKey(item);
    if (seen.has(key)) continue;

    const isNearDuplicate = cleaned.some((existing) => {
      const existingKey = canonicalStepKey(existing);
      return existingKey.includes(key) || key.includes(existingKey);
    });
    if (isNearDuplicate) continue;

    seen.add(key);
    cleaned.push(item);
  }

  return cleaned;
}

function parsePracticalSteps(raw) {
  if (Array.isArray(raw)) {
    return cleanStepItems(raw.map((item) => normalizeLine(String(item))).filter(Boolean));
  }

  if (typeof raw !== 'string' || !raw.trim()) {
    return [];
  }

  const rows = raw
    .split(/\r?\n/)
    .map((line) => normalizeLine(line))
    .filter(Boolean);

  return cleanStepItems(rows);
}

function splitStep(rawStep) {
  const step = normalizeLine(rawStep);
  const splitIndex = step.indexOf(':');

  if (step.endsWith(':') && splitIndex === step.length - 1) {
    return {
      title: step,
      description: '',
      type: 'heading',
    };
  }

  if (splitIndex > 0 && splitIndex < 70) {
    return {
      title: step.slice(0, splitIndex + 1).trim(),
      description: step.slice(splitIndex + 1).trim(),
      type: 'default',
    };
  }

  return { title: step, description: '', type: 'default' };
}

const articles = [
  {
    id: 1,
    slug: 'membangun-kepercayaan',
    title: 'Membangun Kepercayaan',
    subtitle: 'Membangun langkah Anda dalam setiap fase perkembangan si kecil dengan pendekatan yang hangat, berdasar sains, dan penuh kasih sayang.',
    stage: 'tahap-bayi',
    stageLabel: 'TAHAP BAYI',
    ageRange: '0-18 Bulan',
    image: 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=1200&h=680&fit=crop',
    content: 'Di bulan-bulan pertama, rasa percaya adalah fondasi utama. Attachment yang aman (secure attachment) terbentuk ketika orang tua merespons kebutuhan bayi dengan konsisten dan penuh kehangatan, menciptakan rasa aman bagi masa depan emosionalnya.',
    keySteps: [
      'Respon tangisan dan kebutuhan bayi secara konsisten.',
      'Gunakan sentuhan hangat, pelukan, dan kontak mata.',
      'Bangun rutinitas harian yang stabil dan menenangkan.',
      'Berikan validasi emosi dengan suara lembut dan tenang.'
    ],
  },
  {
    id: 2,
    slug: 'menghadapi-tantrum',
    title: 'Menghadapi Tantrum',
    subtitle: 'Memandu langkah Anda dalam setiap fase perkembangan si kecil dengan pendekatan yang hangat, berdasar sains, dan penuh kasih sayang.',
    stage: 'tahap-salita',
    stageLabel: 'TAHAP SALITA',
    ageRange: '1.5 - 3 Tahun',
    image: 'https://images.unsplash.com/photo-1484662020986-75935d2ebc66?w=1200&h=680&fit=crop',
    content: 'Tantrum bukanlah perilaku buruk, melainkan luapan emosi yang belum bisa dievaluasi. Belajarlah teknik regulasi emosi untuk membantu si kecil mengenali dan mengelola emosinya sejak dini.',
    keySteps: [
      'Pastikan anak aman secara fisik terlebih dahulu.',
      'Tetap tenang dan hindari membalas dengan nada tinggi.',
      'Bantu anak menamai emosinya dengan kata sederhana.',
      'Setelah tenang, ajarkan alternatif perilaku yang tepat.'
    ],
  },
  {
    id: 3,
    slug: 'kedisiplinan-positif',
    title: 'Kedisiplinan Positif',
    subtitle: 'Pendekatan disiplin yang fokus pada solusi dan pengertian perlaku positif membimbing anak belajar tanggung jawab dan empati.',
    stage: 'tahap-pra-sekolah',
    stageLabel: 'TAHAP PRA-SEKOLAH',
    ageRange: '3 - 6 Tahun',
    image: 'https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?w=1200&h=680&fit=crop',
    content: 'Kedisiplinan bukan tentang hukuman, melainkan tentang menetapkan batasan yang jelas dengan cara yang menghargatkan perasaan anak. Fokus pada solusi dan pengertian perlaku positif membimbing anak belajar tanggung jawab dan empati.',
    keySteps: [
      'Jelaskan aturan dengan kalimat singkat dan konsisten.',
      'Fokus pada konsekuensi logis, bukan hukuman keras.',
      'Berikan contoh perilaku yang diharapkan.',
      'Apresiasi setiap kemajuan kecil anak.'
    ],
  },
  {
    id: 4,
    slug: 'kualitas-waktu-berkualitas',
    title: 'Kualitas Waktu Berkualitas',
    subtitle: 'Membangun hubungan yang kuat melalui interaksi bermakna dengan anak Anda.',
    stage: 'tahap-sekolah',
    stageLabel: 'TAHAP SEKOLAH',
    ageRange: '6+ Tahun',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=680&fit=crop',
    content: 'Waktu berkualitas bukan tentang durasi, melainkan tentang kehadiran penuh dan koneksi emosional. Ciptakan momen-momen bermakna yang memperkuat ikatan dan membangun kepercayaan diri anak.',
    keySteps: [
      'Sisihkan waktu bebas gawai setiap hari.',
      'Ajak anak berdiskusi tentang perasaannya.',
      'Lakukan aktivitas bersama sesuai minat anak.',
      'Tutup hari dengan refleksi positif singkat.'
    ],
  },
  {
    id: 5,
    slug: 'menangani-perilaku-menantang',
    title: 'Menangani Perilaku Menantang',
    subtitle: 'Strategi praktis untuk menghadapi perilaku sulit dengan tenang dan bijaksana.',
    stage: 'tahap-pra-sekolah',
    stageLabel: 'TAHAP PRA-SEKOLAH',
    ageRange: '3 - 6 Tahun',
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1200&h=680&fit=crop',
    content: 'Perilaku menantang adalah cara anak mengkomunikasikan kebutuhan mereka. Dengan memahami akar masalahnya, Anda dapat merespons dengan lebih efektif dan mengajarkan keterampilan sosial yang penting.',
    keySteps: [
      'Identifikasi pemicu perilaku sebelum bereaksi.',
      'Gunakan arahan positif yang jelas dan spesifik.',
      'Tetapkan batas konsisten dengan empati.',
      'Evaluasi pola dan lakukan penyesuaian rutinitas.'
    ],
  },
  {
    id: 6,
    slug: 'mendorong-kemandirian',
    title: 'Mendorong Kemandirian',
    subtitle: 'Membimbing anak untuk belajar melakukan hal-hal sendiri dengan percaya diri.',
    stage: 'tahap-salita',
    stageLabel: 'TAHAP SALITA',
    ageRange: '1.5 - 3 Tahun',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&h=680&fit=crop',
    content: 'Kemandirian dimulai dengan memberi kesempatan. Biarkan anak mencoba, membuat kesalahan, dan belajar dari pengalamannya dengan dukungan dan dorongan dari Anda.',
    keySteps: [
      'Berikan pilihan sederhana agar anak belajar memutuskan.',
      'Bagi tugas besar menjadi langkah kecil.',
      'Berikan waktu cukup tanpa terburu-buru membantu.',
      'Puji proses usaha, bukan hanya hasil akhir.'
    ],
  },
];

function groupPracticalSteps(items) {
  const parsedRows = (items || []).map((row) => splitStep(row)).filter((row) => row.title || row.description);
  if (!parsedRows.length) return [];

  const hasHeading = parsedRows.some((row) => row.type === 'heading');
  if (!hasHeading) {
    const [first, ...rest] = parsedRows;
    const firstKey = canonicalStepKey(first.title);
    const seen = new Set([firstKey]);
    const uniqueChildren = [];

    for (const row of rest) {
      const rowKey = canonicalStepKey(`${row.title} ${row.description}`);
      if (!rowKey || seen.has(rowKey)) continue;
      seen.add(rowKey);
      uniqueChildren.push(row);
    }

    return [
      {
        title: first.title.replace(/:\s*$/, ''),
        description: first.description,
        items: uniqueChildren,
      },
    ];
  }

  const groups = [];
  let currentGroup = null;

  for (const row of parsedRows) {
    if (row.type === 'heading') {
      if (currentGroup) groups.push(currentGroup);
      currentGroup = {
        title: row.title.replace(/:\s*$/, ''),
        description: '',
        items: [],
        seen: new Set(),
      };
      continue;
    }

    if (!currentGroup) {
      currentGroup = {
        title: row.title,
        description: row.description,
        items: [],
        seen: new Set([canonicalStepKey(`${row.title} ${row.description}`)]),
      };
      continue;
    }

    const rowKey = canonicalStepKey(`${row.title} ${row.description}`);
    if (!rowKey || currentGroup.seen.has(rowKey)) continue;
    currentGroup.seen.add(rowKey);
    currentGroup.items.push(row);
  }

  if (currentGroup) groups.push(currentGroup);

  return groups.map(({ seen, ...group }) => group);
}

export default function PolaAsuhDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openGroupIndex, setOpenGroupIndex] = useState(-1);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const data = await contentService.getPolaAsuhBySlug(id);
        if (data) {
          let stepsSource = data.langkah_praktis;
          if (typeof stepsSource === 'string' && stepsSource.trim().startsWith('[')) {
            try {
              stepsSource = JSON.parse(stepsSource);
            } catch {
              stepsSource = data.langkah_praktis;
            }
          }

          const steps = parsePracticalSteps(stepsSource);

          setArticle({
            id: data.id,
            slug: data.slug,
            title: data.judul,
            subtitle: data.ringkasan || '',
            stage: data.kategori ? data.kategori.toLowerCase().replace(' ', '-') : 'disiplin-positif',
            stageLabel: data.kategori ? data.kategori.toUpperCase() : 'DISCIPLIN POSITIF',
            ageRange: data.phase || '12-24 Bulan',
            image: data.gambar_url || 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=1200&h=680&fit=crop',
            content: data.isi || '',
            keySteps: steps.length > 0 ? steps : getDefaultSteps(data.judul),
          });
        } else {
          setArticle(getArticleById(id));
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setArticle(getArticleById(id));
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const getArticleById = (articleId) => {
    const numId = Number(articleId);
    const byId = articles.find((item) => item.id === numId);
    if (byId) return byId;
    const bySlug = articles.find((item) => item.slug === articleId);
    return bySlug || articles[0];
  };

  const getDefaultSteps = (title) => {
    const fallback = articles.find(a => a.title.toLowerCase().includes(title?.toLowerCase() || ''));
    return fallback?.keySteps || [];
  };

  const related = useMemo(() => {
    if (!article) return [];
    return articles.filter((item) => item.id !== article.id).slice(0, 4);
  }, [article]);

  const practicalGroups = useMemo(() => groupPracticalSteps(article?.keySteps || []), [article]);

  if (loading) {
    return (
      <main className="pola-detail-page">
        <div className="pola-detail-container">
          <div className="pola-loading">Memuat...</div>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="pola-detail-page">
        <div className="pola-detail-container">
          <div className="pola-loading">Artikel tidak ditemukan</div>
        </div>
      </main>
    );
  }

  return (
    <main className="pola-detail-page">
      <div className="pola-detail-container">
        <div className="pola-detail-breadcrumb">
          <span className="pola-detail-link" onClick={() => navigate('/')}>Beranda</span>
          <span className="pola-detail-sep">/</span>
          <span className="pola-detail-link" onClick={() => navigate('/pola-asuh')}>Parenting</span>
          <span className="pola-detail-sep">/</span>
          <span className="pola-detail-current">Pola Asuh Anak</span>
        </div>

        <div className="pola-detail-layout">
          <section className="pola-detail-main">
            <button type="button" className="pola-detail-back" onClick={() => navigate('/pola-asuh')}>
              <ArrowLeft size={16} /> Kembali ke daftar
            </button>

            <article className="pola-detail-hero-card">
              <img src={article.image} alt={article.title} className="pola-detail-hero-image" />
              <div className="pola-detail-hero-overlay">
                <span className={`pola-detail-stage pola-detail-stage-${article.stage}`}>{article.stageLabel}</span>
                <h1>{article.title}</h1>
                <p>{article.subtitle}</p>
              </div>
            </article>

            <section className="pola-detail-section">
              <div className="pola-detail-section-title">
                <BookOpen size={20} />
                <h2>Konten Pengasuhan</h2>
              </div>
              <p className="pola-detail-content">{article.content}</p>
            </section>

            <section className="pola-detail-section">
              <div className="pola-detail-section-title">
                <h2>Langkah Praktis</h2>
              </div>
              <div className="pola-detail-accordion">
                {practicalGroups.map((group, groupIndex) => {
                  const isOpen = openGroupIndex === groupIndex;

                  return (
                    <div key={`${article.id}-${group.title}-${groupIndex}`} className={`pola-detail-accordion-item ${isOpen ? 'is-open' : ''}`}>
                      <button
                        type="button"
                        className="pola-detail-accordion-trigger"
                        onClick={() => setOpenGroupIndex((current) => (current === groupIndex ? -1 : groupIndex))}
                        aria-expanded={isOpen}
                      >
                        <span className="pola-detail-step-number">{String(groupIndex + 1).padStart(2, '0')}</span>
                        <div className="pola-detail-step-body">
                          <strong>{group.title}</strong>
                          {group.description ? <p>{group.description}</p> : null}
                        </div>
                        <ChevronDown size={18} className="pola-detail-accordion-icon" />
                      </button>

                      {isOpen ? (
                        <ul className="pola-detail-step-list">
                          {group.items.map((step, stepIndex) => {
                            const stepNumber = stepIndex + 2;
                            return (
                              <li key={`${article.id}-${groupIndex}-${stepIndex}`} className="pola-detail-step-item">
                                <span className="pola-detail-step-mini-number">{String(stepNumber).padStart(2, '0')}</span>
                                <div className="pola-detail-step-body">
                                  <strong>{step.title}</strong>
                                  {step.description ? <p>{step.description}</p> : null}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          </section>

          <aside className="pola-detail-sidebar">
            <div className="pola-detail-sidebar-card">
              <h3>Informasi Singkat</h3>
              <div className="pola-detail-meta-item">
                <span>Tahap</span>
                <strong>{article.stageLabel}</strong>
              </div>
              <div className="pola-detail-meta-item">
                <span>Usia</span>
                <strong>{article.ageRange}</strong>
              </div>
              <button
                type="button"
                className="pola-detail-primary-btn"
                onClick={() => navigate(`/kuis-parenting/konten/pola-asuh/${article.slug || article.id}`)}
              >
                Lanjut Kuis Parenting <ChevronRight size={16} />
              </button>
            </div>

            <div className="pola-detail-sidebar-card">
              <h3>Artikel Lainnya</h3>
              <div className="pola-detail-related-list">
                {related.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className="pola-detail-related-item"
                    onClick={() => navigate(`/pola-asuh/${item.id}`)}
                  >
                    <img src={item.image} alt={item.title} />
                    <div>
                      <span>{item.ageRange}</span>
                      <strong>{item.title}</strong>
                    </div>
                  </button>
                ))}
              </div>
              <button type="button" className="pola-detail-outline-btn" onClick={() => navigate('/pola-asuh')}>
                Lihat Semua Artikel
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
