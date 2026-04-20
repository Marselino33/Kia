import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Clock3, FlaskConical, Heart, ShieldCheck, Timer } from 'lucide-react';
import '../../styles/pages/gizi-resep-mpasi-detail.css';

const recipes = {
  'tim-hati-ayam-wortel': {
    title: 'Bubur Lumat Hati Ayam & Wortel',
    duration: '25 Menit',
    age: '6-8 Bulan',
    difficulty: 'Mudah',
    primaryNutrient: 'Zat Besi & Vit A',
    image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      '30g Beras putih organik',
      '25g Hati ayam (cuci bersih)',
      '15g Wortel, serut halus',
      '75ml Minyak kelapa / lemak tambahan',
      '300ml Kaldu ayam/air matang',
      '1 siung Bawang putih (geprek)'
    ],
    equipment: ['Panci Kecil', 'Saringan Kawat', 'Talenan', 'Sendok Kayu'],
    steps: [
      {
        title: 'Persiapan Awal',
        desc: 'Rebus hati ayam dengan bawang putih geprek hingga matang untuk menghilangkan bau amis. Setelah matang, angkat dan cincang halus.'
      },
      {
        title: 'Memasak Bubur',
        desc: 'Masak beras dengan air kaldu dalam panci. Gunakan api kecil dan aduk perlahan agar nasi tidak lengket di dasar panci.'
      },
      {
        title: 'Pencampuran Bahan',
        desc: 'Setelah nasi menjadi lembek, masukkan cincangan hati ayam dan serutan wortel. Masak terus hingga tekstur menjadi bubur kental.'
      },
      {
        title: 'Penyaringan (Lumat)',
        desc: 'Matikan api. Saring bubur menggunakan saringan kawat untuk mendapatkan tekstur yang benar-benar halus (lumat), sesuai kemampuan menelan bayi.'
      },
      {
        title: 'Sentuhan Akhir',
        desc: 'Tambahkan lemak tambahan (minyak kelapa atau mentega tawar) selagi hangat. Aduk rata dan sajikan segera.'
      }
    ],
    tips: 'Pastikan wortel diparut sangat halus atau dipotong kecil agar nutrisinya mudah diserap dan mudah saat disaring.',
    whyImportant: [
      {
        title: 'Hati Ayam (Zat Besi)',
        desc: 'Kaya akan zat besi heme yang sangat mudah diserap tubuh bayi untuk mencegah anemia dan mendukung perkembangan kognitif.'
      },
      {
        title: 'Wortel (Vitamin A)',
        desc: 'Sumber beta karoten yang baik untuk kesehatan mata dan memperkuat sistem imun bayi yang sedang berkembang.'
      }
    ],
    qualityBadges: [
      { title: '100%', sub: 'Alami & Bergizi' },
      { title: 'Tinggi', sub: 'Asam Amino' },
      { title: 'Bebas', sub: 'Gula & Garam' },
      { title: 'Lembut', sub: 'Untuk Pencernaan' }
    ]
  },
  'puree-labu-siam-daging': {
    title: 'Puree Labu Siam & Daging Sapi',
    duration: '15 Menit',
    age: '6-8 Bulan',
    difficulty: 'Mudah',
    primaryNutrient: 'Protein & Serat',
    image: 'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?auto=format&fit=crop&w=1200&q=80',
    ingredients: ['25g Daging sapi giling', '3 sdm Labu siam kukus', '120ml Air matang', '1 sdt Minyak kelapa'],
    equipment: ['Panci Kecil', 'Saringan Kawat', 'Blender', 'Sendok Silikon'],
    steps: [
      { title: 'Siapkan Bahan', desc: 'Pastikan daging segar dan labu siam sudah dikukus sampai empuk.' },
      { title: 'Masak Daging', desc: 'Masak daging dengan sedikit air sampai matang sempurna.' },
      { title: 'Haluskan', desc: 'Blender bersama labu siam dan air sampai lembut.' },
      { title: 'Saring', desc: 'Saring jika diperlukan untuk tekstur yang lebih halus.' },
      { title: 'Sajikan', desc: 'Tambahkan minyak kelapa saat hangat dan sajikan.' }
    ],
    tips: 'Sesuaikan kekentalan puree dengan tahap MPASI anak.',
    whyImportant: [
      { title: 'Daging Sapi', desc: 'Menyumbang protein hewani dan zat besi untuk pertumbuhan.' },
      { title: 'Labu Siam', desc: 'Memberi serat lembut untuk bantu pencernaan.' }
    ],
    qualityBadges: [
      { title: '100%', sub: 'Bahan Segar' },
      { title: 'Tinggi', sub: 'Protein' },
      { title: 'Lunak', sub: 'Tekstur Aman' },
      { title: 'Praktis', sub: 'Cepat Disajikan' }
    ]
  },
  'bubur-susu-alpukat': {
    title: 'Bubur Susu Alpukat Gurih',
    duration: '10 Menit',
    age: '6-8 Bulan',
    difficulty: 'Mudah',
    primaryNutrient: 'Lemak Sehat',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    ingredients: ['1/4 Alpukat matang', '2 sdm Bubur beras', '50ml ASI/Sufor', '1 sdt minyak kelapa'],
    equipment: ['Mangkuk', 'Sendok', 'Saringan Kawat', 'Blender'],
    steps: [
      { title: 'Haluskan Alpukat', desc: 'Gunakan sendok atau blender agar hasil lembut.' },
      { title: 'Campur Bubur', desc: 'Aduk bersama bubur beras hangat.' },
      { title: 'Tambahkan Susu', desc: 'Masukkan ASI/sufor sedikit demi sedikit hingga pas.' },
      { title: 'Saring', desc: 'Saring jika masih ada serat kasar.' },
      { title: 'Sajikan Segera', desc: 'Berikan selagi segar agar rasa dan warna tetap baik.' }
    ],
    tips: 'Gunakan alpukat yang matang pohon agar rasa lebih alami dan lembut.',
    whyImportant: [
      { title: 'Alpukat', desc: 'Sumber lemak baik untuk perkembangan otak bayi.' },
      { title: 'Bubur Beras', desc: 'Karbohidrat mudah cerna sebagai sumber energi awal.' }
    ],
    qualityBadges: [
      { title: 'Alami', sub: 'Tanpa Gula' },
      { title: 'Sehat', sub: 'Lemak Baik' },
      { title: 'Lembut', sub: 'Mudah Telan' },
      { title: 'Ringan', sub: 'Cocok Harian' }
    ]
  },
  'bubur-ikan-kembung-bayam': {
    title: 'Bubur Ikan Kembung & Bayam',
    duration: '30 Menit',
    age: '6-8 Bulan',
    difficulty: 'Sedang',
    primaryNutrient: 'DHA & Kalsium',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
    ingredients: ['25g Ikan kembung', '2 sdm Bayam cincang', '2 sdm Nasi tim', '150ml Air matang'],
    equipment: ['Panci Kecil', 'Saringan Kawat', 'Talenan', 'Pinset Duri'],
    steps: [
      { title: 'Kukus Ikan', desc: 'Masak hingga matang lalu bersihkan semua duri dengan teliti.' },
      { title: 'Rebus Bayam', desc: 'Rebus sebentar agar warna dan nutrisi tetap baik.' },
      { title: 'Haluskan', desc: 'Blender ikan, bayam, nasi tim, dan air sampai rata.' },
      { title: 'Saring', desc: 'Saring untuk mendapatkan tekstur sangat halus.' },
      { title: 'Hangatkan', desc: 'Panaskan sebentar sebelum disajikan.' }
    ],
    tips: 'Pastikan tidak ada duri tersisa sebelum diberikan pada bayi.',
    whyImportant: [
      { title: 'Ikan Kembung', desc: 'Mendukung perkembangan otak dengan kandungan DHA alami.' },
      { title: 'Bayam', desc: 'Menyumbang folat dan mikronutrien untuk tumbuh kembang.' }
    ],
    qualityBadges: [
      { title: 'Omega 3', sub: 'DHA Alami' },
      { title: 'Tinggi', sub: 'Protein Ikan' },
      { title: 'Hijau', sub: 'Sayur Harian' },
      { title: 'Halus', sub: 'Aman MPASI' }
    ]
  },
  'puree-pisang-apel': {
    title: 'Puree Pisang Apel & Kayu Manis',
    duration: '10 Menit',
    age: '6-8 Bulan',
    difficulty: 'Mudah',
    primaryNutrient: 'Serat & Antioksidan',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1200&q=80',
    ingredients: ['1/2 Pisang matang', '2 sdm Apel kukus', 'Sejumput kayu manis', 'Sedikit air hangat'],
    equipment: ['Mangkuk', 'Garpu', 'Saringan Kawat', 'Sendok Bayi'],
    steps: [
      { title: 'Kukus Apel', desc: 'Kukus sampai empuk agar mudah dihaluskan.' },
      { title: 'Haluskan Buah', desc: 'Lumat apel dan pisang hingga tekstur creamy.' },
      { title: 'Tambahkan Kayu Manis', desc: 'Masukkan sedikit untuk aroma, jangan berlebihan.' },
      { title: 'Aduk dan Saring', desc: 'Aduk rata lalu saring bila perlu.' },
      { title: 'Sajikan', desc: 'Sajikan segera tanpa gula tambahan.' }
    ],
    tips: 'Pilih apel manis agar puree lebih disukai bayi.',
    whyImportant: [
      { title: 'Pisang', desc: 'Sumber energi cepat dan kalium untuk aktivitas harian.' },
      { title: 'Apel', desc: 'Memberi serat lembut untuk bantu pencernaan.' }
    ],
    qualityBadges: [
      { title: 'Alami', sub: 'Tanpa Gula' },
      { title: 'Buah', sub: 'Segar Harian' },
      { title: 'Cepat', sub: '10 Menit' },
      { title: 'Lembut', sub: 'Mudah Cerna' }
    ]
  },
  'bubur-telur-puyuh-tahu': {
    title: 'Bubur Telur Puyuh & Tahu Sutra',
    duration: '20 Menit',
    age: '6-8 Bulan',
    difficulty: 'Mudah',
    primaryNutrient: 'Protein Lengkap',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80',
    ingredients: ['2 butir Telur puyuh', '30g Tahu sutra', '2 sdm Bubur nasi', '120ml Air matang'],
    equipment: ['Panci Kecil', 'Saringan Kawat', 'Mangkuk', 'Sendok'],
    steps: [
      { title: 'Rebus Telur', desc: 'Rebus telur puyuh sampai matang sempurna.' },
      { title: 'Campur Bahan', desc: 'Haluskan telur, tahu sutra, dan bubur nasi.' },
      { title: 'Atur Kekentalan', desc: 'Tambahkan air hangat sedikit demi sedikit.' },
      { title: 'Saring', desc: 'Saring agar tekstur lebih aman untuk bayi.' },
      { title: 'Sajikan', desc: 'Sajikan saat hangat sesuai porsi bayi.' }
    ],
    tips: 'Perhatikan alergi protein telur saat pertama kali memperkenalkan menu ini.',
    whyImportant: [
      { title: 'Telur Puyuh', desc: 'Kaya protein dan mikronutrien penting untuk pertumbuhan.' },
      { title: 'Tahu Sutra', desc: 'Tekstur lembut, sumber protein nabati mudah diolah.' }
    ],
    qualityBadges: [
      { title: 'Protein', sub: 'Lengkap' },
      { title: 'Lunak', sub: 'Mudah Telan' },
      { title: 'Seimbang', sub: 'Hewani & Nabati' },
      { title: 'Praktis', sub: '20 Menit' }
    ]
  },
};

