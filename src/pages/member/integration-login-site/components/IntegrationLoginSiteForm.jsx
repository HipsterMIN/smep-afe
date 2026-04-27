import Breadcrumb from '@components/ui/Breadcrumb.jsx';
import Button from '@components/ui/Button.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import http from '@lib/http.js';
import { formatDate } from '@utils/stringUtils.js';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useMatches, useNavigate, useParams } from 'react-router-dom';

function IntegrationLoginSiteForm({ mode }) {
  const matches = useMatches();
  const navigate = useNavigate();
  const { id: linkSiteCd } = useParams();

  const isUpdateMode = mode === 'update';
  const routeMenuName =
    [...matches]
      .reverse()
      .map((match) => match?.handle?.menuNm)
      .find((menuNm) => typeof menuNm === 'string' && menuNm.trim()) || '';
  const pageTitle = '통합로그인 사이트 등록/수정' || routeMenuName;
  const defaultRadioValues = {
    prtlSysExpsrYn: 'Y',
    useYn: 'Y',
    linkUseTrgtSeCd: 'IND',
  };
  const defaultSiteCodeValidation = {
    checkedCode: '',
    available: null,
    loading: false,
  };

  const validateForm = () => {
    const trimmedSiteCode = siteCode.trim();
    const trimmedSiteNm = siteNm.trim();
    const trimmedSiteExpln = siteExpln.trim();
    const trimmedSiteUrlAddr = siteUrlAddr.trim();
    const trimmedSiteMngInstNm = siteMngInstNm.trim();
    const trimmedSitePicNm = sitePicNm.trim();

    if (isUpdateMode && !linkSiteCd) {
      alert('수정 대상 사이트코드가 없습니다.');
      return false;
    }

    if (!isUpdateMode) {
      if (!trimmedSiteCode) {
        alert('사이트코드를 입력해주세요.');
        return false;
      }
      if (trimmedSiteCode.length !== 4) {
        alert('사이트코드는 4자리로 입력해주세요.');
        return false;
      }
    }

    if (!trimmedSiteNm) {
      alert('사이트명을 입력해주세요.');
      return false;
    }

    if (!inkUseTrgtSeCd) {
      alert('회원구분을 입력해주세요.');
      return false;
    }

    if (!prtlSysExpsrYn) {
      alert('노출여부를 입력해주세요.');
      return false;
    }

    if (!useYn) {
      alert('사용여부를 입력해주세요.');
      return false;
    }

    if (trimmedSiteNm.length > 100) {
      alert('사이트명은 100자 이하로 입력해주세요.');
      return false;
    }

    if (trimmedSiteUrlAddr && trimmedSiteUrlAddr.length > 2000) {
      alert('사이트 URL은 2000자 이하로 입력해주세요.');
      return false;
    }

    if (trimmedSiteMngInstNm && trimmedSiteMngInstNm.length > 80) {
      alert('관리기관 명은 80자 이하로 입력해주세요.');
      return false;
    }

    if (trimmedSitePicNm && trimmedSitePicNm.length > 80) {
      alert('담당자 명은 80자 이하로 입력해주세요.');
      return false;
    }

    if (trimmedSiteExpln && trimmedSiteExpln.length > 4000) {
      alert('사이트 설명은 4000자 이하로 입력해주세요.');
      return false;
    }

    return true;
  };

  // 기존 radio button 분기변수 (퍼블리싱 유지)
  const [prtlSysExpsrYn, setPrtlSysExpsrYn] = useState(null);
  const [useYn, setUseYn] = useState(null);
  const [inkUseTrgtSeCd, setInkUseTrgtSeCd] = useState(null);

  // 추가 폼 데이터
  const [siteCode, setSiteCode] = useState('');
  const [siteNm, setSiteNm] = useState('');
  const [siteExpln, setSiteExpln] = useState('');
  const [siteUrlAddr, setSiteUrlAddr] = useState('');
  const [siteMngInstNm, setSiteMngInstNm] = useState('');
  const [sitePicNm, setSitePicNm] = useState('');
  const [siteCodeValidation, setSiteCodeValidation] = useState(
    defaultSiteCodeValidation
  );

  // 읽기 전용 데이터
  const [regDt, setRegDt] = useState('');
  const [rgtrId, setRgtrId] = useState('');
  const [mdfcnDt, setMdfcnDt] = useState('');

  // 수정 모드일 때 데이터 조회
  useEffect(() => {
    if (isUpdateMode && linkSiteCd) {
      fetchLinkSiteDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateMode, linkSiteCd]);

  useEffect(() => {
    if (!isUpdateMode) {
      setPrtlSysExpsrYn(defaultRadioValues.prtlSysExpsrYn);
      setUseYn(defaultRadioValues.useYn);
      setInkUseTrgtSeCd(defaultRadioValues.linkUseTrgtSeCd);
    }
  }, [isUpdateMode]);

  useEffect(() => {
    if (isUpdateMode) return;

    const trimmedCode = siteCode.trim();
    if (trimmedCode.length !== 4) {
      resetSiteCodeValidation();
      return;
    }

    const timeoutId = setTimeout(() => {
      validateSiteCodeAvailability(trimmedCode);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [isUpdateMode, siteCode]);

  // 연계사이트 상세 조회
  const fetchLinkSiteDetail = async () => {
    try {
      const response = await http.get(`/api/v1/linksite/${linkSiteCd}`);
      const data = response?.data;
      if (data) {
        setSiteCode(data.linkSiteCd || '');
        setSiteNm(data.siteNm || '');
        setSiteExpln(data.siteExpln || '');
        setSiteUrlAddr(data.siteUrlAddr || '');
        setSiteMngInstNm(data.siteMngInstNm || '');
        setSitePicNm(data.sitePicNm || '');
        setPrtlSysExpsrYn(data.prtlSysExpsrYn || null);
        setUseYn(data.useYn || null);
        setInkUseTrgtSeCd(data.linkUseTrgtSeCd || null);
        setRegDt(data.regDt || '');
        setRgtrId(data.rgtrId || '');
        setMdfcnDt(data.mdfcnDt || '');
      }
    } catch (error) {
      console.error('연계사이트 조회 실패:', error);
      alert('연계사이트 정보를 불러오는데 실패했습니다.');
    }
  };

  const resetSiteCodeValidation = () => {
    if (!isUpdateMode) {
      setSiteCodeValidation(defaultSiteCodeValidation);
    }
  };

  const validateSiteCodeAvailability = async (code) => {
    const trimmedCode = code.trim();
    if (!trimmedCode || trimmedCode.length !== 4) return null;

    setSiteCodeValidation((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      const response = await http.get(
        `/api/v1/linksite/validate/${trimmedCode}`
      );
      const available = Boolean(response?.data?.available);
      setSiteCodeValidation({
        checkedCode: trimmedCode,
        available,
        loading: false,
      });
      return available;
    } catch (error) {
      console.error('사이트코드 중복 확인 실패:', error);
      setSiteCodeValidation((prev) => ({
        ...prev,
        loading: false,
      }));
      alert('사이트코드 중복 확인에 실패했습니다.');
      return null;
    }
  };

  // 저장 (등록/수정)
  const handleSave = async () => {
    if (!validateForm()) return;

    if (!isUpdateMode) {
      const trimmedSiteCode = siteCode.trim();
      let available = siteCodeValidation.available;
      if (
        siteCodeValidation.checkedCode !== trimmedSiteCode ||
        available === null
      ) {
        available = await validateSiteCodeAvailability(trimmedSiteCode);
      }
      if (!available) {
        alert('이미 등록된 사이트코드입니다.');
        return;
      }
    }

    const requestData = {
      linkUseTrgtSeCd: inkUseTrgtSeCd,
      siteNm: siteNm.trim(),
      siteUrlAddr: siteUrlAddr.trim(),
      siteMngInstNm: siteMngInstNm.trim(),
      sitePicNm: sitePicNm.trim(),
      prtlSysExpsrYn,
      srvcSiteLinkYn: 'Y',
      srvcImgFileNm: '',
      srvcImgFilePathNm: '',
      siteExpln: siteExpln.trim(),
      useYn,
    };

    // 등록 모드일 때만 linkSiteCd 추가
    if (!isUpdateMode) {
      requestData.linkSiteCd = siteCode.trim();
    }

    try {
      if (isUpdateMode) {
        await http.put(`/api/v1/linksite/${linkSiteCd}`, requestData);
        alert('수정되었습니다.');
      } else {
        await http.post('/api/v1/linksite', requestData);
        alert('등록되었습니다.');
      }
      navigate('..');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await http.delete(`/api/v1/linksite/${linkSiteCd}`);
      alert('삭제되었습니다.');
      navigate('..');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  // 목록으로
  const handleGoList = () => {
    navigate('..');
  };

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>{pageTitle}</h2>
        <Breadcrumb pageTitle={pageTitle} />
      </div>
      <div className="oncontents">
        <div className="oncontent ontable-form">
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>사이트코드</td>
                  <td>
                    {isUpdateMode ? (
                      siteCode // 수정 모드: 읽기 전용
                    ) : (
                      <MenuInputBox // 등록 모드: 입력 가능
                        menuType="input"
                        menuSize="150px"
                        value={siteCode}
                        onChange={(e) => {
                          setSiteCode(e.target.value);
                          resetSiteCodeValidation();
                        }}
                      />
                    )}
                  </td>
                  <td>사이트명</td>
                  <td>
                    <MenuInputBox // 항상 입력 가능
                      menuType="input"
                      menuSize="150px"
                      value={siteNm}
                      onChange={(e) => setSiteNm(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>사이트 설명</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="500px"
                      value={siteExpln}
                      onChange={(e) => setSiteExpln(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>사이트 URL</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="500px"
                      value={siteUrlAddr}
                      onChange={(e) => setSiteUrlAddr(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>관리기관 명</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="500px"
                      value={siteMngInstNm}
                      onChange={(e) => setSiteMngInstNm(e.target.value)}
                    />
                  </td>
                  <td>담당자 명</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="500px"
                      value={sitePicNm}
                      onChange={(e) => setSitePicNm(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>노출여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="group1_1"
                        radioGroup="group1"
                        radioValue="Y"
                        radioName="노출"
                        selectedValue={prtlSysExpsrYn}
                        onChange={setPrtlSysExpsrYn}
                      />
                      <RadioButton
                        groupId="group1_2"
                        radioGroup="group1"
                        radioValue="N"
                        radioName="노출 안함"
                        selectedValue={prtlSysExpsrYn}
                        onChange={setPrtlSysExpsrYn}
                      />
                    </div>
                  </td>
                  <td>사용여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="group2_1"
                        radioGroup="group2"
                        radioValue="Y"
                        radioName="사용"
                        selectedValue={useYn}
                        onChange={setUseYn}
                      />
                      <RadioButton
                        groupId="group2_2"
                        radioGroup="group2"
                        radioValue="N"
                        radioName="사용 안함"
                        selectedValue={useYn}
                        onChange={setUseYn}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>회원구분</td>
                  <td colSpan={3}>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="group3_1"
                        radioGroup="group3"
                        radioValue="IND"
                        radioName="개인"
                        selectedValue={inkUseTrgtSeCd}
                        onChange={setInkUseTrgtSeCd}
                      />
                      <RadioButton
                        groupId="group3_2"
                        radioGroup="group3"
                        radioValue="ENT"
                        radioName="기업"
                        selectedValue={inkUseTrgtSeCd}
                        onChange={setInkUseTrgtSeCd}
                      />
                      <RadioButton
                        groupId="group3_3"
                        radioGroup="group3"
                        radioValue="ALL"
                        radioName="모든 회원"
                        selectedValue={inkUseTrgtSeCd}
                        onChange={setInkUseTrgtSeCd}
                      />
                    </div>
                  </td>
                </tr>
                {isUpdateMode && (
                  <>
                    <tr>
                      <td>등록일시</td>
                      <td>
                        {regDt ? formatDate(regDt, 'yyyy-MM-dd HH:mm:ss') : '-'}
                      </td>
                      <td>등록자</td>
                      <td>{rgtrId || '-'}</td>
                    </tr>
                    <tr>
                      <td>최종수정일시</td>
                      <td colSpan={3}>
                        {mdfcnDt
                          ? formatDate(mdfcnDt, 'yyyy-MM-dd HH:mm:ss')
                          : '-'}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="onflexbtns">
          <div style={{ marginRight: 'auto' }}>
            <Button btnType="list" btnNames="목록" onClick={handleGoList} />
          </div>
          {isUpdateMode && (
            <Button btnType="del" btnNames="삭제" onClick={handleDelete} />
          )}
          <Button btnType="add" btnNames="저장" onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}

IntegrationLoginSiteForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'update']).isRequired,
};

export default IntegrationLoginSiteForm;
