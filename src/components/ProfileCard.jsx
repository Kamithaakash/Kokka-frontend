import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ProfileCard.css';

const calcAge = (dob) => {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const DEFAULT_AVATAR_M = 'https://res.cloudinary.com/demo/image/upload/v1/avatar_male';
const DEFAULT_AVATAR_F = 'https://res.cloudinary.com/demo/image/upload/v1/avatar_female';

export default function ProfileCard({ profile }) {
  const { t } = useTranslation();
  const age = calcAge(profile.dateOfBirth);
  const photo = profile.profilePhoto ||
    (profile.gender === 'male' ? DEFAULT_AVATAR_M : DEFAULT_AVATAR_F);

  return (
    <div className="profile-card">
      {profile.isFeatured && (
        <div className="profile-card-featured-badge">⭐ {t('profile.featured')}</div>
      )}
      <div className="profile-card-image-wrap">
        <img
          src={photo}
          alt={profile.displayName}
          className="profile-card-image"
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${profile.displayName}&background=C2185B&color=fff&size=200`; }}
        />
        <div className="profile-card-overlay">
          <Link to={`/profile/${profile._id}`} className="btn btn-primary btn-sm">
            {t('browse.view_profile')}
          </Link>
        </div>
      </div>
      <div className="profile-card-body">
        <div className="profile-card-header">
          <h3 className="profile-card-name">{profile.displayName}</h3>
          {age && <span className="profile-card-age">{age}</span>}
        </div>
        <div className="profile-card-meta">
          {profile.religion && (
            <span className="profile-card-tag">🕊️ {profile.religion}</span>
          )}
          {profile.occupation?.industry && (
            <span className="profile-card-tag">💼 {profile.occupation.industry}</span>
          )}
          {profile.location?.city && (
            <span className="profile-card-tag">📍 {profile.location.city}</span>
          )}
        </div>
        {profile.education?.level && (
          <p className="profile-card-edu">🎓 {profile.education.level}</p>
        )}
      </div>
    </div>
  );
}
