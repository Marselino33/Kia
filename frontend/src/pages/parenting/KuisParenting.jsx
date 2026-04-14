import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock3, ChevronRight } from 'lucide-react';
import '../../styles/pages/parenting-kuis-parenting.css'

const quizCards = [
  {
    id: 1,
    level: 'TINGKAT DASAR',
    levelVariant: 'basic',
    duration: '5 Menit',
    title: 'Kuis Pola Asuh 0-18 Bulan',
    description:
      'Uji pemahaman Anda tentang milestone perkembangan bayi, jadwal imunisasi, dan teknik stimulasi dini yang tepat.',
    image:
      'https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=900&q=80',
    action: '/kuis-parenting/main/pola-asuh-dasar',
  },
  {
    id: 2,
    level: 'PENTING',
    levelVariant: 'important',
    duration: '8 Menit',
    title: 'Kuis Gizi & MPASI',
    description:
      'Seberapa paham ibu tentang kandungan nutrisi makro dan mikro untuk mencegah stunting pada masa MPASI?',
    image:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
    action: '/kuis-parenting/main/gizi-dan-mpasi',
  },
  {
    id: 3,
    level: 'PSIKOLOGI',
    levelVariant: 'psychology',
    duration: '6 Menit',
    title: 'Kuis Mental Health',
    description:
      'Kenali tanda-tanda baby blues, burnout pada orang tua, dan cara menjaga kesehatan emosional selama mendampingi si kecil.',
    image:
      'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=900&q=80',
    action: '/kuis-parenting/main/kesehatan-mental-orangtua',
  },
];

export default function KuisParenting() {
  const navigate = useNavigate();
  const cards = useMemo(() => quizCards, []);

  return (
    <section className="kuis-parenting-page">
      <div className="kuis-parenting-container">
        <div className="kuis-parenting-breadcrumb">
          <span onClick={() => navigate('/user/pengguna')} className="kuis-parenting-link">Pengguna</span>
          <span className="kuis-parenting-sep">&gt;</span>
          <span onClick={() => navigate('/pola-asuh')} className="kuis-parenting-link">Parenting</span>
          <span className="kuis-parenting-sep">&gt;</span>
          <span className="kuis-parenting-breadcrumb-current">Kuis Pemahaman</span>
        </div>

        <h1 className="kuis-parenting-title">
          Kuis Pemahaman Ibu & Ayah
        </h1>
        <p className="kuis-parenting-subtitle">
          Pilih kuis untuk menguji wawasan Anda tentang pola asuh dan kesehatan si kecil.
          Dapatkan hasil instan dan saran dari para ahli KIA.
        </p>

        <div className="kuis-parenting-list">
          {cards.map((card) => (
            <article
              key={card.id}
              className="kuis-parenting-card"
            >
              <div className="kuis-parenting-card-media">
                <img
                  src={card.image}
                  alt={card.title}
                  className="kuis-parenting-card-image"
                />
              </div>

              <div className="kuis-parenting-card-body">
                <div className="kuis-parenting-card-meta-row">
                  <span className={`kuis-parenting-level-badge kuis-parenting-level-${card.levelVariant}`}>
                    {card.level}
                  </span>
                  <span className="kuis-parenting-duration">
                    <Clock3 size={14} /> {card.duration}
                  </span>
                </div>

                <h2 className="kuis-parenting-card-title">
                  {card.title}
                </h2>

                <p className="kuis-parenting-card-description">
                  {card.description}
                </p>

                <button
                  onClick={() => navigate(card.action)}
                  className="kuis-parenting-action-btn"
                >
                  Mulai Kuis <ChevronRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

    </section>
  );
}
