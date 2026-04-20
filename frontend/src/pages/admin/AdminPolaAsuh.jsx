import { useEffect, useMemo, useState } from 'react'
import {
  BadgePlus,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Pencil,
  Search,
  Trash2,
  FileText,
  Heart,
  Shield,
  CheckCircle2,
} from 'lucide-react'
import AdminLayout from './AdminLayout'
import adminApi from '../../lib/adminApi'
import toast from 'react-hot-toast'
import '../../styles/pages/admin-admin-parenting.css'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=960&q=80'

const KATEGORI_POLA_ASUH = [
  'TAHAP BAYI',
  'TAHAP SALITA',
  'TAHAP PRA-SEKOLAH',
  'TAHAP SEKOLAH',
]

const PHASE_OPTIONS = [
  '0-18 Bulan',
  '1.5-3 Tahun',
  '3-6 Tahun',
  '6+ Tahun',
]

const EMPTY_FORM = {
  judul: '',
  slug: '',
  kategori: 'TAHAP BAYI',
  read_minutes: 5,
  thumbnail: '',
  phase: '0-18 Bulan',
  ringkasan: '',
  isi: '',
  langkah_praktis: '',
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
  let langkahPraktis = item.langkah_praktis || ''
  if (typeof langkahPraktis === 'string' && langkahPraktis.startsWith('[')) {
    try {
      const parsed = JSON.parse(langkahPraktis)
      langkahPraktis = parsed.join('\n')
    } catch (e) {}
  }
  return {
    judul: item.judul || '',
    slug: item.slug || '',
    kategori: item.kategori || 'TAHAP BAYI',
    read_minutes: item.read_minutes || 5,
    thumbnail: item.gambar_url || '',
    phase: item.phase || '0-18 Bulan',
    ringkasan: item.ringkasan || '',
    isi: item.isi || '',
    langkah_praktis: langkahPraktis,
    is_published: item.is_published !== false,
  }
}

export default function AdminPolaAsuh() {
  const [mode, setMode] = useState('list')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [phaseFilter, setPhaseFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const pageSize = 10

  const fetchItems = async () => {
    try {
      setLoading(true)
      const res = await adminApi.get('/admin/pola-asuh?page=1&limit=200')
      const allItems = Array.isArray(res?.data?.data) ? res.data.data : []
      setItems(allItems)
    } catch {
      toast.error('Gagal memuat data pola asuh')
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

    if (phaseFilter !== 'all') {
      data = data.filter((item) => item.phase === phaseFilter)
    }

    if (statusFilter !== 'all') {
      data = data.filter((item) =>
        statusFilter === 'published' ? item.is_published !== false : item.is_published === false
      )
    }

    return data
  }, [items, search, phaseFilter, statusFilter])

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
      await adminApi.delete(`/admin/pola-asuh/${item.id}`)
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
      ringkasan: form.ringkasan || form.isi?.split('\n')[0]?.slice(0, 180) || 'Artikel pola asuh',
      isi: form.isi,
      langkah_praktis: form.langkah_praktis ? JSON.stringify(form.langkah_praktis.split('\n').filter(Boolean)) : '[]',
      gambar_url: form.thumbnail || DEFAULT_IMAGE,
      read_minutes: Number(form.read_minutes) || 5,
      is_published: publishValue,
    }

    try {
      setSaving(true)
      if (mode === 'edit' && editingItem?.id) {
        await adminApi.put(`/admin/pola-asuh/${editingItem.id}`, payload)
        toast.success('Perubahan disimpan')
      } else {
        await adminApi.post('/admin/pola-asuh', payload)
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
              <h1>Manajemen Pola Asuh</h1>
              <p>Kelola artikel pola asuh dan parenting untuk orang tua.</p>
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
                value={phaseFilter}
                onChange={(e) => {
                  setPhaseFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="all">Semua Fase Usia</option>
                {PHASE_OPTIONS.map((item) => (
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
                    <th>Filter Usia</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="parenting-admin-empty">Memuat data...</td></tr>
                  ) : paged.length === 0 ? (
                    <tr><td colSpan={6} className="parenting-admin-empty">
                      <FileText size={32} />
                      <p>Belum ada artikel pola asuh.</p>
                      <button onClick={startCreate} className="parenting-admin-primary-btn" style={{ marginTop: '1rem' }}>
                        <BadgePlus size={17} /> Tambah Artikel Pertama
                      </button>
                    </td></tr>
                  ) : (
                    paged.map((item) => {
                      return (
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
                            <span className="parenting-admin-pill category">{item.kategori || 'Pola Asuh'}</span>
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
                      )
                    })
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
            <h1>{mode === 'edit' ? 'Edit Artikel Pola Asuh' : 'Tambah Artikel Pola Asuh'}</h1>
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
                placeholder="Contoh: Cara Efektif Mengkomunikasikan Masalah pada Anak"
              />

              <label>Slug URL</label>
              <input value={form.slug} onChange={(e) => updateField('slug', e.target.value)} placeholder="cara-efektif-mengkomunikasikan-masalah" />

              <div className="inline-two">
                <div>
                  <label>Kategori Pola Asuh</label>
                  <select value={form.kategori} onChange={(e) => updateField('kategori', e.target.value)}>
                    {KATEGORI_POLA_ASUH.map((item) => <option key={item} value={item}>{item}</option>)}
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
              <h3><Shield size={16} /> Isi Artikel</h3>
              <textarea
                rows={12}
                value={form.isi}
                onChange={(e) => updateField('isi', e.target.value)}
                placeholder="Tuliskan isi artikel di sini... Anda dapat menggunakan format Markdown atau HTML."
              />
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                Tips: Gunakan heading dengan ## untuk judul bagian, dan ### untuk sub-bagian.
              </p>
            </article>

            <article className="parenting-admin-card">
              <h3><CheckCircle2 size={16} /> Langkah Praktis</h3>
              <textarea
                rows={6}
                value={form.langkah_praktis}
                onChange={(e) => updateField('langkah_praktis', e.target.value)}
                placeholder="Masukkan langkah-langkah praktis (satu langkah per baris)..."
              />
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                Tuliskan satu langkah per baris. Contoh: Ajak anak berbicara tentang perasaannya
              </p>
            </article>
          </div>

          <aside className="parenting-admin-form-side">
            <article className="parenting-admin-card">
              <h3>Thumbnail Artikel</h3>
              <div className="parenting-admin-preview-wrap">
                <img src={form.thumbnail || DEFAULT_IMAGE} alt="preview" />
              </div>
              <label>URL Thumbnail</label>
              <input
                value={form.thumbnail}
                onChange={(e) => updateField('thumbnail', e.target.value)}
                placeholder="https://..."
              />
            </article>

            <article className="parenting-admin-card">
              <h3><CalendarRange size={16} /> Rentang Usia Anak</h3>
              <select
                value={form.phase}
                onChange={(e) => updateField('phase', e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
              >
                {PHASE_OPTIONS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
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