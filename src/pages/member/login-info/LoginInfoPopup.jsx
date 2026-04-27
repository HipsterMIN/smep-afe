import Popup from '@components/ui/Popup.jsx';
import LoginInfoForm from '@pages/member/login-info/components/LoginInfoForm.jsx';
import PropTypes from 'prop-types';

const POPUP_TITLE = '로그인 정보 수정';

export default function LoginInfoPopup({ onClose }) {
  return (
    <Popup title={POPUP_TITLE} autoHeight={true} onClose={onClose}>
      <LoginInfoForm onClose={onClose} isPopup={true} />
    </Popup>
  );
}

LoginInfoPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
};
