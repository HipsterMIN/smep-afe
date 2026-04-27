import Breadcrumb from '@components/ui/Breadcrumb.jsx';
import LoginInfoForm from '@pages/member/login-info/components/LoginInfoForm.jsx';

const PAGE_TITLE = '로그인 정보 수정';

export default function LoginInfoUpdate() {
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>{PAGE_TITLE}</h2>
        <Breadcrumb pageTitle={PAGE_TITLE} />
      </div>

      <div className="oncontents">
        <LoginInfoForm />
      </div>
    </div>
  );
}
