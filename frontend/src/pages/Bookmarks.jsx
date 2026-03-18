import { useState, useEffect } from 'react'
import { Bookmark, BookmarkX, Clock, BookOpen, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import toast from 'react-hot-toast'

const sampleBookmarks = [
    { id: 1, article: { id: 1, slug: 'nutrisi-ibu-hamil', title: 'Nutrisi Penting untuk Ibu Hamil', category: 'Gizi', readMinutes: 5 }, createdAt: '2025-01-15' },
    { id: 2, article: { id: 2, slug: 'imunisasi-dasar-bayi', title: 'Jadwal Imunisasi Dasar Bayi', category: 'Imunisasi', readMinutes: 7 }, createdAt: '2025-01-20' },
]

export default function Bookmarks() {
    const [bookmarks, setBookmarks] = useState(sampleBookmarks)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        api.get('/bookmarks').then(r => { if (r.data?.data?.length) setBookmarks(r.data.data) }).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const remove = async (bm) => {
        try {
            await api.delete(`/bookmarks/${bm.article?.id || bm.id}`)
        } catch { }
        setBookmarks(prev => prev.filter(b => b.id !== bm.id))
        toast.success('Bookmark dihapus')
    }

    return (
        <div style={{ paddingTop: 72 }}>
            <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '2rem 0' }}>
                <div className="container">
                    <h1 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', fontWeight: 700 }}>
                        <Bookmark size={22} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--primary-400)', verticalAlign: 'middle' }} />
                        Artikel Tersimpan
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9rem' }}>{bookmarks.length} artikel disimpan</p>
                </div>
            </div>

            <div className="container" style={{ paddingBlock: '2rem' }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[1, 2, 3].map(i => <div key={i} className="glass-card skeleton" style={{ height: 90 }} />)}
                    </div>
                ) : bookmarks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)' }}>
                        <Bookmark size={48} style={{ margin: '0 auto 1rem', opacity: 0.25 }} />
                        <p style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Belum ada artikel tersimpan</p>
                        <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Simpan artikel favorit Anda untuk dibaca nanti</p>
                        <Link to="/konten" className="btn btn-primary"><BookOpen size={15} /> Jelajahi Artikel</Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {bookmarks.map(bm => {
                            const article = bm.article || bm
                            return (
                                <div key={bm.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                                        background: '#fdf2f8', border: '1px solid #fce7f3',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <BookOpen size={18} color="#ec4899" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                                            <span className="badge badge-pink" style={{ fontSize: '0.7rem' }}>{article.category || 'Artikel'}</span>
                                        </div>
                                        <h3 style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.35, marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>{article.title}</h3>
                                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={11} /> {article.readMinutes || '5'} menit baca</span>
                                            {bm.createdAt && <span>Disimpan {bm.createdAt}</span>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                        <Link to={`/konten/${article.slug || '#'}`} className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--primary-500)' }}><ExternalLink size={15} /></Link>
                                        <button onClick={() => remove(bm)} className="btn btn-ghost" style={{ padding: '0.4rem', color: '#dc2626' }}><BookmarkX size={15} /></button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
