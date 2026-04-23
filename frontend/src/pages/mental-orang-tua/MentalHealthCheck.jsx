import { useState } from 'react'
import useAuthStore from '../../store/authStore'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import '../../styles/pages/mental-health-check.css'

const questions = [
  'Saya merasa tidak mampu mengatasi tekanan hidup sehari-hari',
  'Saya merasa khawatir berlebihan tentang hal kecil',
  'Saya merasa cemas dan sulit tenang',
  'Saya merasa lelah tanpa alasan jelas',
  'Saya mudah marah atau tersinggung',
  'Saya tidak dapat tidur nyenyak karena pikiran yang mengganggu',
  'Saya kurang selera makan atau makan berlebihan',
  'Saya merasa tidak berharga atau bersalah',
  'Saya lebih suka menyendiri dibanding berinteraksi',
  'Saya merasa terbebani sebagai ibu dari anak saya',
]

export default function MentalHealthCheck() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(0))
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const { user } = useAuthStore()

  const handleChange = (index, value) => {
    const newAnswers = [...answers]
    newAnswers[index] = Number(value)
    setAnswers(newAnswers)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const payload = answers.reduce((acc, val, idx) => {
      acc[`q${idx + 1}`] = val
      return acc
    }, {})

    try {
      const { data } = await api.post('/mental-health/predict', payload)
      setResult(data?.data ?? data)
      toast.success('Hasil analisis sukses diterima')
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.detail || err.message || 'Gagal memproses')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mh-check-page">
      <div className="container mh-check-container">
        <h1 className="mh-check-title">Cek Kesehatan Mental Ibu</h1>
        <p className="mh-check-intro">
          Hai {user?.user_metadata?.full_name || 'Ibu'}, isi kuisioner ini dengan jujur. Hasil adalah rekomendasi bukan diagnosis medis.
        </p>

        <form onSubmit={handleSubmit} className="mh-check-form">
          {questions.map((q, i) => (
            <div key={i} className="mh-check-question-card">
              <p className="mh-check-question">{i + 1}. {q}</p>
               <div className="mh-check-options">
                 {[0, 1, 2, 3, 4].map((v) => (
                   <label key={v} className="mh-check-option-label">
                     <input
                       type="radio"
                       name={`q${i}`}
                       value={v}
                       checked={answers[i] === v}
                       onChange={() => handleChange(i, v)}
                       className="mh-check-radio"
                     />
                     {v === 0 && 'Tidak pernah'}
                     {v === 1 && 'Hampir tidak pernah'}
                     {v === 2 && 'Kadang-kadang'}
                     {v === 3 && 'Cukup sering'}
                     {v === 4 && 'Sangat sering'}
                   </label>
                 ))}
              </div>
            </div>
          ))}

          <button type="submit" disabled={loading} className="btn mh-check-submit">
            {loading ? 'Proses...' : 'Periksa Sekarang'}
          </button>
        </form>

        {result && (
          <div className="mh-check-result">
            {/* Level Stres (3-class) */}
            <h2 className={`mh-check-result-title mh-level-${result.label.toLowerCase()}`}>
              {result.label === 'RENDAH' && '✅ Stres Rendah'}
              {result.label === 'SEDANG' && '⚠️ Stres Sedang'}
              {result.label === 'TINGGI' && '🚨 Stres Tinggi'}
            </h2>

            {/* Skor Total & Confidence */}
            <div className="mh-score-section">
              <div className="mh-score-item">
                <span className="mh-score-label">Skor Kesehatan Mental:</span>
                <span className="mh-score-value">{result.skor_total} / 40</span>
              </div>
              <div className="mh-score-item">
                <span className="mh-score-label">Tingkat Keyakinan Model:</span>
                <span className="mh-score-value">{(result.score * 100).toFixed(1)}%</span>
              </div>
              {result.is_fallback && (
                <div className="mh-fallback-warning">
                  ⚠️ Hasil didasarkan pada aturan (keyakinan rendah)
                </div>
              )}
            </div>

            {/* Progress Bar untuk skor_total (0-40) */}
            <div className="mh-score-bar-container">
              <div
                className={`mh-score-bar mh-score-${result.label.toLowerCase()}`}
                style={{ width: `${Math.min((result.skor_total / 40) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="mh-score-markers">
              <span>0</span><span>10</span><span>20</span><span>30</span><span>40</span>
            </div>

            {/* Detail Probabilitas (optional - bisa ditoggle) */}
            <div className="mh-probabilities">
              <p className="mh-prob-title">Probabilitas Per Kelas:</p>
              <div className="mh-prob-bars">
                {Object.entries(result.probabilities || {}).map(([label, prob]) => (
                  <div key={label} className="mh-prob-item">
                    <span className="mh-prob-label">{label}</span>
                    <div className="mh-prob-bar-bg">
                      <div 
                        className={`mh-prob-bar mh-prob-${label.toLowerCase()}`}
                        style={{ width: `${prob * 100}%` }}
                      ></div>
                    </div>
                    <span className="mh-prob-value">{(prob * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice */}
            <p className="mh-check-advice">{result.advice}</p>

            {/* Catatan & CTA */}
            <p className="mh-check-note">
              Catatan: Layanan ini hanya sebagai gambaran awal. Untuk kondisi berat, konsultasi klinis diperlukan.
            </p>
            <Link to="/profil" className="btn mh-check-profile-link">
              Lihat Profil & Riwayat
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
