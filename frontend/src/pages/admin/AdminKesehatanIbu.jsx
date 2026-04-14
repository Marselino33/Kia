import AdminContent from './AdminContent'
import '../../styles/pages/admin-admin-kesehatan-ibu.css'

// Wrapper for Kesehatan Ibu content management
export default function AdminKesehatanIbu() {
    return (
        <AdminContent 
            categoryFilter="Kesehatan Ibu" 
            pageTitle="Kesehatan Ibu" 
            pageSubtitle="Kelola artikel kesehatan ibu"
        />
    )
}
