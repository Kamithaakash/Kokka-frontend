import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

export default function AdminUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', { params: { search, status } });
      setUsers(data.users);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [search, status]);

  const handleBan = async (id, isBanned) => {
    await api.patch(`/admin/users/${id}/ban`, { reason: 'Violation of terms' });
    fetchUsers();
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    await api.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  return (
    <div>
      <h1 className="admin-page-title">{t('admin.users')}</h1>
      <div className="admin-search-row">
        <input className="form-input admin-search-input" placeholder={t('admin.search_users')}
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-select" style={{ width: 160 }} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">{t('common.all')}</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>
      <div className="card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign:'center', padding:'40px' }}><div className="spinner" /></td></tr>
            ) : users.map(u => (
              <tr key={u._id}>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,var(--primary),var(--accent))',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'0.8rem',flexShrink:0 }}>
                      {(u.profile?.displayName || u.email)[0].toUpperCase()}
                    </div>
                    <span style={{ fontWeight:600 }}>{u.profile?.displayName || '—'}</span>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>
                  {u.isBanned
                    ? <span className="badge badge-danger">Banned</span>
                    : u.isVerified
                      ? <span className="badge badge-success">Active</span>
                      : <span className="badge badge-warning">Unverified</span>
                  }
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="admin-action-btns">
                    <button className={`btn btn-sm ${u.isBanned ? 'btn-outline' : 'btn-secondary'}`}
                      onClick={() => handleBan(u._id, u.isBanned)}>
                      {u.isBanned ? t('admin.unban') : t('admin.ban')}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>
                      {t('admin.delete')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
