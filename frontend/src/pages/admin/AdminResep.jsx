import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, ChefHat } from 'lucide-react'
import AdminLayout, { AdminPageHeader, AdminCard, AdminModal, AdminInput, tableStyle, thStyle, tdStyle } from './AdminLayout'
import adminApi from '../../lib/adminApi'
import toast from 'react-hot-toast'

const EMPTY = { nama: '', slug: '', deskripsi: '', kategori: '', usia_kategori: '', durasi_menit: 30, kalori: 0, bahan: '', langkah: '', nutrisi: '', gambar_url: '', is_published: true }
const KATEGORI = ['MPASI', 'Ibu Hamil', 'Ibu Menyusui', 'Balita', 'Keluarga']

export default function AdminResep() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)

    const fetchData = () => {
        setLoading(true)
        adminApi.get('/admin/resep-gizi')
            .then(r => setList(r.data?.data || []))
            .catch(() => toast.error('Gagal memuat resep'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchData() }, [])

    const openCreate = () => { setForm(EMPTY); setSelected(null); setModal('create') }
    const openEdit = (item) => {
        setForm({ nama: item.nama, slug: item.slug, deskripsi: item.deskripsi || '', kategori: item.kategori || '', usia_kategori: item.usia_kategori || '', durasi_menit: item.durasi_menit || 30, kalori: item.kalori || 0, bahan: item.bahan || '', langkah: item.langkah || '', nutrisi: item.nutrisi || '', gambar_url: item.gambar_url || '', is_published: item.is_published !== false })
        setSelected(item); setModal('edit')
    }
    const openDelete = (item) => { setSelected(item); setModal('delete') }
    const closeModal = () => { setModal(null); setSelected(null) }
    const setF = (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setForm(p => ({ ...p, [e.target.name]: val }))
    }

    const autoSlug = (n) => n.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')

    const handleSave = async (e) => {
        e.preventDefault()
        if (!form.nama || !form.slug) { toast.error('Nama dan slug wajib diisi'); return }
        setSaving(true)
        try {
            const payload = { ...form, durasi_menit: parseInt(form.durasi_menit) || 0, kalori: parseInt(form.kalori) || 0 }
            if (modal === 'create') {
                await adminApi.post('/admin/resep-gizi', payload)
                toast.success('Resep berhasil ditambahkan')
            } else {
                await adminApi.put(`/admin/resep-gizi/${selected.id}`, payload)
                toast.success('Resep berhasil diperbarui')
            }
            closeModal(); fetchData()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menyimpan')
        } finally { setSaving(false) }
    }

    const handleDelete = async () => {
        setSaving(true)
        try {
            await adminApi.delete(`/admin/resep-gizi/${selected.id}`)
            toast.success('Resep berhasil dihapus')
            closeModal(); fetchData()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menghapus')
        } finally { setSaving(false) }
    }

    const filtered = list.filter(r => r.nama?.toLowerCase().includes(search.toLowerCase()))

    return (
        <AdminLayout>
            <AdminPageHeader title="Manajemen Resep Gizi" subtitle={`${list.length} resep`}
                action={<button onClick={openCreate} style={btnP}><Plus size={16} /> Tambah Resep</button>} />
            <div style={{ padding: '2rem' }}>
                <AdminCard>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <Search size={16} color="#94a3b8" />
                        <input type="text" placeholder="Cari nama resep..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '0.875rem', flex: 1 }} />
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        {loading ? <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Memuat...</div>
                            : filtered.length === 0 ? <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}><ChefHat size={32} /><p>Tidak ada resep</p></div>
                                : <table style={tableStyle}>
                                    <thead><tr>
                                        <th style={thStyle}>Nama Resep</th>
                                        <th style={thStyle}>Kategori</th>
                                        <th style={thStyle}>Usia</th>
                                        <th style={thStyle}>Durasi</th>
                                        <th style={thStyle}>Kalori</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>Aksi</th>
                                    </tr></thead>
                                    <tbody>
                                        {filtered.map(r => (
                                            <tr key={r.id}>
                                                <td style={tdStyle}><strong>{r.nama}</strong></td>
                                                <td style={tdStyle}>{r.kategori || '-'}</td>
                                                <td style={tdStyle}>{r.usia_kategori || '-'}</td>
                                                <td style={tdStyle}>{r.durasi_menit} menit</td>
                                                <td style={tdStyle}>{r.kalori} kkal</td>
                                                <td style={tdStyle}>
                                                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: r.is_published !== false ? '#10b98120' : '#94a3b820', color: r.is_published !== false ? '#10b981' : '#94a3b8', border: `1px solid ${r.is_published !== false ? '#10b98140' : '#94a3b840'}` }}>
                                                        {r.is_published !== false ? 'Publik' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                        <button onClick={() => openEdit(r)} style={btnE}><Pencil size={14} /></button>
                                                        <button onClick={() => openDelete(r)} style={btnD}><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>}
                    </div>
                </AdminCard>
            </div>

            <AdminModal open={modal === 'create' || modal === 'edit'} onClose={closeModal} title={modal === 'create' ? 'Tambah Resep' : 'Edit Resep'} width={640}>
                <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                        <div style={{ gridColumn: '1/-1' }}>
                            <AdminInput label="Nama Resep" name="nama" value={form.nama} required onChange={e => { setF(e); if (!selected) setForm(p => ({ ...p, slug: autoSlug(e.target.value) })) }} placeholder="Nama resep" />
                        </div>
                        <AdminInput label="Slug" name="slug" value={form.slug} required onChange={setF} placeholder="nama-resep" />
                        <AdminInput label="Kategori" name="kategori" type="select" value={form.kategori} onChange={setF}>
                            <option value="">-- Pilih --</option>
                            {KATEGORI.map(k => <option key={k} value={k}>{k}</option>)}
                        </AdminInput>
                        <AdminInput label="Usia Kategori" name="usia_kategori" value={form.usia_kategori} onChange={setF} placeholder="Contoh: 6-8 bulan" />
                        <AdminInput label="Durasi (menit)" name="durasi_menit" type="number" value={form.durasi_menit} onChange={setF} min={0} />
                        <AdminInput label="Kalori (kkal)" name="kalori" type="number" value={form.kalori} onChange={setF} min={0} />
                        <div style={{ gridColumn: '1/-1' }}>
                            <AdminInput label="Deskripsi" name="deskripsi" type="textarea" value={form.deskripsi} onChange={setF} placeholder="Deskripsi singkat resep" />
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <AdminInput label="Bahan-bahan" name="bahan" type="textarea" value={form.bahan} onChange={setF} placeholder="Daftar bahan..." />
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <AdminInput label="Langkah Pembuatan" name="langkah" type="textarea" value={form.langkah} onChange={setF} placeholder="1. Langkah pertama..." />
                        </div>
                        <AdminInput label="Info Nutrisi" name="nutrisi" value={form.nutrisi} onChange={setF} placeholder="Protein: 10g..." />
                        <AdminInput label="URL Gambar" name="gambar_url" value={form.gambar_url} onChange={setF} placeholder="https://..." />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input type="checkbox" name="is_published" checked={form.is_published} onChange={setF} />
                        Publikasikan resep ini
                    </label>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={closeModal} style={btnC}>Batal</button>
                        <button type="submit" style={btnP} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </AdminModal>

            <AdminModal open={modal === 'delete'} onClose={closeModal} title="Hapus Resep" width={400}>
                <div style={{ padding: '1.5rem' }}>
                    <p style={{ color: '#475569', marginBottom: '1.5rem' }}>Hapus resep <strong>{selected?.nama}</strong>?</p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button onClick={closeModal} style={btnC}>Batal</button>
                        <button onClick={handleDelete} style={btnX} disabled={saving}>{saving ? 'Menghapus...' : 'Hapus'}</button>
                    </div>
                </div>
            </AdminModal>
        </AdminLayout>
    )
}

const btnP = { display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }
const btnE = { padding: '0.4rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.4rem', cursor: 'pointer', color: '#0ea5e9', display: 'flex' }
const btnD = { padding: '0.4rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.4rem', cursor: 'pointer', color: '#ef4444', display: 'flex' }
const btnC = { padding: '0.6rem 1.25rem', background: 'white', border: '1px solid #d1d5db', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }
const btnX = { padding: '0.6rem 1.25rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }
