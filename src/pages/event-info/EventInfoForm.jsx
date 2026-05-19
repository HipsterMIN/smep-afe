import Breadcrumb from '@components/ui/Breadcrumb.jsx';
import Button from '@components/ui/Button.jsx';
import FileUpload from '@components/ui/FileUpload.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import RichEditor from '@components/ui/RichEditor.jsx';
import http from '@lib/http.js';
import React, { useEffect, useState } from 'react';
import { useMatches, useNavigate, useParams } from 'react-router-dom';

// 목록 경로 (프로젝트 상황에 맞게 수정)
const LIST_PATH = '/infoPvsn/utlzInfo/evntInfo';

export default function EventInfoForm() {
  const navigate = useNavigate();
  const { evntInfoId } = useParams(); // URL 파라미터에서 ID 추출
  const isEdit = !!evntInfoId; // ID가 있으면 수정 모드
  const [hashtagInput, setHashtagInput] = useState('');
  const [noticeFiles, setNoticeFiles] = useState([]); // 공고문 (1개 고정)
  const [attachFiles, setAttachFiles] = useState([]); // 첨부파일 (최대 5개)
  const matches = useMatches();
  const routeMenuName =
    [...matches]
      .reverse()
      .map((match) => match?.handle?.menuNm)
      .find((menuNm) => typeof menuNm === 'string' && menuNm.trim()) ||
    '행사 정보';

  // 1. 상태 관리
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    evntInfoTtlNm: '',
    evntInfoFlfmtInstNm: '',
    evntInfoFldNm: '',
    evntInfoTypeNm: '',
    evntInfoRgnNm: '',
    rcptPrdCn: '',
    evntPrdCn: '',
    evntOtlnCn: '', // 행사개요
    hstgCn: '', // 해시태그 (문자열로 관리)
    srcUrlAddr: '',
    useYn: 'Y', // 사용 여부 (기본값 Y)
  });

  const ynrOptions = [
    { label: '사용', value: 'Y' },
    { label: '미사용', value: 'N' },
  ];

  const renderRadioGroup = (groupKey, value, options) => (
    <div className="onradioBox">
      {options.map((option, index) => (
        <RadioButton
          key={`${groupKey}_${option.value}`}
          // groupId가 중복되지 않도록 고유하게 생성
          groupId={`${groupKey}_${index + 1}`}
          radioGroup={groupKey}
          radioValue={option.value}
          radioName={option.label}
          selectedValue={value}
          onChange={(v) => handleInputChange(groupKey)(v)} // 기존 handleInputChange 구조에 맞춤
        />
      ))}
    </div>
  );

  // 3. 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEdit) {
      const fetchDetail = async () => {
        try {
          const res = await http.get(`/api/v1/event-info/${evntInfoId}`);
          const data = res.data?.data || res.data;
          console.log(data);
          const tags = parseHashtagJson(res.data?.hstgCn);
          setHashtagInput(tags.join(', '));

          const existingNoticeFiles = (res.data?.pbancDocAtchFiles ?? []).map(
            mapExistingFile
          );
          const existingAttachFiles = (res.data?.pbancAtchFiles ?? []).map(
            mapExistingFile
          );

          setNoticeFiles(existingNoticeFiles.slice(0, 1));
          setAttachFiles(existingAttachFiles);

          setForm({ ...data });
        } catch (error) {
          alert('데이터를 불러오는데 실패했습니다.');
          navigate(LIST_PATH);
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [evntInfoId, isEdit, navigate]);

  const mapExistingFile = (file) => ({
    id: file.atchFileSn, // React key/삭제용
    atchFileId: file.atchFileId, // 다운로드용
    atchFileSn: file.atchFileSn, // 다운로드용
    fileName: file.orgnlFileNm,
    fileSize: file.fileSz ?? 0,
    status: 'existing',
  });
  const extractVal = (v) => (v && v.target !== undefined ? v.target.value : v);
  // 4. 핸들러
  const handleInputChange = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: extractVal(value) }));
  };

  const handleSave = async () => {
    if (!form.evntInfoTtlNm.trim()) return alert('행사명을 입력하세요.');
    if (!window.confirm(isEdit ? '수정하시겠습니까?' : '등록하시겠습니까?'))
      return;

    setSaving(true);
    try {
      const formData = new FormData();

      const payload = {
        ...form,
        evntInfoId: form.evntInfoId || evntInfoId,
        hstgCn: toHashtagString(hashtagInput),
      };

      // console.log('전송 직전 데이터 확인:', payload);
      formData.append(
        'data',
        new Blob([JSON.stringify(payload)], { type: 'application/json' })
      );

      const visibleNoticeFiles = noticeFiles.filter(
        (f) => f.status !== 'deleted'
      );
      visibleNoticeFiles.forEach((file) => {
        if (file.status === 'new' && file.file) {
          formData.append('pbancDocAtchFile', file.file);
        }
      });

      // 첨부파일
      const visibleAttachFiles = attachFiles.filter(
        (f) => f.status !== 'deleted'
      );
      visibleAttachFiles.forEach((file) => {
        if (file.status === 'new' && file.file) {
          formData.append(`pbancAtchFile`, file.file);
        }
      });
      // 파일 상태 정보 전송
      const fileStatusInfo = {
        noticeFileCount: visibleNoticeFiles.length,
        attachFileCount: visibleAttachFiles.length,
        deletedNoticeFile: noticeFiles
          .filter((f) => f.status === 'deleted' && f.id && f.status !== 'new')
          .map((f) => f.id),
        deletedAttachFileIds: attachFiles
          .filter((f) => f.status === 'deleted' && f.id && f.status !== 'new')
          .map((f) => f.id),
      };
      formData.append('fileStatusInfo', JSON.stringify(fileStatusInfo));

      if (isEdit) {
        await http.post(`/api/v1/event-info/update/${evntInfoId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('수정되었습니다.');
      } else {
        await http.post('/api/v1/event-info', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('등록되었습니다.');
      }
      navigate(LIST_PATH);
    } catch (error) {
      alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const parseHashtagJson = (v) => {
    if (!v) return [];

    // 1. 이미 배열인 경우
    if (Array.isArray(v)) return v;

    try {
      // 2. JSON 형태인지 확인 ({"hstgCn": ["A", "B"]} 또는 ["A", "B"])
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.hstgCn)) return parsed.hstgCn;
    } catch (e) {
      // 3. JSON이 아니면 일반 콤마 구분 문자열로 간주 ("이거,저거")
      return String(v)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return [];
  };

  const toHashtagJsonString = (raw) => {
    const tags = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return JSON.stringify({ hstgCn: tags });
  };

  // JSON.stringify를 하지 않고, 그냥 콤마로 연결된 문자열만 만듭니다.
  const toHashtagString = (raw) => {
    if (!raw) return '';
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .join(','); // 결과: "이거,저거,요거"
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await http.post(`/api/v1/event-info/delete/${evntInfoId}`);
      alert('삭제되었습니다.');
      navigate(LIST_PATH);
    } catch (error) {
      alert('삭제 실패');
    }
  };

  if (loading)
    return (
      <div className="oncontentbox full">
        <div className="oncontents">로딩 중...</div>
      </div>
    );

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>{isEdit ? '행사 정보 수정' : '행사 정보 등록'}</h2>
        <Breadcrumb pageTitle={routeMenuName} />
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
                  <td>행사명</td>
                  <td colSpan="3">
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={form.evntInfoTtlNm}
                      onChange={handleInputChange('evntInfoTtlNm')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>분야</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={form.evntInfoFldNm || ''}
                      onChange={handleInputChange('evntInfoFldNm')}
                    />
                  </td>
                  <td>행사유형</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={form.evntInfoTypeNm || ''}
                      onChange={handleInputChange('evntInfoTypeNm')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>지역</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={form.evntInfoRgnNm || ''}
                      onChange={handleInputChange('evntInfoRgnNm')}
                    />
                  </td>
                  <td>수행기관</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={form.evntInfoFlfmtInstNm}
                      onChange={handleInputChange('evntInfoFlfmtInstNm')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>접수기간</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={form.rcptPrdCn}
                      onChange={handleInputChange('rcptPrdCn')}
                    />
                  </td>
                  <td>행사기간</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={form.evntPrdCn}
                      onChange={handleInputChange('evntPrdCn')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>출처 URL</td>
                  <td colSpan="3">
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={form.srcUrlAddr}
                      onChange={handleInputChange('srcUrlAddr')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    해시태그
                    <br />
                    ※쉼표 (&nbsp;,&nbsp;) 로 구분
                  </td>
                  <td colSpan="3">
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      placeholder=""
                      value={hashtagInput}
                      onChange={(v) =>
                        setHashtagInput(v?.target ? v.target.value : v)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>사용 여부</td>
                  <td>{renderRadioGroup('useYn', form.useYn, ynrOptions)}</td>
                </tr>
                <tr>
                  <td>행사개요</td>
                  <td colSpan="3">
                    <RichEditor
                      theme="light"
                      value={form.evntOtlnCn || ''}
                      onChange={handleInputChange('evntOtlnCn')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>공고문</td>
                  <td colSpan="3">
                    <FileUpload
                      mode="edit"
                      maxFiles={1}
                      fileType="notice"
                      files={noticeFiles}
                      onFilesChange={setNoticeFiles}
                    />
                    {form.strmdcsId && (
                      <a
                        href={`http://192.168.16.82:8088/e-paper/view/sd;streamdocsId=${form.strmdcsId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        미리보기임시
                      </a>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>첨부파일</td>
                  <td colSpan="3">
                    <FileUpload
                      mode="edit"
                      maxFiles={5}
                      fileType="attachment"
                      files={attachFiles}
                      onFilesChange={setAttachFiles}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="onflexbtns">
          <div style={{ marginRight: 'auto' }}>
            <Button
              btnType="list"
              btnNames="목록"
              onClick={() => navigate('..')}
            />
          </div>
          {isEdit && (
            <Button btnType="del" btnNames="삭제" onClick={handleDelete} />
          )}
          <Button
            btnType="add"
            btnNames={isEdit ? '수정' : '저장'}
            onClick={handleSave}
            disabled={saving}
          />
        </div>
      </div>
    </div>
  );
}
