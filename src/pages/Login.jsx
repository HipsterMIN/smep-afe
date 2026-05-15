import '@styles/onCommon.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import icoLogo from '../assets/images/common/login_logo.svg';
import CheckBox from '../components/ui/CheckBox.jsx';
import { useAuth } from '../context/AuthContext';

const SAVED_USERNAME_KEY = 'smep-admin:login:username';

const getSavedUsername = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(SAVED_USERNAME_KEY) || '';
};

export default function Login() {
  const [username, setUsername] = useState(getSavedUsername);
  const [password, setPassword] = useState('');
  const [isUsernameSaved, setIsUsernameSaved] = useState(
    () => !!getSavedUsername()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, temporaryLogin } = useAuth();

  const updateSavedUsername = (nextUsername) => {
    if (typeof window === 'undefined') {
      return;
    }

    if (isUsernameSaved) {
      window.localStorage.setItem(SAVED_USERNAME_KEY, nextUsername);
      return;
    }

    window.localStorage.removeItem(SAVED_USERNAME_KEY);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const res = await login(username, password);
    if (res.success) {
      updateSavedUsername(username);
      navigate('/');
    } else {
      setError(res.error || '로그인에 실패했습니다.');
      setIsSubmitting(false);
    }
  };

  const onUsernameSaveChange = ({ checked }) => {
    setIsUsernameSaved(checked);

    if (!checked && typeof window !== 'undefined') {
      window.localStorage.removeItem(SAVED_USERNAME_KEY);
    }
  };

  const onTemporaryLogin = async () => {
    setError('');
    setIsSubmitting(true);

    const res = await temporaryLogin(username || 'cmsadmin');
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error || '임시로그인에 실패했습니다.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="onLoginInner">
        <div className="onLoginViewBox">
          <form className="onContents" onSubmit={onSubmit}>
            <h1 className="onLoginlogo">
              <a href="/" aria-label="중소기업통합플랫폼 홈">
                <img src={icoLogo} alt="중소기업통합플랫폼" />
              </a>
            </h1>
            <h4>관리자</h4>
            <div className="loginform">
              <label htmlFor="loginId" className="id">
                <span className="sr-only">아이디</span>
                <input
                  type="text"
                  id="loginId"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="아이디"
                  autoComplete="username"
                />
              </label>

              <label htmlFor="loginPw" className="pw">
                <span className="sr-only">비밀번호</span>
                <input
                  type="password"
                  id="loginPw"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  autoComplete="current-password"
                />
              </label>
            </div>
            {/* 퍼블리싱의 좌측 여백은 유지하되 모바일 수평 overflow가 생기지 않도록 폭만 줄인다. */}
            <div className="autochkform" style={{ width: 'calc(100% - 18px)' }}>
              <CheckBox
                chkId="autoIdChk"
                chkName="아이디 저장"
                checked={isUsernameSaved}
                onChange={onUsernameSaveChange}
              />
            </div>
            {error && (
              <p
                role="alert"
                style={{
                  width: '100%',
                  margin: '0 0 16px',
                  color: '#BD2C0F',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {error}
              </p>
            )}
            <div className="btnsform">
              <button
                className="loginBtn"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? '로그인 중...' : '로그인'}
              </button>
              {/* 간편인증 연계 전까지 표시 슬롯을 유지하고, 개발용 임시로그인은 아래 버튼에서만 처리한다. */}
              <button
                className="changeBtn"
                type="button"
                disabled={isSubmitting}
              >
                공동인증서 인증
              </button>
              <button
                className="changeBtn"
                type="button"
                onClick={onTemporaryLogin}
                disabled={isSubmitting}
                style={{ marginTop: 12 }}
              >
                임시로그인
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
