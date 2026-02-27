import { PUBLIC_ANNOUNCEMENT_TYPE } from './publicAnnouncementType.js';
import PublicAnnouncementDetail from '@pages/public-announcement/PublicAnnouncementDetail.jsx';

const LIST_PATH = '/sprtBiz/bizPbanc/hsSpcSplyBizPbanc';

export default function HousingSpecialSupplyAnnouncementDetail() {
  return (
    <PublicAnnouncementDetail
      bizPbancTypeCd={PUBLIC_ANNOUNCEMENT_TYPE.HOUSING_SPECIAL_SUPPLY}
      listPath={LIST_PATH}
    />
  );
}

