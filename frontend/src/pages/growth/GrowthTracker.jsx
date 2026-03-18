import { useState, useEffect } from 'react'
import { TrendingUp, Plus, Baby, X, BarChart2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import api from '../../lib/api'
import toast from 'react-hot-toast'

const WHO_WEIGHT_BOYS = [
    { age: '0', p3: 2.5, p50: 3.3, p97: 4.4 },
    { age: '3', p3: 5.0, p50: 6.4, p97: 7.9 },
    { age: '6', p3: 6.4, p50: 7.9, p97: 9.7 },
    { age: '9', p3: 7.5, p50: 9.2, p97: 11.0 },
    { age: '12', p3: 8.1, p50: 9.6, p97: 11.5 },
]

const WHO_WEIGHT_GIRLS = [
    { age: '0', p3: 2.4, p50: 3.2, p97: 4.2 },
    { age: '3', p3: 4.6, p50: 5.8, p97: 7.3 },
    { age: '6', p3: 5.8, p50: 7.3, p97: 9.2 },
    { age: '9', p3: 6.8, p50: 8.5, p97: 10.7 },
    { age: '12', p3: 7.4, p50: 9.2, p97: 11.5 },
]

const sampleChildren = [
    { id: 1, name: 'Andika', gender: 'male', dob: '2024-06-15', birthWeight: 3.2 },
]

const sampleRecords = [
    { id: 1, childId: 1, date: '2024-06-15', ageMonths: 0, weight: 3.2, height: 50, headCirc: 34 },
    { id: 2, childId: 1, date: '2024-09-15', ageMonths: 3, weight: 6.1, height: 60, headCirc: 40 },
    { id: 3, childId: 1, date: '2024-12-15', ageMonths: 6, weight: 7.5, height: 67, headCirc: 43 },
]

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.8rem' }}>
            <p style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Usia {label} bulan</p>
            {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value} {p.name === 'Berat' ? 'kg' : 'cm'}</p>)}
        </div>
    )
    return null
}

