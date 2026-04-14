import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock3, ChefHat, UtensilsCrossed } from 'lucide-react';
import '../../styles/pages/gizi-resep-mpasi-detail.css';

const recipes = {
  'tim-hati-ayam-wortel': {
    title: 'Bubur Lumat Hati Ayam & Wortel',
    duration: '25 Menit',
    age: '6-8 Bulan',
    image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
    ingredients: ['2 sdm nasi matang', '20 gr hati ayam', '2 sdm wortel kukus', '150 ml air kaldu'],
    steps: ['Rebus hati ayam hingga matang, lalu cincang halus.', 'Blender nasi, hati ayam, wortel, dan kaldu hingga tekstur lumat.', 'Masak kembali 3-5 menit sambil diaduk hingga hangat.', 'Sajikan dalam porsi kecil dan cek suhu sebelum diberikan.'],
    notes: 'Cocok sebagai menu MPASI tinggi zat besi untuk fase awal.'
  },
  'puree-labu-siam-daging': {
    title: 'Puree Labu Siam & Daging Sapi',
    duration: '15 Menit',
    age: '6-8 Bulan',
    image: 'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?auto=format&fit=crop&w=1200&q=80',
    ingredients: ['25 gr daging sapi giling', '3 sdm labu siam kukus', '120 ml air'],
    steps: ['Tumis ringan daging tanpa minyak hingga berubah warna.', 'Kukus labu siam sampai lembut.', 'Blender semua bahan hingga halus.', 'Panaskan sebentar sebelum disajikan.'],
    notes: 'Tambahkan air jika tekstur terlalu kental.'
  },
  'bubur-susu-alpukat': {
    title: 'Bubur Susu Alpukat Gurih',
    duration: '10 Menit',
    age: '6-8 Bulan',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    ingredients: ['1/4 alpukat matang', '2 sdm bubur beras', '50 ml ASI/sufor'],
    steps: ['Haluskan alpukat matang.', 'Campur dengan bubur beras hangat.', 'Tuang ASI/sufor sedikit demi sedikit.', 'Aduk sampai tekstur lembut.'],
    notes: 'Sajikan segera agar warna alpukat tidak berubah.'
  },
  'bubur-ikan-kembung-bayam': {
    title: 'Bubur Ikan Kembung & Bayam',
    duration: '30 Menit',
    age: '6-8 Bulan',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
    ingredients: ['25 gr ikan kembung', '2 sdm bayam cincang', '2 sdm nasi tim', '150 ml air'],
    steps: ['Kukus ikan dan pisahkan durinya.', 'Rebus bayam sebentar.', 'Blender ikan, bayam, nasi tim, dan air hingga halus.', 'Masak kembali 2-3 menit.'],
    notes: 'Pastikan duri ikan bersih sebelum diolah.'
  },
  'puree-pisang-apel': {
    title: 'Puree Pisang Apel & Kayu Manis',
    duration: '10 Menit',
    age: '6-8 Bulan',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1200&q=80',
    ingredients: ['1/2 pisang matang', '2 sdm apel kukus', 'sejumput kayu manis'],
    steps: ['Kukus apel hingga lunak.', 'Haluskan apel dan pisang bersama.', 'Tambahkan sejumput kayu manis.', 'Aduk rata dan sajikan.'],
    notes: 'Tidak perlu gula tambahan karena sudah manis alami.'
  },
  'bubur-telur-puyuh-tahu': {
    title: 'Bubur Telur Puyuh & Tahu Sutra',
    duration: '20 Menit',
    age: '6-8 Bulan',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80',
    ingredients: ['2 butir telur puyuh', '30 gr tahu sutra', '2 sdm bubur nasi', '120 ml air'],
    steps: ['Rebus telur puyuh hingga matang.', 'Haluskan telur, tahu sutra, dan bubur nasi.', 'Tambahkan air hangat secukupnya.', 'Panaskan sebentar dan sajikan.'],
    notes: 'Gunakan tekstur menyesuaikan usia anak.'
  },
};

export default function ResepMPASIDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const recipe = useMemo(() => recipes[slug] || recipes['tim-hati-ayam-wortel'], [slug]);

  return (
    <main className="resep-detail-page">
      <div className="resep-detail-hero">
        <img src={recipe.image} alt={recipe.title} className="resep-detail-hero-image" />
      </div>

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

        <button type="button" className="resep-detail-back" onClick={() => navigate('/resep-mpasi')}>
          <ArrowLeft size={16} /> Kembali ke daftar resep
        </button>

        <h1>{recipe.title}</h1>
        <div className="resep-detail-meta">
          <span><Clock3 size={14} /> {recipe.duration}</span>
          <span>{recipe.age}</span>
        </div>

        <section className="resep-detail-section">
          <h2><ChefHat size={18} /> Bahan-Bahan</h2>
          <ul>
            {recipe.ingredients.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section className="resep-detail-section">
          <h2><UtensilsCrossed size={18} /> Cara Membuat</h2>
          <ol>
            {recipe.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </section>

        <section className="resep-detail-note">
          <strong>Catatan:</strong> {recipe.notes}
        </section>
      </div>
    </main>
  );
}
