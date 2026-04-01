import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { searchProfiles } from '../../services/profileService';

export default function AdminFeatured() {
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState('');

  const fetch = async () => {
    const { data } = await searchProfiles({ limit: 50, sort: 'featured' });
    setProfiles(data.profiles || []);
  };
  useEffect(() => { fetch(); }, []);

  const toggleFeatured = async (id) => {
    await api.patch(`/admin/profiles/${id}/feature`);
    fetch();
  };

  const filtered = profiles.filter(p =>
    p.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="admin-page-title">{t('admin.featured')}</h1>
      <div className="admin-search-row">
        <input className="form-input admin-search-input" placeholder="Search by name..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Profile</th><th>Industry</th><th>Location</th><th>Views</th><th>Featured</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p._id}>
                <td>
                  <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                    {p.profilePhoto && <img src={p.profilePhoto} style={{ width:36,height:36,borderRadius:'50%',objectFit:'cover' }} onError={e=>e.target.style.display='none'} />}
                    <span style={{ fontWeight:600 }}>{p.displayName}</span>
                  </div>
                </td>
                <td>{p.occupation?.industry || '—'}</td>
                <td>{p.location?.city || '—'}</td>
                <td>{p.views || 0}</td>
                <td>
                  {p.isFeatured
                    ? <span className="badge badge-success">⭐ Featured</span>
                    : <span className="badge">Standard</span>
                  }
                </td>
                <td>
                  <button
                    className={`btn btn-sm ${p.isFeatured ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => toggleFeatured(p._id)}
                  >
                    {p.isFeatured ? t('admin.unfeature') : t('admin.feature')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
