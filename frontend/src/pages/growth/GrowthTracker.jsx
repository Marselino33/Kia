import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Plus } from 'lucide-react';
import '../../styles/pages/growth-growth-tracker.css'

export default function GrowthTracker() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    headCircumference: '',
    notes: '',
  });

  // Sample data
  const sampleRecords = [
    {
      id: 1,
      date: '2024-01-10',
      weight: 6.2,
      height: 62.5,
      headCircumference: 40.5,
      notes: 'Bayi sehat dan aktif',
    },
    {
      id: 2,
      date: '2024-01-03',
      weight: 6.0,
      height: 62.0,
      headCircumference: 40.0,
      notes: 'Pemeriksa rutin 1 minggu',
    },
    {
      id: 3,
      date: '2023-12-27',
      weight: 5.8,
      height: 61.5,
      headCircumference: 39.5,
      notes: 'Pemeriksa hari ke-5',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setRecords(sampleRecords);
      setLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddRecord = (e) => {
    e.preventDefault();
    const newRecord = {
      id: records.length + 1,
      ...formData,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      headCircumference: parseFloat(formData.headCircumference),
    };
    setRecords([newRecord, ...records]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      height: '',
      headCircumference: '',
      notes: '',
    });
    setShowAddModal(false);
  };

  const getWeightTrend = () => {
    if (records.length < 2) return null;
    const latest = records[0].weight;
    const previous = records[1].weight;
    const diff = latest - previous;
    return { diff, trend: diff > 0 ? 'up' : 'down' };
  };

  const trend = getWeightTrend();

  return (
    <main className="growth-tracker-page">
      <div className="growth-tracker-container">
        <div className="growth-tracker-header">
          <h1 className="growth-tracker-title">Pencatat Tumbuh Kembang</h1>
          <p className="growth-tracker-subtitle">
            Pantau perkembangan berat badan, tinggi badan, dan lingkar kepala anak Anda
          </p>
        </div>

        <div className="growth-tracker-add-wrap">
          <button onClick={() => setShowAddModal(true)} className="growth-tracker-add-btn" type="button">
            <Plus size={20} />
            Tambah Pencatatan
          </button>
        </div>

        {records.length > 0 && (
          <div className="growth-tracker-stats-grid">
            <div className="growth-tracker-stat-card">
              <div className="growth-tracker-stat-label">Berat Badan</div>
              <div className="growth-tracker-stat-value">{records[0].weight} kg</div>
              {trend && (
                <div className={`growth-tracker-trend ${trend.diff > 0 ? 'is-up' : 'is-down'}`}>
                  <TrendingUp size={16} className={`growth-tracker-trend-icon ${trend.diff > 0 ? 'is-up' : 'is-down'}`} />
                  {trend.diff > 0 ? '+' : ''}{trend.diff.toFixed(1)} kg
                </div>
              )}
            </div>

            <div className="growth-tracker-stat-card">
              <div className="growth-tracker-stat-label">Tinggi Badan</div>
              <div className="growth-tracker-stat-value">{records[0].height} cm</div>
              {records.length > 1 && (
                <div className="growth-tracker-stat-diff">
                  +{(records[0].height - records[1].height).toFixed(1)} cm
                </div>
              )}
            </div>

            <div className="growth-tracker-stat-card">
              <div className="growth-tracker-stat-label">Lingkar Kepala</div>
              <div className="growth-tracker-stat-value">{records[0].headCircumference} cm</div>
              {records.length > 1 && (
                <div className="growth-tracker-stat-diff">
                  +{(records[0].headCircumference - records[1].headCircumference).toFixed(1)} cm
                </div>
              )}
            </div>
          </div>
        )}

        <div className="growth-tracker-history-card">
          <div className="growth-tracker-history-header">
            <h2 className="growth-tracker-history-title">Riwayat Pencatatan</h2>
          </div>
          {loading ? (
            <div className="growth-tracker-state">Memuat data...</div>
          ) : records.length === 0 ? (
            <div className="growth-tracker-state">
              <p>Belum ada pencatatan. Mulai dengan menambahkan data pertama Anda.</p>
            </div>
          ) : (
            <div>
              {records.map((record, index) => (
                <div
                  key={record.id}
                  className={`growth-tracker-record-row ${index !== records.length - 1 ? 'with-border' : ''}`}
                >
                  <div>
                    <div className="growth-tracker-record-date">
                      <Calendar size={16} />
                      {new Date(record.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  <div className="growth-tracker-measure-grid">
                    <div>
                      <div className="growth-tracker-measure-label">Berat</div>
                      <div className="growth-tracker-measure-value">{record.weight} kg</div>
                    </div>
                    <div>
                      <div className="growth-tracker-measure-label">Tinggi</div>
                      <div className="growth-tracker-measure-value">{record.height} cm</div>
                    </div>
                    <div>
                      <div className="growth-tracker-measure-label">Lingkar Kepala</div>
                      <div className="growth-tracker-measure-value">{record.headCircumference} cm</div>
                    </div>
                  </div>

                  {record.notes && (
                    <div title={record.notes} className="growth-tracker-note-icon">
                      💬
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="growth-tracker-modal-overlay">
          <div className="growth-tracker-modal-card">
            <h2 className="growth-tracker-modal-title">Tambah Pencatatan Baru</h2>
            <form onSubmit={handleAddRecord}>
              <div className="growth-tracker-form-group">
                <label className="growth-tracker-label">Tanggal</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="growth-tracker-input"
                />
              </div>

              <div className="growth-tracker-form-group">
                <label className="growth-tracker-label">Berat Badan (kg)</label>
                <input
                  type="number"
                  name="weight"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="6.5"
                  required
                  className="growth-tracker-input"
                />
              </div>

              <div className="growth-tracker-form-group">
                <label className="growth-tracker-label">Tinggi Badan (cm)</label>
                <input
                  type="number"
                  name="height"
                  step="0.1"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="63.5"
                  required
                  className="growth-tracker-input"
                />
              </div>

              <div className="growth-tracker-form-group">
                <label className="growth-tracker-label">Lingkar Kepala (cm)</label>
                <input
                  type="number"
                  name="headCircumference"
                  step="0.1"
                  value={formData.headCircumference}
                  onChange={handleInputChange}
                  placeholder="41.0"
                  required
                  className="growth-tracker-input"
                />
              </div>

              <div className="growth-tracker-form-group growth-tracker-form-group-notes">
                <label className="growth-tracker-label">Catatan (Opsional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Tambahkan catatan penting..."
                  rows="3"
                  className="growth-tracker-textarea"
                />
              </div>

              <div className="growth-tracker-form-actions">
                <button type="submit" className="growth-tracker-save-btn">Simpan</button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="growth-tracker-cancel-btn"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