export default function GrowthTracker() {
    const [children, setChildren] = useState(sampleChildren)
    const [selected, setSelected] = useState(sampleChildren[0])
    const [records, setRecords] = useState(sampleRecords)
    const [showAddChild, setShowAddChild] = useState(false)
    const [showAddRecord, setShowAddRecord] = useState(false)
    const [childForm, setChildForm] = useState({ name: '', gender: 'male', dob: '', birthWeight: '' })
    const [recordForm, setRecordForm] = useState({ date: new Date().toISOString().slice(0, 10), weight: '', height: '', headCirc: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        api.get('/anak').then(r => { if (r.data?.data?.length) setChildren(r.data.data) }).catch(() => { })
    }, [])

    useEffect(() => {
        if (!selected) return
        api.get(`/anak/${selected.id}/riwayat`).then(r => { if (r.data?.data?.length) setRecords(r.data.data) }).catch(() => { })
    }, [selected])

    const addChild = async () => {
        if (!childForm.name || !childForm.dob) { toast.error('Isi nama dan tanggal lahir'); return }
        setSaving(true)
        try {
            const r = await api.post('/anak', childForm)
            const c = r.data || { ...childForm, id: Date.now() }
            setChildren(prev => [...prev, c])
            setSelected(c)
            setShowAddChild(false)
            setChildForm({ name: '', gender: 'male', dob: '', birthWeight: '' })
            toast.success('Data anak berhasil ditambahkan!')
        } catch {
            const c = { ...childForm, id: Date.now(), birthWeight: parseFloat(childForm.birthWeight) }
            setChildren(prev => [...prev, c]); setSelected(c); setShowAddChild(false)
        } finally { setSaving(false) }
    }

    const addRecord = async () => {
        if (!recordForm.weight || !recordForm.height) { toast.error('Isi berat dan tinggi badan'); return }
        setSaving(true)
        const dobDate = selected?.dob ? new Date(selected.dob) : new Date()
        const recDate = new Date(recordForm.date)
        const ageMonths = Math.round((recDate - dobDate) / (1000 * 60 * 60 * 24 * 30.44))
        try {
            await api.post(`/anak/${selected.id}/riwayat`, { ...recordForm, ageMonths })
        } catch { }
        setRecords(prev => [...prev, { id: Date.now(), childId: selected.id, ...recordForm, ageMonths, weight: parseFloat(recordForm.weight), height: parseFloat(recordForm.height) }])
        setShowAddRecord(false)
        setRecordForm({ date: new Date().toISOString().slice(0, 10), weight: '', height: '', headCirc: '' })
        toast.success('Data pertumbuhan berhasil disimpan!')
        setSaving(false)
    }

    const selectedRecords = records.filter(r => r.childId === selected?.id).sort((a, b) => a.ageMonths - b.ageMonths)
    const latestRecord = selectedRecords[selectedRecords.length - 1]
    const whoData = selected?.gender === 'female' ? WHO_WEIGHT_GIRLS : WHO_WEIGHT_BOYS

    const chartData = selectedRecords.map(r => ({ age: String(r.ageMonths), 'Berat (kg)': r.weight, 'Tinggi (cm)': r.height }))

    return (
        <div style={{ paddingTop: 72 }}>
            <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '2rem 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', fontWeight: 700 }}>
                            <Baby size={22} style={{ display: 'inline', marginRight: '0.4rem', color: '#14b8a6', verticalAlign: 'middle' }} />
                            Tracker Tumbuh Kembang
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9rem' }}>Pantau pertumbuhan anak dengan grafik standar WHO</p>
                    </div>
                    <button onClick={() => setShowAddChild(true)} className="btn btn-primary btn-sm"><Plus size={15} /> Tambah Anak</button>
                </div>
            </div>

            <div className="container" style={{ paddingBlock: '2rem' }}>
                {/* Child Tabs */}
                {children.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        {children.map(c => (
                            <button key={c.id} onClick={() => setSelected(c)} style={{
                                padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                                background: selected?.id === c.id ? 'linear-gradient(135deg, #14b8a6, #8b5cf6)' : 'rgba(255,255,255,0.06)',
                                border: selected?.id === c.id ? 'none' : '1px solid var(--border-color)',
                                color: selected?.id === c.id ? 'white' : 'var(--text-secondary)',
                            }}>
                                {c.gender === 'female' ? '👧' : '👦'} {c.name}
                            </button>
                        ))}
                    </div>
                )}

                {selected ? (
                    <>
                        {/* Latest Stats */}
                        {latestRecord && (
                            <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
                                {[
                                    { label: 'Berat Badan', value: `${latestRecord.weight} kg`, icon: '⚖️', color: '#14b8a6' },
                                    { label: 'Tinggi Badan', value: `${latestRecord.height} cm`, icon: '📏', color: '#8b5cf6' },
                                    { label: 'Lingkar Kepala', value: latestRecord.headCirc ? `${latestRecord.headCirc} cm` : '-', icon: '🧠', color: '#ec4899' },
                                ].map(({ label, value, icon, color }) => (
                                    <div key={label} className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ fontSize: '1.75rem' }}>{icon}</div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.25rem', color }}>{value}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Chart */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <h2 style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <BarChart2 size={16} color="#14b8a6" /> Grafik Pertumbuhan
                                </h2>
                                <button onClick={() => setShowAddRecord(true)} className="btn btn-primary btn-sm"><Plus size={13} /> Catat Pengukuran</button>
                            </div>
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                        <XAxis dataKey="age" stroke="var(--text-muted)" fontSize={12} label={{ value: 'Usia (bulan)', position: 'insideBottom', offset: -2, fill: 'var(--text-muted)', fontSize: 11 }} />
                                        <YAxis yAxisId="weight" stroke="var(--text-muted)" fontSize={12} />
                                        <YAxis yAxisId="height" orientation="right" stroke="var(--text-muted)" fontSize={12} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '0.5rem' }} />
                                        <Line yAxisId="weight" type="monotone" dataKey="Berat (kg)" stroke="#14b8a6" strokeWidth={2.5} dot={{ fill: '#14b8a6', r: 4 }} activeDot={{ r: 6 }} />
                                        <Line yAxisId="height" type="monotone" dataKey="Tinggi (cm)" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: '0.75rem' }}>
                                    <TrendingUp size={36} style={{ opacity: 0.3 }} />
                                    <p style={{ fontSize: '0.875rem' }}>Belum ada data pengukuran. Klik "Catat Pengukuran" untuk mulai.</p>
                                </div>
                            )}
                        </div>

                        {/* Records Table */}
                        {selectedRecords.length > 0 && (
                            <div className="glass-card" style={{ padding: '1.5rem' }}>
                                <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Riwayat Pengukuran</h2>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                {['Tanggal', 'Usia', 'Berat (kg)', 'Tinggi (cm)', 'Lingkar Kepala'].map(h => (
                                                    <th key={h} style={{ padding: '0.6rem 0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedRecords.map(r => (
                                                <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{r.date}</td>
                                                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{r.ageMonths} bulan</td>
                                                    <td style={{ padding: '0.75rem', fontWeight: 600, color: '#14b8a6' }}>{r.weight}</td>
                                                    <td style={{ padding: '0.75rem', fontWeight: 600, color: '#8b5cf6' }}>{r.height}</td>
                                                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{r.headCirc || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <Baby size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                        <p>Tambahkan data anak untuk mulai memantau tumbuh kembangnya.</p>
                        <button onClick={() => setShowAddChild(true)} className="btn btn-primary" style={{ marginTop: '1rem' }}><Plus size={15} /> Tambah Anak</button>
                    </div>
                )}
            </div>

            {/* Modal Add Child */}
            {showAddChild && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                    <div className="glass-card animate-slideUp" style={{ width: '100%', maxWidth: 400, padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontWeight: 700 }}>Tambah Data Anak</h2>
                            <button onClick={() => setShowAddChild(false)} style={{ background: 'none', color: 'var(--text-muted)', padding: 4 }}><X size={18} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group"><label className="form-label">Nama Anak</label><input className="form-input" value={childForm.name} onChange={e => setChildForm({ ...childForm, name: e.target.value })} placeholder="Nama anak" id="child-name" /></div>
                            <div className="form-group"><label className="form-label">Jenis Kelamin</label>
                                <select className="form-input" value={childForm.gender} onChange={e => setChildForm({ ...childForm, gender: e.target.value })} id="child-gender">
                                    <option value="male">Laki-laki</option><option value="female">Perempuan</option>
                                </select>
                            </div>
                            <div className="form-group"><label className="form-label">Tanggal Lahir</label><input type="date" className="form-input" value={childForm.dob} onChange={e => setChildForm({ ...childForm, dob: e.target.value })} id="child-dob" /></div>
                            <div className="form-group"><label className="form-label">Berat Lahir (kg)</label><input type="number" step="0.1" className="form-input" value={childForm.birthWeight} onChange={e => setChildForm({ ...childForm, birthWeight: e.target.value })} placeholder="3.2" id="child-birth-weight" /></div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowAddChild(false)} className="btn btn-secondary" style={{ flex: 1 }}>Batal</button>
                            <button onClick={addChild} className="btn btn-primary" style={{ flex: 1 }} disabled={saving} id="btn-add-child">
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Add Record */}
            {showAddRecord && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                    <div className="glass-card animate-slideUp" style={{ width: '100%', maxWidth: 400, padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontWeight: 700 }}>Catat Pengukuran</h2>
                            <button onClick={() => setShowAddRecord(false)} style={{ background: 'none', color: 'var(--text-muted)', padding: 4 }}><X size={18} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group"><label className="form-label">Tanggal Pengukuran</label><input type="date" className="form-input" value={recordForm.date} onChange={e => setRecordForm({ ...recordForm, date: e.target.value })} id="record-date" /></div>
                            <div className="form-group"><label className="form-label">Berat Badan (kg)</label><input type="number" step="0.1" className="form-input" value={recordForm.weight} onChange={e => setRecordForm({ ...recordForm, weight: e.target.value })} placeholder="6.5" id="record-weight" /></div>
                            <div className="form-group"><label className="form-label">Tinggi Badan (cm)</label><input type="number" step="0.1" className="form-input" value={recordForm.height} onChange={e => setRecordForm({ ...recordForm, height: e.target.value })} placeholder="65" id="record-height" /></div>
                            <div className="form-group"><label className="form-label">Lingkar Kepala (cm) — opsional</label><input type="number" step="0.1" className="form-input" value={recordForm.headCirc} onChange={e => setRecordForm({ ...recordForm, headCirc: e.target.value })} placeholder="42" id="record-head-circ" /></div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowAddRecord(false)} className="btn btn-secondary" style={{ flex: 1 }}>Batal</button>
                            <button onClick={addRecord} className="btn btn-primary" style={{ flex: 1 }} disabled={saving} id="btn-add-record">
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
