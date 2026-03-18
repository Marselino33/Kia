import useAuthStore from '../store/authStore'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminBar({label='Tambah Konten', onClick}) {
    const isAdmin = useAuthStore((s) => s.isAdmin())
    if (!isAdmin) return null
    const handleClick = () => {
        if (onClick) return onClick()
        toast('Admin action placeholder – clickable area should open editor')
    }
    return (
        <div style={{ background: '#fde68a', padding: '0.75rem 1rem', textAlign: 'center', borderBottom: '1px solid #fcd34d' }}>
            <button onClick={handleClick} style={{ background: '#fbbf24', color: '#1f2937', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display:'inline-flex', alignItems:'center', gap:'0.5rem' }}>
                <Plus size={16} /> {label}
            </button>
        </div>
    )
}