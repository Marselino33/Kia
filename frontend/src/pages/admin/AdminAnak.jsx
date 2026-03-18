import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, Baby } from 'lucide-react'
import AdminLayout, { AdminPageHeader, AdminCard, AdminModal, AdminInput, tableStyle, thStyle, tdStyle } from './AdminLayout'
import adminApi from '../../lib/adminApi'
import toast from 'react-hot-toast'

const EMPTY = { nama: '', tanggal_lahir: '', jenis_kelamin: 'L', pengguna_id: '' }

export default function AdminAnak() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)

    const fetchData = () => {
        setLoading(true)
        adminApi.get('/admin/anak')
            .then(r => setList(r.data?.data || []))
            .catch(() => toast.error('Gagal memuat data anak'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchData() }, [])

    const openCreate = () => { setForm(EMPTY); setSelected(null); setModal('create') }
    const openEdit = (item) => {
        setForm({ nama: item.nama, tanggal_lahir: item.tanggal_lahir?.split('T')[0] || '', jenis_kelamin: item.jenis_kelamin || 'L', pengguna_id: item.pengguna_id || '' })
        setSelected(item); setModal('edit')
    }
    const openDelete = (item) => { setSelected(item); setModal('delete') }
    const closeModal = () => { setModal(null); setSelected(null) }
    const setF = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

    const handleSave = async (e) => {
        e.preventDefault()
        if (!form.nama || !form.tanggal_lahir) { toast.error('Nama dan tanggal lahir wajib diisi'); return }
        setSaving(true)
        try {
            if (modal === 'create') {
                await adminApi.post('/admin/anak', form)
                toast.success('Data anak berhasil ditambahkan')
            } else {
                await adminApi.put(`/admin/anak/${selected.id}`, form)
                toast.success('Data anak berhasil diperbarui')
            }
            closeModal(); fetchData()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menyimpan')
        } finally { setSaving(false) }
    }

    const handleDelete = async () => {
        setSaving(true)
        try {
            await adminApi.delete(`/admin/anak/${selected.id}`)
            toast.success('Data anak berhasil dihapus')
            closeModal(); fetchData()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menghapus')
        } finally { setSaving(false) }
    }

    const filtered = list.filter(a => a.nama?.toLowerCase().includes(search.toLowerCase()))

    return (
        <AdminLayout>
            <AdminPageHeader title="Data Anak" subtitle={`${list.length} data anak`}
                action={<button onClick={openCreate} style={btnPrimary}><Plus size={16} /> Tambah Anak</button>} />
            <div style={{ padding: '2rem' }}>
                <AdminCard>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Search size={16} color="#94a3b8" />
                        <input type="text" placeholder="Cari nama anak..." value={search} onChange={e => setSearch(e.target.value)}
                            style={{ border: 'none', outline: 'none', fontSize: '0.875rem', flex: 1 }} />
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        {loading ? <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Memuat...</div>
                            : filtered.length === 0 ? <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}><Baby size={32} /><p>Tidak ada data</p></div>
                                : (
                                    <table style={tableStyle}>
                                        <thead><tr>
                                            <th style={thStyle}>Nama</th>
                                            <th style={thStyle}>Tanggal Lahir</th>
                                            <th style={thStyle}>Jenis Kelamin</th>
                                            <th style={thStyle}>Pengguna ID</th>
                                            <th style={{ ...thStyle, textAlign: 'right' }}>Aksi</th>
                                        </tr></thead>
                                        <tbody>
                                            {filtered.map(a => (
                                                <tr key={a.id}>
                                                    <td style={tdStyle}><strong>{a.nama}</strong></td>
                                                    <td style={tdStyle}>{a.tanggal_lahir?.split('T')[0] || '-'}</td>
                                                    <td style={tdStyle}>{a.jenis_kelamin === 'L' ? '👦 Laki-laki' : '👧 Perempuan'}</td>
                                                    <td style={{ ...tdStyle, fontSize: '0.75rem', color: '#94a3b8' }}>{a.pengguna_id || '-'}</td>
                                                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                            <button onClick={() => openEdit(a)} style={btnEdit}><Pencil size={14} /></button>
                                                            <button onClick={() => openDelete(a)} style={btnDel}><Trash2 size={14} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                    </div>
                </AdminCard>
            </div>

            <AdminModal open={modal === 'create' || modal === 'edit'} onClose={closeModal} title={modal === 'create' ? 'Tambah Data Anak' : 'Edit Data Anak'}>
                <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
                    <AdminInput label="Nama Anak" name="nama" value={form.nama} onChange={setF} required placeholder="Nama lengkap anak" />
                    <AdminInput label="Tanggal Lahir" name="tanggal_lahir" type="date" value={form.tanggal_lahir} onChange={setF} required />
                    <AdminInput label="Jenis Kelamin" name="jenis_kelamin" type="select" value={form.jenis_kelamin} onChange={setF}>
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                    </AdminInput>
                    <AdminInput label="ID Pengguna (opsional)" name="pengguna_id" value={form.pengguna_id} onChange={setF} placeholder="UUID pengguna (opsional)" />
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={closeModal} style={btnCancel}>Batal</button>
                        <button type="submit" style={btnPrimary} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </AdminModal>

            <AdminModal open={modal === 'delete'} onClose={closeModal} title="Hapus Data Anak" width={400}>
                <div style={{ padding: '1.5rem' }}>
                    <p style={{ color: '#475569', marginBottom: '1.5rem' }}>Hapus data anak <strong>{selected?.nama}</strong>?</p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button onClick={closeModal} style={btnCancel}>Batal</button>
                        <button onClick={handleDelete} style={btnDanger} disabled={saving}>{saving ? 'Menghapus...' : 'Hapus'}</button>
                    </div>
                </div>
            </AdminModal>
        </AdminLayout>
    )
}

const btnPrimary = { display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }
const btnEdit = { padding: '0.4rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.4rem', cursor: 'pointer', color: '#0ea5e9', display: 'flex' }
const btnDel = { padding: '0.4rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.4rem', cursor: 'pointer', color: '#ef4444', display: 'flex' }
const btnCancel = { padding: '0.6rem 1.25rem', background: 'white', border: '1px solid #d1d5db', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }
const btnDanger = { padding: '0.6rem 1.25rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }
