import React, { useState, useEffect } from 'react';
import API from '../../api';
import { Users, User, Mail, Shield } from 'lucide-react';

export default function ActiveUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch() {
            try {
                const res = await API.get('/admin/active-users');
                setUsers(res.data);
            } catch (e) { } finally { setLoading(false); }
        }
        fetch();
    }, []);

    if (loading) return <div className="spinner" style={{ minHeight: '60vh' }}></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Active Users</h1>
                <p className="page-subtitle">All active users on the platform ({users.length} total)</p>
            </div>

            {users.length === 0 ? (
                <div className="empty-state">
                    <Users size={48} />
                    <h3>No active users</h3>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr><th>#</th><th>Username</th><th>Email</th><th>Role</th><th>Approved</th><th>Joined</th></tr>
                        </thead>
                        <tbody>
                            {users.map((u, i) => (
                                <tr key={u.id}>
                                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{u.username}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                                    <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                                    <td>
                                        <span className={`badge ${u.is_approved ? 'badge-approved' : 'badge-pending'}`}>
                                            {u.is_approved ? 'Yes' : 'Pending'}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
