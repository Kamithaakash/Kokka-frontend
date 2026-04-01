import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

export default function AdminReports() {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState('pending');

  const fetch = async () => {
    const { data } = await api.get('/admin/reports', { params: { status } });
    setReports(data.reports);
  };
  useEffect(() => { fetch(); }, [status]);

  const resolve = async (id, newStatus) => {
    await api.patch(`/admin/reports/${id}`, { status: newStatus });
    fetch();
  };

  return (
    <div>
      <h1 className="admin-page-title">{t('admin.reports')}</h1>
      <div className="admin-search-row">
        <select className="form-select" style={{ width: 200 }} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="dismissed">Dismissed</option>
          <option value="all">All</option>
        </select>
      </div>
      <div className="card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Reported Profile</th><th>Reported By</th><th>Reason</th><th>Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r._id}>
                <td style={{ fontWeight:600 }}>{r.reportedProfile?.displayName || '—'}</td>
                <td>{r.reportedBy?.email}</td>
                <td>{r.reason}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${r.status === 'pending' ? 'badge-warning' : r.status === 'reviewed' ? 'badge-success' : 'badge-danger'}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <div className="admin-action-btns">
                    {r.status === 'pending' && <>
                      <button className="btn btn-success btn-sm" onClick={() => resolve(r._id, 'reviewed')}>{t('admin.resolve')}</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => resolve(r._id, 'dismissed')}>{t('admin.dismiss')}</button>
                    </>}
                  </div>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>No reports found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
