export const mentalContents = [
  {
    slug: 'baby-blues',
    title: 'Mengenal Baby Blues pada Ibu Baru',
    category: 'EDUKASI',
    readTime: '6 menit baca',
    excerpt: 'Baby blues umum terjadi setelah melahirkan. Kenali gejala awal agar ibu mendapatkan dukungan yang tepat.',
    image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=1200&q=80',
    quote: 'Perubahan emosi setelah melahirkan adalah hal yang nyata, dan ibu berhak mendapat ruang aman untuk pulih.',
    intro: 'Baby blues biasanya muncul pada minggu pertama setelah persalinan. Kondisi ini ditandai perubahan mood, mudah menangis, mudah cemas, dan cepat lelah. Meskipun sering membaik sendiri, dukungan keluarga sangat menentukan pemulihan emosi ibu.',
    signs: [
      'Mood mudah berubah dalam waktu singkat',
      'Menangis tanpa alasan yang jelas',
      'Merasa cemas berlebihan tentang bayi',
      'Sulit fokus dan mudah merasa kewalahan'
    ],
    actions: [
      'Pastikan ibu mendapat waktu istirahat bergantian dengan pasangan atau keluarga',
      'Validasi perasaan ibu, hindari menyalahkan atau meremehkan emosinya',
      'Bantu pekerjaan rumah agar ibu bisa fokus pada pemulihan',
      'Dorong ibu berbagi cerita pada orang yang dipercaya'
    ],
    consultWhen: [
      'Gejala tidak membaik setelah 2 minggu',
      'Ibu mulai kehilangan minat merawat diri atau bayi',
      'Muncul pikiran melukai diri sendiri atau bayi'
    ]
  },
  {
    slug: 'postpartum-depression',
    title: 'Depresi Setelah Melahirkan (PPD)',
    category: 'KESEHATAN',
    readTime: '8 menit baca',
    excerpt: 'Postpartum Depression lebih berat dari baby blues dan perlu penanganan tenaga profesional.',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
    quote: 'Mencari bantuan profesional bukan tanda lemah, melainkan langkah berani untuk pulih.',
    intro: 'PPD adalah kondisi depresi yang dapat terjadi pada ibu setelah melahirkan. Gejala dapat mengganggu aktivitas harian, relasi keluarga, dan ikatan ibu-bayi. Penanganan dini membantu mencegah komplikasi jangka panjang bagi ibu maupun anak.',
    signs: [
      'Sedih mendalam dan menetap hampir setiap hari',
      'Kehilangan minat pada aktivitas yang sebelumnya disukai',
      'Gangguan tidur berat meski bayi sedang tidur',
      'Perasaan bersalah, tidak berharga, atau putus asa'
    ],
    actions: [
      'Konsultasi ke dokter atau psikolog untuk evaluasi menyeluruh',
      'Libatkan pasangan/keluarga sebagai sistem dukungan harian',
      'Ikuti terapi sesuai rekomendasi profesional',
      'Jaga pola makan, hidrasi, dan rutinitas tidur semampunya'
    ],
    consultWhen: [
      'Gejala berlangsung lebih dari 2 minggu dan memburuk',
      'Ibu sulit menjalankan fungsi dasar sehari-hari',
      'Muncul pikiran menyakiti diri sendiri'
    ]
  },
  {
    slug: 'burnout-pengasuhan',
    title: 'Burnout Pengasuhan pada Orang Tua',
    category: 'TIPS',
    readTime: '7 menit baca',
    excerpt: 'Burnout pengasuhan membuat orang tua merasa lelah fisik dan emosional secara berkepanjangan.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=80',
    quote: 'Orang tua yang terjaga kesehatannya akan lebih mampu hadir secara utuh untuk anak.',
    intro: 'Burnout terjadi saat beban pengasuhan menumpuk tanpa jeda pemulihan. Kondisi ini dapat memengaruhi kualitas interaksi dengan anak, hubungan pasangan, dan kesehatan mental orang tua. Pencegahan dimulai dari pembagian peran dan self-care yang realistis.',
    signs: [
      'Mudah marah, sensitif, atau cepat tersulut emosi',
      'Merasa kosong dan tidak berenergi setiap hari',
      'Menarik diri dari pasangan, keluarga, atau lingkungan sosial',
      'Kehilangan rasa percaya diri sebagai orang tua'
    ],
    actions: [
      'Buat jadwal istirahat mikro 10-15 menit setiap hari',
      'Bagi tugas pengasuhan secara jelas dengan pasangan/keluarga',
      'Turunkan standar perfeksionisme dalam pengasuhan',
      'Cari bantuan komunitas atau konselor parenting bila perlu'
    ],
    consultWhen: [
      'Kelelahan emosional terasa terus-menerus selama berminggu-minggu',
      'Konflik keluarga meningkat dan sulit dikendalikan',
      'Muncul gejala cemas/depresi yang mengganggu fungsi harian'
    ]
  }
]

export function getMentalContentBySlug(slug) {
  return mentalContents.find((item) => item.slug === slug)
}
