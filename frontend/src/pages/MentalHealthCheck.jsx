import { useState } from 'react'
import useAuthStore from '../store/authStore'
import healthApi from '../lib/healthApi'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

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
      const { data } = await healthApi.post('/mental-health/predict', payload)
      setResult(data)
      toast.success('Hasil analisis sukses diterima')
    } catch (err) {
      toast.error(err.response?.data?.detail || err.message || 'Gagal memproses')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: '#f9f6ff' }}>
      <div className="container" style={{ maxWidth: 860, padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 700, marginBottom: '0.75rem' }}>Cek Kesehatan Mental Ibu</h1>
        <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
          Hai {user?.user_metadata?.full_name || 'Ibu'}, isi kuisioner ini dengan jujur. Hasil adalah rekomendasi bukan diagnosis medis.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          {questions.map((q, i) => (
            <div key={i} style={{ padding: '1rem', background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>{i + 1}. {q}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[0, 1, 2, 3].map((v) => (
                  <label key={v} style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={v}
                      checked={answers[i] === v}
                      onChange={() => handleChange(i, v)}
                      style={{ marginRight: '0.25rem' }}
                    />
                    {v}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button type="submit" disabled={loading} className="btn" style={{ width: 'fit-content', marginTop: '0.5rem' }}>
            {loading ? 'Proses...' : 'Periksa Sekarang'}
          </button>
        </form>

        {result && (
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'white', borderLeft: '4px solid #8b5cf6', borderRadius: '0.75rem', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Hasil: {result.label.toUpperCase()}</h2>
            <p>Skor stres: {(result.score * 100).toFixed(1)}%</p>
            <p>{result.advice}</p>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              Catatan: Layanan ini hanya sebagai gambaran awal. Untuk kondisi berat, konsultasi klinis diperlukan.
            </p>
            <Link to="/profil" className="btn" style={{ marginTop: '0.5rem' }}>Lihat Profil</Link>
          </div>
        )}
      </div>
    </div>
  )
}
