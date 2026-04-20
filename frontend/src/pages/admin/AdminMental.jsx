import { useEffect, useMemo, useState } from 'react'
import {
  BadgePlus,
  Brain,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Pencil,
  Search,
  Trash2,
  FileText,
  Heart,
} from 'lucide-react'
import AdminLayout from './AdminLayout'
import adminApi from '../../lib/adminApi'
import toast from 'react-hot-toast'
import '../../styles/pages/admin-admin-parenting.css'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=960&q=80'

const KATEGORI_OPTIONS = [
  'Baby Blues',
  'PPD (Postpartum Depression)',
  'Kecemasan',
  'Burnout',
  'Stress',
  'Depresi',
]

const PHASE_OPTIONS = [
  'kehamilan',
  'setelah_melahirkan',
  'menyusui',
]

const EMPTY_FORM = {
  judul: '',
  slug: '',
  kategori: 'Baby Blues',
  phase: 'setelah_melahirkan',
  ringkasan: '',
  isi: '',
  gambar_url: '',
  read_minutes: 5,
  tags: '',
  is_published: true,
}

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function mapItemToForm(item) {
  return {
    judul: item.judul || '',
    slug: item.slug || '',
    kategori: item.kategori || 'Baby Blues',
    phase: item.phase || 'setelah_melahirkan',
    ringkasan: item.ringkasan || '',
    isi: item.isi || '',
    gambar_url: item.gambar_url || '',
    read_minutes: item.read_minutes || 5,
    tags: item.tags || '',
    is_published: item.is_published !== false,
  }
}