export default function ResepMPASIDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const recipe = useMemo(() => recipes[slug] || recipes['tim-hati-ayam-wortel'], [slug]);
  const relatedRecipes = useMemo(
    () => Object.entries(recipes)
      .filter(([key]) => key !== slug)
      .slice(0, 3)
      .map(([key, value]) => ({
        slug: key,
        title: value.title,
        duration: value.duration,
        image: value.image,
        age: value.age,
      })),
    [slug]
  );

  return (
    <main className="resep-detail-page">
      <div className="resep-detail-container">
        <div className="resep-detail-breadcrumb">
          <span onClick={() => navigate('/beranda')} className="resep-detail-link">Beranda</span>
          <span>›</span>
          <span>Gizi</span>
          <span>›</span>
          <span onClick={() => navigate('/resep-mpasi')} className="resep-detail-link">Resep MPASI</span>
          <span>›</span>
          <span className="resep-detail-current">Detail Resep</span>
        </div>

        <section className="resep-detail-hero-card">
          <img src={recipe.image} alt={recipe.title} className="resep-detail-hero-image" />
          <div className="resep-detail-hero-overlay">
            <span className="resep-detail-hero-age">USIA {recipe.age.toUpperCase()}</span>
            <h1>{recipe.title}</h1>
            <div className="resep-detail-hero-stats">
              <div className="resep-detail-hero-stat">
                <Clock3 size={14} />
                <div>
                  <small>Waktu Masak</small>
                  <strong>{recipe.duration}</strong>
                </div>
              </div>
              <div className="resep-detail-hero-stat">
                <Timer size={14} />
                <div>
                  <small>Kesulitan</small>
                  <strong>{recipe.difficulty}</strong>
                </div>
              </div>
              <div className="resep-detail-hero-stat">
                <FlaskConical size={14} />
                <div>
                  <small>Nutrisi Utama</small>
                  <strong>{recipe.primaryNutrient}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="resep-detail-grid">
          <aside className="resep-detail-side">
            <div className="resep-detail-card">
              <h2>Bahan-bahan</h2>
              <ul className="resep-detail-bullet-list">
                {recipe.ingredients.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="resep-detail-card">
              <h2>Peralatan</h2>
              <div className="resep-detail-tools-grid">
                {recipe.equipment.map((item) => (
                  <div key={item} className="resep-detail-tool-chip">{item}</div>
                ))}
              </div>
            </div>
          </aside>

          <article className="resep-detail-main-card">
            <h2>Cara Membuat</h2>
            <ol className="resep-detail-steps">
              {recipe.steps.map((step, idx) => (
                <li key={step.title} className="resep-detail-step-item">
                  <span className="resep-detail-step-number">{idx + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="resep-detail-tip">
              <strong>TIPS AHLI</strong>
              <p>{recipe.tips}</p>
            </div>
          </article>
        </section>

        <section className="resep-detail-why-section">
          <div>
            <h2>Mengapa Menu Ini Penting?</h2>
            <div className="resep-detail-why-list">
              {recipe.whyImportant.map((item) => (
                <article key={item.title}>
                  <h3><Heart size={14} /> {item.title}</h3>
                  <p>{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="resep-detail-quality-grid">
            {recipe.qualityBadges.map((item) => (
              <div key={item.title} className="resep-detail-quality-card">
                <h4>{item.title}</h4>
                <p>{item.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="resep-detail-related">
          <header>
            <div>
              <h2>Resep Lainnya</h2>
              <p>Inspirasi menu MPASI sehat lainnya untuk sang buah hati.</p>
            </div>
            <Link to="/resep-mpasi" className="resep-detail-all-link">Lihat Semua <ArrowRight size={15} /></Link>
          </header>

          <div className="resep-detail-related-grid">
            {relatedRecipes.map((item) => (
              <article key={item.slug} className="resep-detail-related-card" onClick={() => navigate(`/resep-mpasi/${item.slug}`)}>
                <img src={item.image} alt={item.title} />
                <div className="resep-detail-related-body">
                  <span>{item.age}</span>
                  <h3>{item.title}</h3>
                  <p><ShieldCheck size={13} /> {item.duration}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
