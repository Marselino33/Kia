import AdminContent from './AdminContent'
import '../../styles/pages/admin-admin-phbs.css'

// Wrapper for PHBS content management
export default function AdminPHBS() {
    return (
        <AdminContent 
            categoryFilter="PHBS" 
            pageTitle="PHBS (Perilaku Hidup Bersih dan Sehat)" 
            pageSubtitle="Kelola artikel PHBS"
        />
    )
}
