import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Beef, Droplets, Fish, Leaf, Salad, Soup, Wheat } from 'lucide-react';
import '../../styles/pages/gizi-gizi-ibu-trimester1.css';
const nutritionByStage = {
  trimester1: {
    title: 'Panduan Gizi Ibu Hamil & Menyusui',
    description: 'Nutrisi yang tepat adalah fondasi pertumbuhan si kecil. Temukan panduan porsi harian yang dirancang oleh ahli gizi untuk mendukung setiap langkah perjalanan Anda.',
    tipTitle: 'Kebutuhan Kalori Trimester 1',
    tipText: 'Pada trimester 1, fokus pada kualitas nutrisi dan frekuensi makan kecil. Tambahan kalori belum besar, namun kebutuhan folat, zat besi, dan protein mulai meningkat.',
    items: [{
      id: 'makanan-pokok',
      icon: Wheat,
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
      name: 'Makanan Pokok',
      portions: 'Jumlah Porsi: 6 Porsi',
      sample: 'Contoh 1 Porsi: 100gr Nasi'
    }, {
      id: 'protein-hewani',
      icon: Beef,
      iconBg: '#fee2e2',
      iconColor: '#b45309',
      name: 'Protein Hewani',
      portions: 'Jumlah Porsi: 4 Porsi',
      sample: 'Contoh 1 Porsi: 50gr Ikan/Daging'
    }, {
      id: 'protein-nabati',
      icon: Soup,
      iconBg: '#cffafe',
      iconColor: '#0e7490',
      name: 'Protein Nabati',
      portions: 'Jumlah Porsi: 4 Porsi',
      sample: 'Contoh 1 Porsi: 50gr Tempe/Tahu'
    }, {
      id: 'sayur',
      icon: Leaf,
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
      name: 'Sayur-sayuran',
      portions: 'Jumlah Porsi: 4 Porsi',
      sample: 'Contoh 1 Porsi: 100gr Sayuran Masak'
    }, {
      id: 'buah',
      icon: Salad,
      iconBg: '#fee2e2',
      iconColor: '#c2410c',
      name: 'Buah-buahan',
      portions: 'Jumlah Porsi: 4 Porsi',
      sample: 'Contoh 1 Porsi: 100gr Pepaya/Pisang'
    }, {
      id: 'lemak',
      icon: Droplets,
      iconBg: '#e5e7eb',
      iconColor: '#4b5563',
      name: 'Minyak/Lemak',
      portions: 'Jumlah Porsi: 5 Porsi',
      sample: 'Contoh 1 Porsi: 5gr (1 sdt) Minyak'
    }, {
      id: 'gula',
      icon: Fish,
      iconBg: '#cffafe',
      iconColor: '#0284c7',
      name: 'Gula',
      portions: 'Jumlah Porsi: 2 Porsi',
      sample: 'Contoh 1 Porsi: 10gr (1 sdm) Gula'
    }]
  },
  trimester2: {
    title: 'Panduan Gizi Ibu Hamil Trimester 2',
    description: 'Trimester 2 membutuhkan energi tambahan untuk pertumbuhan organ bayi. Tingkatkan protein, kalsium, dan serat sambil menjaga pola makan seimbang.',
    tipTitle: 'Kebutuhan Kalori Trimester 2',
    tipText: 'Kebutuhan kalori meningkat sekitar 300 kkal per hari pada trimester 2 untuk mendukung pertumbuhan organ bayi dan perkembangan jaringan ibu secara optimal.',
    items: [{
      id: 'makanan-pokok',
      icon: Wheat,
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
      name: 'Makanan Pokok',
      portions: 'Jumlah Porsi: 6-7 Porsi',
      sample: 'Contoh 1 Porsi: 100gr Nasi'
    }, {
      id: 'protein-hewani',
      icon: Beef,
      iconBg: '#fee2e2',
      iconColor: '#b45309',
      name: 'Protein Hewani',
      portions: 'Jumlah Porsi: 4-5 Porsi',
      sample: 'Contoh 1 Porsi: 50gr Ayam/Ikan'
    }, {
      id: 'protein-nabati',
      icon: Soup,
      iconBg: '#cffafe',
      iconColor: '#0e7490',
      name: 'Protein Nabati',
      portions: 'Jumlah Porsi: 4 Porsi',
      sample: 'Contoh 1 Porsi: 50gr Tahu/Tempe'
    }, {
      id: 'sayur',
      icon: Leaf,
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
      name: 'Sayur-sayuran',
      portions: 'Jumlah Porsi: 4-5 Porsi',
      sample: 'Contoh 1 Porsi: 100gr Sayuran Masak'
    }, {
      id: 'buah',
      icon: Salad,
      iconBg: '#fee2e2',
      iconColor: '#c2410c',
      name: 'Buah-buahan',
      portions: 'Jumlah Porsi: 4 Porsi',
      sample: 'Contoh 1 Porsi: 100gr Buah Segar'
    }, {
      id: 'lemak',
      icon: Droplets,
      iconBg: '#e5e7eb',
      iconColor: '#4b5563',
      name: 'Minyak/Lemak',
      portions: 'Jumlah Porsi: 5 Porsi',
      sample: 'Contoh 1 Porsi: 5gr (1 sdt) Minyak'
    }, {
      id: 'gula',
      icon: Fish,
      iconBg: '#cffafe',
      iconColor: '#0284c7',
      name: 'Gula',
      portions: 'Jumlah Porsi: 2 Porsi',
      sample: 'Contoh 1 Porsi: 10gr (1 sdm) Gula'
    }]
  },
  menyusui: {
    title: 'Panduan Gizi Ibu Menyusui',
    description: 'Saat menyusui, kebutuhan energi dan cairan meningkat. Prioritaskan protein, makanan kaya zat besi, kalsium, serta minum cukup setiap hari.',
    tipTitle: 'Kebutuhan Kalori Ibu Menyusui',
    tipText: 'Ibu menyusui memerlukan tambahan sekitar 400-500 kkal per hari. Konsumsi makanan tinggi protein, sayur beragam, dan cairan minimal 2.5 liter per hari.',
    items: [{
      id: 'makanan-pokok',
      icon: Wheat,
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
      name: 'Makanan Pokok',
      portions: 'Jumlah Porsi: 7 Porsi',
      sample: 'Contoh 1 Porsi: 100gr Nasi'
    }, {
      id: 'protein-hewani',
      icon: Beef,
      iconBg: '#fee2e2',
      iconColor: '#b45309',
      name: 'Protein Hewani',
      portions: 'Jumlah Porsi: 5 Porsi',
      sample: 'Contoh 1 Porsi: 50gr Ikan/Telur/Daging'
    }, {
      id: 'protein-nabati',
      icon: Soup,
      iconBg: '#cffafe',
      iconColor: '#0e7490',
      name: 'Protein Nabati',
      portions: 'Jumlah Porsi: 4 Porsi',
      sample: 'Contoh 1 Porsi: 50gr Tahu/Tempe'
    }, {
      id: 'sayur',
      icon: Leaf,
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
      name: 'Sayur-sayuran',
      portions: 'Jumlah Porsi: 5 Porsi',
      sample: 'Contoh 1 Porsi: 100gr Sayuran Masak'
    }, {
      id: 'buah',
      icon: Salad,
      iconBg: '#fee2e2',
      iconColor: '#c2410c',
      name: 'Buah-buahan',
      portions: 'Jumlah Porsi: 4 Porsi',
      sample: 'Contoh 1 Porsi: 100gr Buah Segar'
    }, {
      id: 'lemak',
      icon: Droplets,
      iconBg: '#e5e7eb',
      iconColor: '#4b5563',
      name: 'Minyak/Lemak',
      portions: 'Jumlah Porsi: 5 Porsi',
      sample: 'Contoh 1 Porsi: 5gr (1 sdt) Minyak'
    }, {
      id: 'gula',
      icon: Fish,
      iconBg: '#cffafe',
      iconColor: '#0284c7',
      name: 'Gula',
      portions: 'Jumlah Porsi: 2 Porsi',
      sample: 'Contoh 1 Porsi: 10gr (1 sdm) Gula'
    }]
  }
};
const tabs = [{
  key: 'trimester1',
  label: 'Trimester 1'
}, {
  key: 'trimester2',
  label: 'Trimester 2'
}, {
  key: 'menyusui',
  label: 'Ibu Menyusui'
}];
export default function GiziIbuTrimester1() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trimester1');
  const activeData = useMemo(() => nutritionByStage[activeTab], [activeTab]);
  return <section className="gizi-ibu-page">
      <div className="gizi-ibu-container">
        <div className="gizi-ibu-breadcrumb">
          <span onClick={() => navigate('/beranda')} className="gizi-ibu-breadcrumb-link">Beranda</span>
          <span className="gizi-ibu-breadcrumb-sep">›</span>
          <span className="gizi-ibu-breadcrumb-parent">Gizi</span>
          <span className="gizi-ibu-breadcrumb-sep">›</span>
          <span className="gizi-ibu-breadcrumb-current">Gizi Ibu</span>
        </div>

        <div className="gizi-hero gizi-ibu-hero">
          <div>
            <h1 className="gizi-ibu-title">
              {activeData.title}
            </h1>
            <p className="gizi-ibu-subtitle">
              {activeData.description}
            </p>
          </div>

          <div className="gizi-ibu-tabs">
            {tabs.map(tab => <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className={activeTab === tab.key ? "gizi-ibu-tab-btn gizi-ibu-tab-btn--active" : "gizi-ibu-tab-btn gizi-ibu-tab-btn--inactive"}>
                {tab.label}
              </button>)}
          </div>
        </div>

        <div className="gizi-grid gizi-ibu-grid">
          {activeData.items.map((item, idx) => {
          const Icon = item.icon;
          const fullWidth = idx === activeData.items.length - 1;
          return <article key={item.id} className={fullWidth ? "gizi-ibu-card gizi-ibu-card--full" : "gizi-ibu-card gizi-ibu-card--half"} onClick={() => navigate(`/gizi-ibu-trimester1/${activeTab}/${item.id}`)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && navigate(`/gizi-ibu-trimester1/${activeTab}/${item.id}`)}>
                <div className={`gizi-ibu-icon gizi-ibu-icon-${item.id}`}>
                  <Icon size={24} />
                </div>

                <div>
                  <h2 className="gizi-ibu-card-title">{item.name}</h2>
                  <p className="gizi-ibu-card-portion">🍴 {item.portions}</p>
                  <p className="gizi-ibu-card-sample">🧿 {item.sample}</p>
                </div>
              </article>;
        })}
        </div>

        <aside className="gizi-ibu-tip">
          <div className="gizi-ibu-tip-content">
            <span className="gizi-ibu-breadcrumb0">
              EXPERT TIP
            </span>
            <h3 className="gizi-ibu-breadcrumb1">{activeData.tipTitle}</h3>
            <p className="gizi-ibu-breadcrumb2">{activeData.tipText}</p>
          </div>
        </aside>
      </div>

    </section>;
}

