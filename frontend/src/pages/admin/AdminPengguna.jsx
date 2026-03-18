import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, Users } from 'lucide-react'
import AdminLayout, { AdminPageHeader, AdminCard, AdminModal, AdminInput, tableStyle, thStyle, tdStyle } from './AdminLayout'
import adminApi from '../../lib/adminApi'
import toast from 'react-hot-toast'

const EMPTY_FORM = { nama: '', no_hp: '', pin: '', role: 'user', desa: '' }
const ROLES = ['user', 'kader', 'admin']

export default function AdminPengguna() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null) // null | 'create' | 'edit' | 'delete'
    const [selected, setSelected] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [saving, setSaving] = useState(false)

    const fetchData = () => {
        setLoading(true)
        adminApi.get('/admin/pengguna')
            .then(r => setList(r.data?.data || []))
            .catch(() => toast.error('Gagal memuat data pengguna'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchData() }, [])

    const openCreate = () => { setForm(EMPTY_FORM); setSelected(null); setModal('create') }
    const openEdit = (item) => { setForm({ nama: item.nama, no_hp: item.no_hp, pin: '', role: item.role || 'user', desa: item.desa || '' }); setSelected(item); setModal('edit') }
    const openDelete = (item) => { setSelected(item); setModal('delete') }
    const closeModal = () => { setModal(null); setSelected(null) }

    const handleSetForm = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSave = async (e) => {
        e.preventDefault()
        if (!form.nama || !form.no_hp || !form.role) { toast.error('Nama, No HP, dan Role wajib diisi'); return }
        if (modal === 'create' && !form.pin) { toast.error('PIN wajib diisi untuk pengguna baru'); return }
        setSaving(true)
        try {
            if (modal === 'create') {
                await adminApi.post('/admin/pengguna', form)
                toast.success('Pengguna berhasil ditambahkan')
            } else {
                const payload = { nama: form.nama, no_hp: form.no_hp, role: form.role, desa: form.desa }
                if (form.pin) payload.pin = form.pin
                await adminApi.put(`/admin/pengguna/${selected.id}`, payload)
                toast.success('Pengguna berhasil diperbarui')
            }
            closeModal(); fetchData()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menyimpan')
        } finally { setSaving(false) }
    }

    const handleDelete = async () => {
        setSaving(true)
        try {
            await adminApi.delete(`/admin/pengguna/${selected.id}`)
            toast.success('Pengguna berhasil dihapus')
            closeModal(); fetchData()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menghapus')
        } finally { setSaving(false) }
    }

    const filtered = list.filter(u =>
        u.nama?.toLowerCase().includes(search.toLowerCase()) ||
        u.no_hp?.includes(search)
    )

    return (
        <AdminLayout>
            <AdminPageHeader
                title="Manajemen Pengguna"
                subtitle={`${list.length} pengguna terdaftar`}
                action={
                    <button onClick={openCreate} style={btnPrimaryStyle}>
                        <Plus size={16} /> Tambah Pengguna
                    </button>
                }
            />
            <div style={{ padding: '2rem' }}>
                <AdminCard>
                    {/* Search */}
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Search size={16} color="#94a3b8" />
                        <input
                            type="text" placeholder="Cari nama atau No HP..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            style={{ border: 'none', outline: 'none', fontSize: '0.875rem', flex: 1, color: '#334155' }}
                        />
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: 'auto' }}>
                        {loading ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Memuat...</div>
                        ) : filtered.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                <Users size={32} style={{ marginBottom: '0.5rem' }} />
                                <p>Tidak ada data</p>
                            </div>
                        ) : (
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Nama</th>
                                        <th style={thStyle}>No HP</th>
                                        <th style={thStyle}>Role</th>
                                        <th style={thStyle}>Desa</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(u => (
                                        <tr key={u.id} style={{ transition: 'background 0.1s' }}>
                                            <td style={tdStyle}><strong>{u.nama}</strong></td>
                                            <td style={tdStyle}>{u.no_hp}</td>
                                            <td style={tdStyle}>
                                                <span style={{ ...roleBadge(u.role) }}>{u.role}</span>
                                            </td>
                                            <td style={tdStyle}>{u.desa || '-'}</td>
                                            <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => openEdit(u)} style={btnEditStyle}><Pencil size={14} /></button>
                                                    <button onClick={() => openDelete(u)} style={btnDeleteStyle}><Trash2 size={14} /></button>
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

            {/* Create/Edit Modal */}
            <AdminModal open={modal === 'create' || modal === 'edit'}
                onClose={closeModal}
                title={modal === 'create' ? 'Tambah Pengguna' : 'Edit Pengguna'}>
                <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
                    <AdminInput label="Nama Lengkap" name="nama" value={form.nama} onChange={handleSetForm} required placeholder="Nama pengguna" />
                    <AdminInput label="Nomor HP" name="no_hp" value={form.no_hp} onChange={handleSetForm} required placeholder="08xxxxxxxxxx" />
                    <AdminInput label={modal === 'create' ? 'PIN (6 digit)' : 'PIN Baru (kosongkan jika tidak diubah)'} name="pin" type="password" value={form.pin} onChange={handleSetForm} required={modal === 'create'} placeholder="••••••" maxLength={6} />
                    <AdminInput label="Role" name="role" type="select" value={form.role} onChange={handleSetForm} required>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </AdminInput>
                    <AdminInput label="Desa" name="desa" value={form.desa} onChange={handleSetForm} placeholder="Nama desa (opsional)" />
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button type="button" onClick={closeModal} style={btnCancelStyle}>Batal</button>
                        <button type="submit" style={btnPrimaryStyle} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </AdminModal>

            {/* Delete Modal */}
            <AdminModal open={modal === 'delete'} onClose={closeModal} title="Hapus Pengguna" width={400}>
                <div style={{ padding: '1.5rem' }}>
                    <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
                        Apakah Anda yakin ingin menghapus pengguna <strong>{selected?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button onClick={closeModal} style={btnCancelStyle}>Batal</button>
                        <button onClick={handleDelete} style={btnDangerStyle} disabled={saving}>{saving ? 'Menghapus...' : 'Hapus'}</button>
                    </div>
                </div>
            </AdminModal>
        </AdminLayout>
    )
}

function roleBadge(role) {
    const colors = { admin: { bg: '#6366f120', color: '#6366f1', border: '#6366f140' }, kader: { bg: '#0ea5e920', color: '#0ea5e9', border: '#0ea5e940' }, user: { bg: '#10b98120', color: '#10b981', border: '#10b98140' } }
    const c = colors[role] || colors.user
    return { padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: c.bg, color: c.color, border: `1px solid ${c.border}` }
}

const btnPrimaryStyle = {
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer',
    fontSize: '0.875rem', fontWeight: 600
}
const btnEditStyle = {
    padding: '0.4rem', background: '#f0f9ff', border: '1px solid #bae6fd',
    borderRadius: '0.4rem', cursor: 'pointer', color: '#0ea5e9', display: 'flex'
}
const btnDeleteStyle = {
    padding: '0.4rem', background: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: '0.4rem', cursor: 'pointer', color: '#ef4444', display: 'flex'
}
const btnCancelStyle = {
    padding: '0.6rem 1.25rem', background: 'white', border: '1px solid #d1d5db',
    borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151'
}
const btnDangerStyle = {
    padding: '0.6rem 1.25rem', background: '#ef4444', color: 'white',
    border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600
}
