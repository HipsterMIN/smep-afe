import icoLogo from '../assets/images/common/login_logo.svg';
import CheckBox from '../components/ui/CheckBox.jsx';

export default function Login() {
  return (
    <div className="wrapper">
      <div className="onLoginInner">
        <div className="onLoginViewBox">
          <div className="onContents">
            <h1 class="onLoginlogo">
              <a href="#">
                <img src={icoLogo} alt="중소기업통합플랫폼" />
              </a>
            </h1>
            <h4>관리자</h4>
            <div className="loginform">
              <label htmlFor="loginId" className="id">
                <input type="text" id="loginId" placeholder="아이디" />
              </label>

              <label htmlFor="loginPw" className="pw">
                <input type="text" id="loginPw" placeholder="비밀번호" />
              </label>
            </div>
            <div className="autochkform">
              <CheckBox chkId="autoIdChk" id="autoidchk" chkName="아이디 저장" />
            </div>
            <div className="btnsform">
              <button className="loginBtn">로그인</button>
              <button className="changeBtn">공인인증서 등록/변경</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
