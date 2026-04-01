import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, FileText } from 'lucide-react'
import AdminLayout, { AdminPageHeader, AdminCard, AdminModal, AdminInput, tableStyle, thStyle, tdStyle } from './AdminLayout'
import adminApi from '../../lib/adminApi'
import toast from 'react-hot-toast'

const EMPTY = { slug: '', judul: '', ringkasan: '', isi: '', kategori: '', phase: '', tags: '', gambar_url: '', read_minutes: 5, is_published: true }
const KATEGORI = ['Gizi', 'Imunisasi', 'Kesehatan Ibu', 'Tumbuh Kembang', 'PHBS', 'Umum']
const PHASE = ['kehamilan_1', 'kehamilan_2', 'kehamilan_3', 'bayi', 'baduta', 'balita', 'semua']

// Wrapper component for category-specific content management
export default function AdminContent({ categoryFilter, pageTitle, pageSubtitle }) {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [form, setForm] = useState({ ...EMPTY, kategori: categoryFilter || '' })
    const [saving, setSaving] = useState(false)

    const fetchData = () => {
        setLoading(true)
        // If categoryFilter is provided, filter by category
        const endpoint = categoryFilter 
            ? `/admin/content?kategori=${encodeURIComponent(categoryFilter)}`
            : '/admin/content'
        adminApi.get(endpoint)
            .then(r => setList(r.data?.data || []))
            .catch(() => toast.error('Gagal memuat konten'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { 
        fetchData() 
    }, [categoryFilter])

    const openCreate = () => { 
        setForm({ ...EMPTY, kategori: categoryFilter || '' }); 
        setSelected(null); 
        setModal('create') 
    }
    const openEdit = (item) => {
        setForm({ 
            slug: item.slug, 
            judul: item.judul || item.title || '', 
            ringkasan: item.ringkasan || item.summary || '', 
            isi: item.isi || item.body || '', 
            kategori: item.kategori || item.category || categoryFilter || '', 
            phase: item.phase || '', 
            tags: item.tags || '', 
            gambar_url: item.gambar_url || '', 
            read_minutes: item.read_minutes || item.readMinutes || 5, 
            is_published: item.is_published !== false 
        })
        setSelected(item); setModal('edit')
    }
    const openDelete = (item) => { setSelected(item); setModal('delete') }
    const closeModal = () => { setModal(null); setSelected(null) }
    const setF = (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setForm(p => ({ ...p, [e.target.name]: val }))
    }

    const autoSlug = (title) => title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

    const handleSave = async (e) => {
        e.preventDefault()
        if (!form.judul || !form.slug) { toast.error('Judul dan slug wajib diisi'); return }
        // Ensure category is set
        const payload = { ...form, read_minutes: parseInt(form.read_minutes) || 5, kategori: categoryFilter || form.kategori }
        setSaving(true)
        try {
            if (modal === 'create') {
                await adminApi.post('/admin/content', payload)
                toast.success('Konten berhasil ditambahkan')
            } else {
                await adminApi.put(`/admin/content/${selected.id}`, payload)
                toast.success('Konten berhasil diperbarui')
            }
            closeModal(); fetchData()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menyimpan')
        } finally { setSaving(false) }
    }

    const handleDelete = async () => {
        setSaving(true)
        try {
            await adminApi.delete(`/admin/content/${selected.id}`)
            toast.success('Konten berhasil dihapus')
            closeModal(); fetchData()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menghapus')
        } finally { setSaving(false) }
    }

    const filtered = list.filter(c => (c.judul || c.title)?.toLowerCase().includes(search.toLowerCase()))

    // Use custom title if provided, otherwise use category
    const title = pageTitle || (categoryFilter ? `Konten ${categoryFilter}` : 'Manajemen Konten')
    const subtitle = pageSubtitle || `${list.length} artikel`

    return (
        <AdminLayout>
            <AdminPageHeader title={title} subtitle={subtitle}
                action={<button onClick={openCreate} style={btnP}><Plus size={16} /> Tambah Artikel</button>} />
            <div style={{ padding: '2rem' }}>
                <AdminCard>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <Search size={16} color="#94a3b8" />
                        <input type="text" placeholder="Cari judul artikel..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '0.875rem', flex: 1 }} />
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        {loading ? <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Memuat...</div>
                            : filtered.length === 0 ? <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}><FileText size={32} /><p>Tidak ada data</p></div>
                                : <table style={tableStyle}>
                                    <thead><tr>
                                        <th style={thStyle}>Judul</th>
                                        <th style={thStyle}>Slug</th>
                                        <th style={thStyle}>Phase</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>Aksi</th>
                                    </tr></thead>
                                    <tbody>
                                        {filtered.map(c => (
                                            <tr key={c.id}>
                                                <td style={{ ...tdStyle, maxWidth: 220 }}>
                                                    <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.judul || c.title}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.ringkasan || c.summary}</div>
                                                </td>
                                                <td style={{ ...tdStyle, fontSize: '0.75rem', color: '#6366f1' }}>{c.slug}</td>
                                                <td style={tdStyle}>{c.phase || '-'}</td>
                                                <td style={tdStyle}>
                                                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: c.is_published !== false ? '#10b98120' : '#94a3b820', color: c.is_published !== false ? '#10b981' : '#94a3b8', border: `1px solid ${c.is_published !== false ? '#10b98140' : '#94a3b840'}` }}>
                                                        {c.is_published !== false ? 'Publik' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                        <button onClick={() => openEdit(c)} style={btnE}><Pencil size={14} /></button>
                                                        <button onClick={() => openDelete(c)} style={btnD}><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>}
                    </div>
                </AdminCard>
            </div>

            <AdminModal open={modal === 'create' || modal === 'edit'} onClose={closeModal} title={modal === 'create' ? 'Tambah Artikel' : 'Edit Artikel'} width={640}>
                <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                        <div style={{ gridColumn: '1/-1' }}>
                            <AdminInput label="Judul" name="judul" value={form.judul} required onChange={e => { setF(e); if (!selected) setForm(p => ({ ...p, slug: autoSlug(e.target.value) })) }} placeholder="Judul artikel" />
                        </div>
                        <AdminInput label="Slug" name="slug" value={form.slug} required onChange={setF} placeholder="judul-artikel" />
                        <AdminInput label="Baca (menit)" name="read_minutes" type="number" value={form.read_minutes} onChange={setF} min={1} />
                        <AdminInput label="Phase" name="phase" type="select" value={form.phase} onChange={setF}>
                            <option value="">-- Pilih Phase --</option>
                            {PHASE.map(p => <option key={p} value={p}>{p}</option>)}
                        </AdminInput>
                        <div style={{ gridColumn: '1/-1' }}>
                            <AdminInput label="Ringkasan" name="ringkasan" type="textarea" value={form.ringkasan} onChange={setF} placeholder="Ringkasan singkat artikel" />
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <AdminInput label="Isi Artikel (HTML diperbolehkan)" name="isi" type="textarea" value={form.isi} onChange={setF} placeholder="<p>Konten artikel...</p>" style={{ minHeight: 120 }} />
                        </div>
                        <AdminInput label="Tags" name="tags" value={form.tags} onChange={setF} placeholder="tag1 tag2 tag3" />
                        <AdminInput label="URL Gambar" name="gambar_url" value={form.gambar_url} onChange={setF} placeholder="https://..." />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input type="checkbox" name="is_published" checked={form.is_published} onChange={setF} />
                        Publikasikan artikel ini
                    </label>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={closeModal} style={btnC}>Batal</button>
                        <button type="submit" style={btnP} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </AdminModal>

            <AdminModal open={modal === 'delete'} onClose={closeModal} title="Hapus Artikel" width={400}>
                <div style={{ padding: '1.5rem' }}>
                    <p style={{ color: '#475569', marginBottom: '1.5rem' }}>Hapus artikel <strong>{selected?.judul || selected?.title}</strong>?</p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button onClick={closeModal} style={btnC}>Batal</button>
                        <button onClick={handleDelete} style={btnX} disabled={saving}>{saving ? 'Menghapus...' : 'Hapus'}</button>
                    </div>
                </div>
            </AdminModal>
        </AdminLayout>
    )
}

const btnP = { display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg, #E8307D, #f472b6)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }
const btnE = { padding: '0.4rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.4rem', cursor: 'pointer', color: '#0ea5e9', display: 'flex' }
const btnD = { padding: '0.4rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.4rem', cursor: 'pointer', color: '#ef4444', display: 'flex' }
const btnC = { padding: '0.6rem 1.25rem', background: 'white', border: '1px solid #d1d5db', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }
const btnX = { padding: '0.6rem 1.25rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }
