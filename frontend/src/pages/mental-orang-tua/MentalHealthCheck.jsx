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
                {[0, 1, 2, 3].map((v) => (
                  <label key={v} className="mh-check-option-label">
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={v}
                      checked={answers[i] === v}
                      onChange={() => handleChange(i, v)}
                      className="mh-check-radio"
                    />
                    {v}
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
            <h2 className="mh-check-result-title">Hasil: {result.label.toUpperCase()}</h2>
            <p>Skor stres: {(result.score * 100).toFixed(1)}%</p>
            <p>{result.advice}</p>
            <p className="mh-check-note">
              Catatan: Layanan ini hanya sebagai gambaran awal. Untuk kondisi berat, konsultasi klinis diperlukan.
            </p>
            <Link to="/profil" className="btn mh-check-profile-link">Lihat Profil</Link>
          </div>
        )}
      </div>
    </div>
  )
}
