import PublicAnnouncement from '@pages/public-announcement/PublicAnnouncement.jsx';
import { PUBLIC_ANNOUNCEMENT_TYPE } from './publicAnnouncementType.js';

export default function HousingSpecialSupplyAnnouncement() {
  return (
    <PublicAnnouncement
      bizPbancTypeCd={PUBLIC_ANNOUNCEMENT_TYPE.HOUSING_SPECIAL_SUPPLY}
    />
  );
}

