import Button from '@components/ui/Button.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import RichEditor from '@components/ui/SmepEditor.jsx';
import TextareaBox from '@components/ui/TextareaBox.jsx';
import http from '@lib/http.js';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function CertificateForm() {
  const { prdocCd } = useParams();
  const navigate = useNavigate();

  // prdocCd 있으면 수정, 없으면 등록
  const isEditMode = !!prdocCd;
  const [loading, setLoading] = useState(isEditMode);

  const [formData, setFormData] = useState({
    prdocTtl: '',
    rlsYn: 'Y',
    jrsdInstNm: '',
    issuInstNm: '',
    drctIssuYn: 'Y',
    elpblYn: 'Y',
    otsdSiteUrlAddr: '',
    prdocExpln: '',
    moblPrdocExpln: '',
    prdocIssuGdCn: '',
    regDt: null,
    mdfcnDt: null,
  });

  useEffect(() => {
    if (isEditMode) {
      fetchCertificateDetail();
    }
  }, [prdocCd]);

  const [dataLoaded, setDataLoaded] = useState(!isEditMode);

  const fetchCertificateDetail = async () => {
    try {
      setLoading(true);
      const response = await http.get(`/api/v1/certificates/${prdocCd}`);
      const data = response.data;
      setFormData({
        prdocTtl: data.prdocTtl || '',
        rlsYn: data.rlsYn || 'Y',
        jrsdInstNm: data.jrsdInstNm || '',
        issuInstNm: data.issuInstNm || '',
        drctIssuYn: data.drctIssuYn || 'Y',
        elpblYn: data.elpblYn || 'Y',
        useYn: data.useYn || 'Y',
        otsdSiteUrlAddr: data.otsdSiteUrlAddr || '',
        prdocExpln: data.prdocExpln || '',
        moblPrdocExpln: data.moblPrdocExpln || '',
        prdocIssuGdCn: data.prdocIssuGdCn || '',
        regDt: data.regDt,
        mdfcnDt: data.mdfcnDt,
      });
    } catch (error) {
      console.error('증명서 정보 조회 실패:', error);
      alert('증명서 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
      setDataLoaded(true);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';
    return new Date(dateTime).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // MenuInputBox용 (이벤트 객체 → e.target.value 추출)
  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // RichEditor, TextareaBox용 (값 직접 전달)
  const handleChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleList = () => navigate('/prdocIssu/prdocInfo');

  const handleSave = async () => {
    const { regDt, mdfcnDt, ...requestBody } = formData;
    try {
      if (isEditMode) {
        await http.post(`/api/v1/certificates/update/${prdocCd}`, requestBody);
        alert('수정되었습니다.');
        navigate(`/prdocIssu/prdocInfo/${prdocCd}`);
      } else {
        await http.post('/api/v1/certificates', requestBody);
        alert('등록되었습니다.');
        navigate('/prdocIssu/prdocInfo');
      }
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    try {
      await http.post(`/api/v1/certificates/delete/${prdocCd}`);
      alert('삭제되었습니다.');
      navigate('/prdocIssu/prdocInfo');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>{isEditMode ? '증명서 정보 수정' : '증명서 정보 등록'}</h2>
        <ul className="onbreadcrumb">
          <li>증명서 발급 관리</li>
          <li>증명서 정보 관리</li>
          <li>증명서 정보 목록</li>
          <li className="on">
            {isEditMode ? '증명서 정보 수정' : '증명서 정보 등록'}
          </li>
        </ul>
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
                  <td>증명서 명</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.prdocTtl}
                      onChange={handleInputChange('prdocTtl')}
                    />
                  </td>
                  <td>공개여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="group1_1"
                        radioGroup="group1"
                        radioValue="공개"
                        radioName="공개"
                        selectedValue={
                          formData.rlsYn === 'Y' ? '공개' : '비공개'
                        }
                        onChange={(val) =>
                          setFormData((prev) => ({
                            ...prev,
                            rlsYn: val === '공개' ? 'Y' : 'N',
                          }))
                        }
                      />
                      <RadioButton
                        groupId="group1_2"
                        radioGroup="group1"
                        radioValue="비공개"
                        radioName="비공개"
                        selectedValue={
                          formData.rlsYn === 'Y' ? '공개' : '비공개'
                        }
                        onChange={(val) =>
                          setFormData((prev) => ({
                            ...prev,
                            rlsYn: val === '공개' ? 'Y' : 'N',
                          }))
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>소관기관</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.jrsdInstNm}
                      onChange={handleInputChange('jrsdInstNm')}
                    />
                  </td>
                  <td>발급기관</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="300px"
                      value={formData.issuInstNm}
                      onChange={handleInputChange('issuInstNm')}
                    />
                  </td>
                </tr>

                {/* 수정 모드에서만 등록/수정일시 노출 */}
                {isEditMode && (
                  <tr>
                    <td>등록일시</td>
                    <td>{formatDateTime(formData.regDt)}</td>
                    <td>최종수정일시</td>
                    <td>{formatDateTime(formData.mdfcnDt)}</td>
                  </tr>
                )}

                <tr>
                  <td>직접발급 여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="group2_1"
                        radioGroup="group2"
                        radioValue="직접발급"
                        radioName="직접발급"
                        selectedValue={
                          formData.drctIssuYn === 'Y'
                            ? '직접발급'
                            : '타서비스 링크'
                        }
                        onChange={(val) =>
                          setFormData((prev) => ({
                            ...prev,
                            drctIssuYn: val === '직접발급' ? 'Y' : 'N',
                          }))
                        }
                      />
                      <RadioButton
                        groupId="group2_2"
                        radioGroup="group2"
                        radioValue="타서비스 링크"
                        radioName="타서비스 링크"
                        selectedValue={
                          formData.drctIssuYn === 'Y'
                            ? '직접발급'
                            : '타서비스 링크'
                        }
                        onChange={(val) =>
                          setFormData((prev) => ({
                            ...prev,
                            drctIssuYn: val === '직접발급' ? 'Y' : 'N',
                          }))
                        }
                      />
                    </div>
                  </td>
                  <td>전자증명서 대상 여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="group3_1"
                        radioGroup="group3"
                        radioValue="대상"
                        radioName="대상"
                        selectedValue={
                          formData.elpblYn === 'Y' ? '대상' : '대상 아님'
                        }
                        onChange={(val) =>
                          setFormData((prev) => ({
                            ...prev,
                            elpblYn: val === '대상' ? 'Y' : 'N',
                          }))
                        }
                      />
                      <RadioButton
                        groupId="group3_2"
                        radioGroup="group3"
                        radioValue="대상 아님"
                        radioName="대상 아님"
                        selectedValue={
                          formData.elpblYn === 'Y' ? '대상' : '대상 아님'
                        }
                        onChange={(val) =>
                          setFormData((prev) => ({
                            ...prev,
                            elpblYn: val === '대상' ? 'Y' : 'N',
                          }))
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>타서비스 링크</td>
                  <td colSpan={3}>
                    <div className="onmenuspace">
                      <MenuInputBox
                        menuType="input"
                        menuName="서비스명"
                        menuSize="300px"
                        value={formData.prdocTtl}
                        onChange={handleInputChange('prdocTtl')}
                        disabled={true}
                      />
                      <MenuInputBox
                        menuType="input"
                        menuName="링크"
                        menuSize="300px"
                        value={formData.otsdSiteUrlAddr}
                        onChange={handleInputChange('otsdSiteUrlAddr')}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>내용(PC)</td>
                  <td colSpan={3}>
                    {dataLoaded && (
                      <RichEditor
                        theme="light"
                        value={formData.prdocExpln}
                        onChange={handleChange('prdocExpln')}
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <td>내용(모바일)</td>
                  <td colSpan={3}>
                    {dataLoaded && (
                      <RichEditor
                        theme="light"
                        value={formData.moblPrdocExpln}
                        onChange={handleChange('moblPrdocExpln')}
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <td>안내문구</td>
                  <td colSpan={3}>
                    <TextareaBox
                      menuSize="100%"
                      placeholder="검색어를 입력하세요."
                      value={formData.prdocIssuGdCn}
                      onChange={handleInputChange('prdocIssuGdCn')}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="onflexbtns">
          <div style={{ marginRight: 'auto' }}>
            <Button btnType="list" btnNames="목록" onClick={handleList} />
          </div>
          {isEditMode && formData.useYn === 'Y' && (
            <Button btnType="del" btnNames="삭제" onClick={handleDelete} />
          )}
          <Button btnType="add" btnNames="저장" onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}
