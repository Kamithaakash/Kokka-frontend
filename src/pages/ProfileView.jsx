import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getProfileById, reportProfile } from '../services/profileService';
import './ProfileView.css';

const calcAge = (dob) => {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const REPORT_REASONS = ['Fake profile','Inappropriate content','Harassment','Spam','Other'];

export default function ProfileView() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    getProfileById(id)
      .then(r => { setProfile(r.data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [id]);

  const handleContact = () => {
    if (!user) return navigate('/login');
    navigate(`/inbox/${profile.userId}`);
  };

  const handleReport = async () => {
    if (!reportReason) return;
    await reportProfile(profile._id, { reason: reportReason });
    setReportSent(true);
    setShowReport(false);
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!profile) return (
    <div className="page-wrapper flex-center" style={{ minHeight: '80vh' }}>
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <p>Profile not found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/browse')}>Browse Profiles</button>
      </div>
    </div>
  );

  const age = calcAge(profile.dateOfBirth);
  const photos = profile.photos?.length > 0 ? profile.photos : [];
  const mainPhoto = photos[activePhoto] || profile.profilePhoto;

  return (
    <div className="profile-view-page page-wrapper fade-in">
      <div className="container">
        <button className="btn btn-secondary btn-sm back-btn" onClick={() => navigate(-1)}>← Back</button>

        <div className="pv-layout">
          {/* Left: Photos */}
          <div className="pv-photos-panel">
            <div className="pv-main-photo-wrap">
              {mainPhoto
                ? <img src={mainPhoto} alt={profile.displayName} className="pv-main-photo"
                    onError={e => e.target.src=`https://ui-avatars.com/api/?name=${profile.displayName}&background=C2185B&color=fff&size=400`} />
                : <div className="pv-main-photo pv-photo-placeholder">
                    {profile.displayName?.[0]?.toUpperCase()}
                  </div>
              }
              {profile.isFeatured && <div className="pv-featured-chip">⭐ {t('profile.featured')}</div>}
            </div>
            {photos.length > 1 && (
              <div className="pv-thumbnails">
                {photos.map((ph, i) => (
                  <img key={i} src={ph} onClick={() => setActivePhoto(i)}
                    className={`pv-thumb ${i === activePhoto ? 'active' : ''}`}
                    onError={e => e.target.style.display='none'}
                    alt="" />
                ))}
              </div>
            )}
            <div className="pv-action-btns">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleContact}>
                💬 {t('profile.contact')}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowReport(true)}>⚠</button>
            </div>
            {reportSent && <div className="alert alert-success">{t('profile.report_submitted')}</div>}
          </div>

          {/* Right: Details */}
          <div className="pv-details">
            <div className="pv-header">
              <div>
                <h1 className="pv-name">{profile.displayName}</h1>
                <div className="pv-subline">
                  {age && <span className="badge badge-primary">{t('profile.age', { age })}</span>}
                  {profile.location?.city && <span>📍 {profile.location.city}{profile.location.province && `, ${profile.location.province}`}</span>}
                  <span>👁 {t('profile.views', { count: profile.views || 0 })}</span>
                </div>
              </div>
            </div>

            <div className="divider" />

            {/* Basic Info */}
            <div className="pv-section">
              <h3 className="pv-section-title">{t('profile.basic_info')}</h3>
              <div className="pv-info-grid">
                {profile.religion && <PVField icon="🕊️" label="Religion" value={profile.religion} />}
                {profile.ethnicity && <PVField icon="🌏" label="Ethnicity" value={profile.ethnicity} />}
                {profile.maritalStatus && <PVField icon="💍" label="Marital Status" value={profile.maritalStatus.replace(/_/g,' ')} />}
                {profile.height && <PVField icon="📏" label="Height" value={`${profile.height} cm`} />}
                {profile.nationality && <PVField icon="🏳️" label="Nationality" value={profile.nationality} />}
              </div>
            </div>

            {/* Education & Career */}
            {(profile.education?.level || profile.occupation?.jobTitle) && (
              <div className="pv-section">
                <h3 className="pv-section-title">{t('profile.education_career')}</h3>
                <div className="pv-info-grid">
                  {profile.education?.level && <PVField icon="🎓" label="Education" value={`${profile.education.level}${profile.education.field ? ` — ${profile.education.field}` : ''}`} />}
                  {profile.occupation?.jobTitle && <PVField icon="💼" label="Job Title" value={profile.occupation.jobTitle} />}
                  {profile.occupation?.industry && <PVField icon="🏭" label="Industry" value={profile.occupation.industry} />}
                  {profile.occupation?.incomeRange && <PVField icon="💰" label="Income" value={profile.occupation.incomeRange} />}
                </div>
              </div>
            )}

            {/* Lifestyle */}
            {(profile.lifestyle?.hobbies?.length > 0 || profile.lifestyle?.dietType) && (
              <div className="pv-section">
                <h3 className="pv-section-title">{t('profile.lifestyle')}</h3>
                <div className="pv-info-row">
                  <PVField icon="🥗" label="Diet" value={profile.lifestyle.dietType} />
                  <PVField icon="🚬" label="Smoking" value={profile.lifestyle.smoking ? 'Yes' : 'No'} />
                  <PVField icon="🍷" label="Drinking" value={profile.lifestyle.drinking ? 'Yes' : 'No'} />
                </div>
                {profile.lifestyle.hobbies?.length > 0 && (
                  <div className="pv-hobbies">
                    {profile.lifestyle.hobbies.map(h => <span key={h} className="tag">{h}</span>)}
                  </div>
                )}
              </div>
            )}

            {/* About Me */}
            {profile.aboutMe && (
              <div className="pv-section">
                <h3 className="pv-section-title">{t('profile.about_me')}</h3>
                <p className="pv-about-text">{profile.aboutMe}</p>
              </div>
            )}

            {/* Partner Expectations */}
            {profile.partnerExpectations && (
              <div className="pv-section">
                <h3 className="pv-section-title">{t('profile.looking_for')}</h3>
                <p className="pv-about-text">{profile.partnerExpectations}</p>
              </div>
            )}

            <button className="btn btn-primary btn-lg" onClick={handleContact} style={{ width:'100%', marginTop: 8 }}>
              💬 {t('profile.contact')}
            </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReport && (
        <div className="pv-modal-overlay" onClick={() => setShowReport(false)}>
          <div className="pv-modal card" onClick={e => e.stopPropagation()}>
            <h3>Report Profile</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Why are you reporting this profile?</p>
            <div className="pv-report-reasons">
              {REPORT_REASONS.map(r => (
                <label key={r} className="filter-checkbox">
                  <input type="radio" name="reason" value={r}
                    checked={reportReason === r} onChange={() => setReportReason(r)} />
                  <span>{r}</span>
                </label>
              ))}
            </div>
            <div className="pv-modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowReport(false)}>{t('common.cancel')}</button>
              <button className="btn btn-danger" onClick={handleReport} disabled={!reportReason}>Submit Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const PVField = ({ icon, label, value }) => (
  <div className="pv-field">
    <span className="pv-field-icon">{icon}</span>
    <div>
      <div className="pv-field-label">{label}</div>
      <div className="pv-field-value">{value}</div>
    </div>
  </div>
);
