import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, CheckCircle2, BookOpen } from 'lucide-react';
import '../../styles/pages/parenting-pola-asuh-detail.css';

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

export default function PolaAsuhDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const article = useMemo(() => {
    const articleId = Number(id);
    return articles.find((item) => item.id === articleId) || articles[0];
  }, [id]);

  const related = useMemo(
    () => articles.filter((item) => item.id !== article.id).slice(0, 4),
    [article.id]
  );

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
              <ul className="pola-detail-steps">
                {article.keySteps.map((step) => (
                  <li key={step}>
                    <CheckCircle2 size={18} />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
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
              <button type="button" className="pola-detail-primary-btn" onClick={() => navigate('/kuis-parenting')}>
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
