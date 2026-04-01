import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getMyProfile, updateMyProfile, uploadPhotos, deletePhoto, setProfilePhoto } from '../services/profileService';
import './MyProfile.css';

export default function MyProfile() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getMyProfile().then(r => { setProfile(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const r = await updateMyProfile({
        displayName: profile.displayName, height: profile.height,
        religion: profile.religion, ethnicity: profile.ethnicity,
        location: profile.location, education: profile.education,
        occupation: profile.occupation, lifestyle: profile.lifestyle,
        aboutMe: profile.aboutMe, partnerExpectations: profile.partnerExpectations,
        isVisible: profile.isVisible,
      });
      setProfile(r.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('photos', f));
    const r = await uploadPhotos(fd);
    setProfile(prev => ({ ...prev, photos: r.data.photos, profilePhoto: r.data.profilePhoto }));
  };

  const set = (path, value) => {
    const keys = path.split('.');
    setProfile(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      let cur = copy;
      keys.slice(0,-1).forEach(k => { cur[k] = cur[k] || {}; cur = cur[k]; });
      cur[keys[keys.length-1]] = value;
      return copy;
    });
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!profile) return <div className="page-wrapper flex-center"><div className="card">Profile not found</div></div>;

  return (
    <div className="my-profile-page page-wrapper">
      <div className="container">
        <div className="mp-header flex-between">
          <div>
            <h1>{t('myProfile.title')}</h1>
            <p style={{ color:'var(--text-muted)' }}>Keep your profile up to date to get the best matches</p>
          </div>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <label className="mp-visibility-toggle">
              <span>{t('myProfile.visibility')}: </span>
              <input type="checkbox" checked={profile.isVisible}
                onChange={e => set('isVisible', e.target.checked)} />
              <span className={`mp-vis-badge ${profile.isVisible ? 'badge-success' : 'badge-danger'} badge`}>
                {profile.isVisible ? t('myProfile.visible') : t('myProfile.hidden')}
              </span>
            </label>
            <button className="btn btn-primary" onClick={save} disabled={saving}>
              {saving ? t('common.loading') : saved ? '✓ Saved!' : t('myProfile.save')}
            </button>
          </div>
        </div>

        <div className="mp-layout">
          {/* Photos */}
          <div className="mp-photos-card card">
            <h3 className="mp-card-title">{t('myProfile.photos_section')}</h3>
            <div className="mp-photos-grid">
              {(profile.photos || []).map((ph, i) => (
                <div key={i} className="mp-photo-item">
                  <img src={ph} className="mp-photo" onError={e=>e.target.style.display='none'} />
                  <div className="mp-photo-actions">
                    <button className="btn btn-sm btn-primary" onClick={() => setProfilePhoto(ph).then(r => set('profilePhoto', r.data.profilePhoto))}>
                      Set Main
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => deletePhoto(ph).then(r => setProfile(prev => ({ ...prev, photos: r.data.photos })))}>
                      ✕
                    </button>
                  </div>
                  {profile.profilePhoto === ph && <div className="mp-main-badge">Main</div>}
                </div>
              ))}
              {(profile.photos || []).length < 6 && (
                <label className="mp-photo-upload-slot">
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display:'none' }} />
                  <div className="mp-upload-icon">+</div>
                  <span>Add Photo</span>
                </label>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="mp-section-card card">
            <h3 className="mp-card-title">Basic Information</h3>
            <div className="mp-form-grid">
              <div className="form-group">
                <label className="form-label">Display Name</label>
                <input className="form-input" value={profile.displayName || ''} onChange={e=>set('displayName',e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input type="number" className="form-input" value={profile.height || ''} onChange={e=>set('height',e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" value={profile.location?.city || ''} onChange={e=>set('location.city',e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Province</label>
                <input className="form-input" value={profile.location?.province || ''} onChange={e=>set('location.province',e.target.value)} />
              </div>
            </div>
          </div>

          {/* Career */}
          <div className="mp-section-card card">
            <h3 className="mp-card-title">Career</h3>
            <div className="mp-form-grid">
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input className="form-input" value={profile.occupation?.jobTitle || ''} onChange={e=>set('occupation.jobTitle',e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Employer</label>
                <input className="form-input" value={profile.occupation?.employer || ''} onChange={e=>set('occupation.employer',e.target.value)} />
              </div>
            </div>
          </div>

          {/* About */}
          <div className="mp-section-card card">
            <h3 className="mp-card-title">About</h3>
            <div className="form-group">
              <label className="form-label">About Me</label>
              <textarea className="form-textarea" rows={4} value={profile.aboutMe || ''} onChange={e=>set('aboutMe',e.target.value)} maxLength={1000} />
            </div>
            <div className="form-group">
              <label className="form-label">Partner Expectations</label>
              <textarea className="form-textarea" rows={4} value={profile.partnerExpectations || ''} onChange={e=>set('partnerExpectations',e.target.value)} maxLength={1000} />
            </div>
          </div>
        </div>

        <div style={{ marginTop:24,textAlign:'right' }}>
          <button className="btn btn-primary btn-lg" onClick={save} disabled={saving}>
            {saving ? t('common.loading') : saved ? '✓ ' + t('myProfile.saved') : t('myProfile.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