export default function AdminMental() {
  const [mode, setMode] = useState('list')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [kategoriFilter, setKategoriFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const pageSize = 10

  const fetchItems = async () => {
    try {
      setLoading(true)
      const res = await adminApi.get('/admin/content?feature=mental_orang_tua&page=1&limit=200')
      setItems(Array.isArray(res?.data?.data) ? res.data.data : [])
    } catch {
      toast.error('Gagal memuat data mental orang tua')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const filtered = useMemo(() => {
    let data = items

    if (search.trim()) {
      const term = search.toLowerCase()
      data = data.filter((item) => (item.judul || '').toLowerCase().includes(term))
    }

    if (kategoriFilter !== 'all') {
      data = data.filter((item) => item.kategori === kategoriFilter)
    }

    if (statusFilter !== 'all') {
      data = data.filter((item) =>
        statusFilter === 'published' ? item.is_published !== false : item.is_published === false
      )
    }

    return data
  }, [items, search, kategoriFilter, statusFilter])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))

  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [page, totalPages])

  const startCreate = () => {
    setEditingItem(null)
    setForm(EMPTY_FORM)
    setMode('create')
  }

  const startEdit = (item) => {
    setEditingItem(item)
    setForm(mapItemToForm(item))
    setMode('edit')
  }

  const cancelForm = () => {
    setMode('list')
    setEditingItem(null)
    setForm(EMPTY_FORM)
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus artikel "${item.judul}"?`)) return
    try {
      await adminApi.delete(`/admin/content/${item.id}?feature=mental_orang_tua`)
      toast.success('Artikel berhasil dihapus')
      fetchItems()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal menghapus artikel')
    }
  }

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const submitForm = async (publishValue) => {
    if (!form.judul.trim()) {
      toast.error('Judul wajib diisi')
      return
    }

    const generatedSlug = form.slug.trim() || slugify(form.judul)

    const payload = {
      slug: generatedSlug,
      judul: form.judul,
      kategori: form.kategori,
      phase: form.phase,
      ringkasan: form.ringkasan || form.isi?.split('\n')[0]?.slice(0, 180) || 'Artikel kesehatan mental',
      isi: form.isi,
      gambar_url: form.gambar_url || DEFAULT_IMAGE,
      read_minutes: Number(form.read_minutes) || 5,
      tags: form.tags,
      is_published: publishValue,
    }

    try {
      setSaving(true)
      if (mode === 'edit' && editingItem?.id) {
        await adminApi.put(`/admin/content/${editingItem.id}?feature=mental_orang_tua`, payload)
        toast.success('Perubahan disimpan')
      } else {
        await adminApi.post('/admin/content?feature=mental_orang_tua', payload)
        toast.success(publishValue ? 'Artikel berhasil diterbitkan' : 'Artikel disimpan sebagai draft')
      }
      cancelForm()
      fetchItems()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal menyimpan artikel')
    } finally {
      setSaving(false)
    }
  }

  if (mode === 'list') {
    return (
      <AdminLayout>
        <div className="parenting-admin-page">
          <section className="parenting-admin-head">
            <div>
              <h1>Manajemen Kesehatan Mental Orang Tua</h1>
              <p>Kelola artikel baby blues, PPD, kecemasan, dan burnout.</p>
            </div>
            <button className="parenting-admin-primary-btn" onClick={startCreate}>
              <BadgePlus size={17} /> Tambah Artikel
            </button>
          </section>

          <section className="parenting-admin-table-wrap">
            <div className="parenting-admin-table-toolbar">
              <label className="parenting-admin-search">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  placeholder="Cari judul artikel..."
                />
              </label>

              <select
                value={kategoriFilter}
                onChange={(e) => {
                  setKategoriFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="all">Semua Kategori</option>
                {KATEGORI_OPTIONS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="all">Status</option>
                <option value="published">Terbit</option>
                <option value="draft">Draft</option>
              </select>

              <p>
                Menampilkan {filtered.length ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, filtered.length)} dari {filtered.length} artikel
              </p>
            </div>

            <div className="parenting-admin-table-scroll">
              <table className="parenting-admin-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Judul Artikel</th>
                    <th>Kategori</th>
                    <th>Fase</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="parenting-admin-empty">Memuat data...</td></tr>
                  ) : paged.length === 0 ? (
                    <tr><td colSpan={6} className="parenting-admin-empty">
                      <Brain size={32} />
                      <p>Belum ada artikel kesehatan mental.</p>
                      <button onClick={startCreate} className="parenting-admin-primary-btn" style={{ marginTop: '1rem' }}>
                        <BadgePlus size={17} /> Tambah Artikel Pertama
                      </button>
                    </td></tr>
                  ) : (
                    paged.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img src={item.gambar_url || DEFAULT_IMAGE} alt={item.judul} className="parenting-admin-thumb" />
                        </td>
                        <td>
                          <strong>{item.judul}</strong>
                          <small>{item.ringkasan?.slice(0, 60) || 'Tidak ada ringkasan'}...</small>
                          <small>Diperbarui: {new Date(item.updated_at || item.created_at).toLocaleDateString('id-ID')}</small>
                        </td>
                        <td>
                          <span className="parenting-admin-pill category">{item.kategori || '-'}</span>
                        </td>
                        <td>
                          <span className="parenting-admin-pill age">{item.phase || '-'}</span>
                        </td>
                        <td>
                          <span className={`parenting-admin-status ${item.is_published !== false ? 'published' : 'draft'}`}>
                            {item.is_published !== false ? 'TERBIT' : 'DRAFT'}
                          </span>
                        </td>
                        <td>
                          <div className="parenting-admin-actions">
                            <button onClick={() => startEdit(item)}><Pencil size={14} /></button>
                            <button onClick={() => handleDelete(item)} className="danger"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="parenting-admin-pagination">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={16} /></button>
              <span>{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={16} /></button>
            </div>
          </section>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="parenting-admin-page">
        <section className="parenting-admin-form-topbar">
          <div>
            <h1>{mode === 'edit' ? 'Edit Artikel Kesehatan Mental' : 'Tambah Artikel Kesehatan Mental'}</h1>
          </div>
          <div>
            <button className="ghost" onClick={cancelForm}>Batalkan</button>
            <button className="save" onClick={() => submitForm(form.is_published)} disabled={saving}>
              {mode === 'edit' ? 'Simpan Perubahan' : 'Simpan'}
            </button>
          </div>
        </section>

        <section className="parenting-admin-form-grid">
          <div className="parenting-admin-form-main">
            <article className="parenting-admin-card">
              <h3><Heart size={16} /> Informasi Utama</h3>
              
              <label>Judul Artikel</label>
              <input
                value={form.judul}
                onChange={(e) => {
                  updateField('judul', e.target.value)
                  if (!editingItem) updateField('slug', slugify(e.target.value))
                }}
                placeholder="Contoh: Cara Mengatasi Baby Blues Syndrome"
              />

              <label>Slug URL</label>
              <input value={form.slug} onChange={(e) => updateField('slug', e.target.value)} placeholder="cara-mengatasi-baby-blues" />

              <div className="inline-two">
                <div>
                  <label>Kategori</label>
                  <select value={form.kategori} onChange={(e) => updateField('kategori', e.target.value)}>
                    {KATEGORI_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label>Estimasi Waktu Baca</label>
                  <div className="input-icon-wrap">
                    <Clock3 size={15} />
                    <input type="number" min={1} value={form.read_minutes} onChange={(e) => updateField('read_minutes', e.target.value)} />
                    <span style={{ marginLeft: '0.5rem', color: '#64748b' }}>menit</span>
                  </div>
                </div>
              </div>
            </article>

            <article className="parenting-admin-card">
              <h3><FileText size={16} /> Ringkasan</h3>
              <textarea
                rows={3}
                value={form.ringkasan}
                onChange={(e) => updateField('ringkasan', e.target.value)}
                placeholder="Ringkasan singkat artikel (maks. 180 karakter)..."
              />
            </article>

            <article className="parenting-admin-card">
              <h3>Isi Artikel</h3>
              <textarea
                rows={12}
                value={form.isi}
                onChange={(e) => updateField('isi', e.target.value)}
                placeholder="Tuliskan isi artikel di sini... Anda dapat menggunakan format Markdown atau HTML."
              />
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                Tips: Jelaskan gejala, penyebab, dan cara mengatasi masalah kesehatan mental ini.
              </p>
            </article>
          </div>

          <aside className="parenting-admin-form-side">
            <article className="parenting-admin-card">
              <h3>Thumbnail Artikel</h3>
              <div className="parenting-admin-preview-wrap">
                <img src={form.gambar_url || DEFAULT_IMAGE} alt="preview" />
              </div>
              <label>URL Thumbnail</label>
              <input
                value={form.gambar_url}
                onChange={(e) => updateField('gambar_url', e.target.value)}
                placeholder="https://..."
              />
            </article>

            <article className="parenting-admin-card">
              <h3><Brain size={16} /> Fase</h3>
              <select value={form.phase} onChange={(e) => updateField('phase', e.target.value)}>
                {PHASE_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item === 'kehalaman' ? 'Kehamilton' : item === 'setelah_melahirkan' ? 'Setelah Melahirkan' : 'Menyusui'}
                  </option>
                ))}
              </select>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                Pilih fase yang sesuai dengan artikel ini.
              </p>
            </article>

            <article className="parenting-admin-actions-card">
              <button className="publish" disabled={saving} onClick={() => submitForm(true)}>
                {saving ? 'Menyimpan...' : 'Terbitkan Artikel'}
              </button>
              <button className="draft" disabled={saving} onClick={() => submitForm(false)}>
                Simpan sebagai Draft
              </button>
              <button className="cancel" onClick={cancelForm}>
                Batalkan Pengisian
              </button>
            </article>
          </aside>
        </section>
      </div>
    </AdminLayout>
  )
}