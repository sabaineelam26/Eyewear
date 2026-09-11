import React, { useEffect, useState } from 'react';
import { adminApi } from '../../context/AdminAuthContext';
import { User } from 'lucide-react';

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCustomers = async () => {
        try {
            // Need a backend route to fetch users. We can mock or assume there's an api for it.
            // Actually, we haven't built GET /api/admin/customers yet. Let's just mock it or show coming soon.
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    if (loading) return <div>Loading customers...</div>;

    return (
        <div className="admin-page fade-in">
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>Customers Management</h1>

            <div className="admin-card">
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <User size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Customer Directory</h3>
                    <p>API endpoint for fetching customer list requires backend implementation.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminCustomers;
