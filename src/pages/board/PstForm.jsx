import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import FileUpload from '@components/ui/FileUpload.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import RichEditor from '@components/ui/RichEditor.jsx';
import http from '@lib/http.js';
import { useMenuStore } from '@store/useMenuStore';
import { fetchAndConvertCommonCodes } from '@utils/commonUtils.js';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useMemo, useState } from 'react';
import {
  useMatches,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

const unwrapData = (response) => {
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }
  return response;
};

const toNullableNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const converted = Number(value);
  return Number.isNaN(converted) ? null : converted;
};

const normalizeYmd = (value) => {
  if (!value) return '';
  const digits = String(value).replace(/\D/g, '');
  return digits.length >= 8 ? digits.slice(0, 8) : '';
};

const getTodayYmd = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const createDefaultFormData = (bbsNo) => ({
  bbsNo: bbsNo || '',
  ctgryNo: '',
  pstTtl: '',
  pstCn: '',
  pstSrcCn: '',
  pstUrlAddr: '',
  pstAnsCn: '',
  atchFileId: '',
  rprsImgAtchFileId: '',
  upendPstgYn: 'N',
  pstgBgngYmd: getTodayYmd(),
  pstgEndYmd: getTodayYmd(),
  useYn: 'Y',
  pstRegMbrNo: '',
  pstRgtrNm: '',
});

const createDefaultAuditData = () => ({
  pstNo: '',
  pstRegDt: '',
  pstMdfcnDt: '',
  pstMdfrNm: '',
});

const mapExistingFile = (file) => ({
  id: `existing_${file?.atchFileId || ''}_${file?.atchFileSn || Math.random()}`,
  atchFileId: file?.atchFileId,
  atchFileSn: file?.atchFileSn,
  fileName: file?.orgnlFileNm || '',
  fileSize: Number(file?.fileSz || 0),
  status: 'existing',
});

const getDeletedExistingFileSns = (files = []) =>
  files
    .filter(
      (file) =>
        file?.status === 'deleted' &&
        file?.atchFileSn !== null &&
        file?.atchFileSn !== undefined
    )
    .map((file) => Number(file.atchFileSn))
    .filter((value) => Number.isFinite(value));

export default function PstForm() {
  const navigate = useNavigate();
  const matches = useMatches();
  const flatMenuMap = useMenuStore((state) => state.flatMenuMap);
  const [searchParams] = useSearchParams();
  const { bbsNo: bbsNoFromParams, pstNo } = useParams();
  const currentMenuId = useMemo(() => {
    const matchWithHandle = [...matches]
      .reverse()
      .find((match) => match.handle?.menuId);
    return matchWithHandle?.handle?.menuId || null;
  }, [matches]);
  const bbsNo = useMemo(() => {
    if (bbsNoFromParams) return String(bbsNoFromParams);

    const bbsNoFromQuery = searchParams.get('bbsNo');
    if (bbsNoFromQuery) return String(bbsNoFromQuery);

    if (!currentMenuId) return '';

    const mappedBbsNo = flatMenuMap?.[currentMenuId]?.bbsNo;
    if (
      mappedBbsNo === null ||
      mappedBbsNo === undefined ||
      mappedBbsNo === ''
    ) {
      return '';
    }

    return String(mappedBbsNo);
  }, [bbsNoFromParams, searchParams, currentMenuId, flatMenuMap]);
  const isEdit = Boolean(pstNo);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [bbsInfo, setBbsInfo] = useState(null);
  const [bbsTypeOptions, setBbsTypeOptions] = useState([]);
  const [formData, setFormData] = useState(() => createDefaultFormData(bbsNo));
  const [auditData, setAuditData] = useState(() => createDefaultAuditData());

  const [attachFiles, setAttachFiles] = useState([]);
  const [rprsImgFiles, setRprsImgFiles] = useState([]);

  const categoryOptions = useMemo(() => {
    if (!Array.isArray(bbsInfo?.categories)) return [];
    return bbsInfo.categories
      .filter((category) => (category?.useYn || 'Y') !== 'N')
      .map((category) => ({
        value: String(category?.ctgryNo),
        label: category?.ctgryNm || String(category?.ctgryNo),
      }));
  }, [bbsInfo]);

  const bbsTypeLabel = useMemo(() => {
    const bbsTypeCd = bbsInfo?.bbsTypeCd;
    if (!bbsTypeCd) return '';
    const matched = bbsTypeOptions.find((item) => item?.value === bbsTypeCd);
    return matched?.label || '';
  }, [bbsInfo, bbsTypeOptions]);

  const canWriteAnswer = useMemo(() => {
    const candidates = [
      String(bbsInfo?.bbsTypeCd || ''),
      String(bbsTypeLabel || ''),
    ]
      .map((value) => value.toUpperCase().replace(/\s+/g, ''))
      .filter(Boolean);

    return candidates.some(
      (value) => value.includes('QNA') || value.includes('Q&A')
    );
  }, [bbsInfo, bbsTypeLabel]);

  const canShowThumbnailImage = useMemo(() => {
    const candidates = [
      String(bbsInfo?.bbsTypeCd || ''),
      String(bbsTypeLabel || ''),
    ]
      .map((value) => value.toUpperCase())
      .filter(Boolean);

    return candidates
      .flatMap((value) => value.split(/[^A-Z0-9]+/).filter(Boolean))
      .some((token) => token === 'IMG' || token === 'VDO');
  }, [bbsInfo, bbsTypeLabel]);

  const isCategoryRequired =
    bbsInfo?.ctgryUseYn === 'Y' && categoryOptions.length > 0;

  useEffect(() => {
    if (isEdit) return;
    if (categoryOptions.length === 0) return;

    setFormData((prev) => {
      if (prev.ctgryNo) return prev;
      return {
        ...prev,
        ctgryNo: categoryOptions[0].value,
      };
    });
  }, [isEdit, categoryOptions]);

  const getCurrentMemberNo = () => {
    const candidates = [
      sessionStorage.getItem('mbrNo'),
      localStorage.getItem('mbrNo'),
      sessionStorage.getItem('memberNo'),
      localStorage.getItem('memberNo'),
    ];
    const value = candidates.find((item) => item && item.trim() !== '');
    return value || 'M000000000000001';
  };

  const getCurrentMemberName = () => {
    const candidates = [
      sessionStorage.getItem('mbrNm'),
      localStorage.getItem('mbrNm'),
      sessionStorage.getItem('memberNm'),
      localStorage.getItem('memberNm'),
      sessionStorage.getItem('userName'),
      localStorage.getItem('userName'),
    ];
    const value = candidates.find((item) => item && item.trim() !== '');
    return value || '관리자';
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyDetailToForm = (data) => {
    if (!data) return;

    setFormData((prev) => ({
      ...prev,
      bbsNo: data?.bbsNo || prev.bbsNo,
      ctgryNo:
        data?.ctgryNo === null || data?.ctgryNo === undefined
          ? ''
          : String(data.ctgryNo),
      pstTtl: data?.pstTtl || '',
      pstCn: data?.pstCn || '',
      pstSrcCn: data?.pstSrcCn || '',
      pstUrlAddr: data?.pstUrlAddr || '',
      pstAnsCn: data?.pstAnsCn || '',
      atchFileId: data?.atchFileId || '',
      rprsImgAtchFileId: data?.rprsImgAtchFileId || '',
      upendPstgYn: data?.upendPstgYn || 'N',
      pstgBgngYmd: normalizeYmd(data?.pstgBgngYmd) || prev.pstgBgngYmd,
      pstgEndYmd: normalizeYmd(data?.pstgEndYmd) || prev.pstgEndYmd,
      useYn: data?.useYn || 'Y',
      pstRegMbrNo: data?.pstRegMbrNo || prev.pstRegMbrNo || '',
      pstRgtrNm: data?.pstRgtrNm || prev.pstRgtrNm || '',
    }));

    setAuditData({
      pstNo: data?.pstNo || '',
      pstRegDt: data?.pstRegDt || data?.regDt || '',
      pstMdfcnDt: data?.pstMdfcnDt || data?.mdfcnDt || '',
      pstMdfrNm: data?.pstMdfrNm || '',
    });

    const existingAttachFiles = Array.isArray(data?.atchFiles)
      ? data.atchFiles.map(mapExistingFile)
      : [];
    const existingRprsImgFiles = Array.isArray(data?.rprsImgAtchFiles)
      ? data.rprsImgAtchFiles.map(mapExistingFile)
      : [];

    setAttachFiles(existingAttachFiles);
    setRprsImgFiles(existingRprsImgFiles.slice(0, 1));
  };

  useEffect(() => {
    const loadBbsTypeCodes = async () => {
      try {
        const codeData = await fetchAndConvertCommonCodes(['BBS_TYPE_CD']);
        setBbsTypeOptions(codeData?.BBS_TYPE_CD || []);
      } catch (error) {
        console.error('게시판 유형 코드 조회 실패:', error);
      }
    };

    loadBbsTypeCodes();
  }, []);

  useEffect(() => {
    if (!bbsNo) return;
    let active = true;

    const fetchInitialData = async () => {
      setLoading(true);
      setFormData(createDefaultFormData(bbsNo));
      setAuditData(createDefaultAuditData());
      setAttachFiles([]);
      setRprsImgFiles([]);

      try {
        const bbsResponse = await http.get(`/api/v1/board/bbs/${bbsNo}`);
        if (!active) return;

        const bbsDetail = unwrapData(bbsResponse);
        setBbsInfo(bbsDetail || null);

        if (isEdit) {
          const pstResponse = await http.get(
            `/api/v1/board/pst/${bbsNo}/${pstNo}`
          );
          if (!active) return;
          applyDetailToForm(unwrapData(pstResponse));
        }
      } catch (error) {
        console.error('게시물 데이터 조회 실패:', error);
        alert(
          error?.response?.data?.message || '게시물 정보를 불러오지 못했습니다.'
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchInitialData();
    return () => {
      active = false;
    };
  }, [bbsNo, isEdit, pstNo]);

  const validateForm = () => {
    const parsedBbsNo = toNullableNumber(bbsNo);
    if (parsedBbsNo === null) {
      alert('유효하지 않은 게시판 번호입니다.');
      return false;
    }

    if (formData.pstTtl.trim() === '') {
      alert('게시물 제목을 입력해주세요.');
      return false;
    }

    if (isCategoryRequired && formData.ctgryNo === '') {
      alert('카테고리를 선택해주세요.');
      return false;
    }

    const startDate = normalizeYmd(formData.pstgBgngYmd);
    const endDate = normalizeYmd(formData.pstgEndYmd);
    if (!startDate || !endDate) {
      alert('게시 기간을 입력해주세요.');
      return false;
    }
    if (startDate > endDate) {
      alert('게시 시작일은 종료일보다 클 수 없습니다.');
      return false;
    }

    return true;
  };

  const appendNewFiles = (multipart, partName, files) => {
    files
      .filter((file) => file?.status === 'new' && file?.file)
      .forEach((file) => {
        multipart.append(partName, file.file);
      });
  };

  const buildRequestData = () => {
    const memberNo = getCurrentMemberNo();
    const memberName = getCurrentMemberName();
    const parsedBbsNo = toNullableNumber(bbsNo);

    return {
      bbsNo: parsedBbsNo,
      ctgryNo: toNullableNumber(formData.ctgryNo),
      pstTtl: formData.pstTtl.trim(),
      pstCn: formData.pstCn || '',
      pstSrcCn: formData.pstSrcCn.trim(),
      pstUrlAddr: formData.pstUrlAddr.trim(),
      pstAnsCn: formData.pstAnsCn || '',
      atchFileId: formData.atchFileId.trim(),
      rprsImgAtchFileId: formData.rprsImgAtchFileId.trim(),
      upendPstgYn: formData.upendPstgYn || 'N',
      pstgBgngYmd: normalizeYmd(formData.pstgBgngYmd),
      pstgEndYmd: normalizeYmd(formData.pstgEndYmd),
      pstRegMbrNo: formData.pstRegMbrNo || memberNo,
      pstRgtrNm: formData.pstRgtrNm || memberName,
      pstMdfcnMbrNo: memberNo,
      pstMdfrNm: memberName,
      useYn: formData.useYn || 'Y',
    };
  };

  const handleSave = async () => {
    if (saving || deleting) return;
    if (!validateForm()) return;

    setSaving(true);
    try {
      const deletedAtchFileSns = getDeletedExistingFileSns(attachFiles);
      const deletedRprsImgAtchFileSns = getDeletedExistingFileSns(rprsImgFiles);

      const requestData = buildRequestData();
      const multipart = new FormData();

      multipart.append(
        'data',
        new Blob([JSON.stringify(requestData)], { type: 'application/json' })
      );
      appendNewFiles(multipart, 'atchFile', attachFiles);
      appendNewFiles(multipart, 'rprsImgAtchFile', rprsImgFiles);
      multipart.append(
        'fileStatusInfo',
        JSON.stringify({
          deletedAtchFileSns: isEdit ? deletedAtchFileSns : [],
          deletedRprsImgAtchFileSns: isEdit ? deletedRprsImgAtchFileSns : [],
        })
      );

      let saved = null;

      if (isEdit) {
        saved = await http.put(
          `/api/v1/board/pst/${bbsNo}/${pstNo}`,
          multipart,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        alert('게시물이 수정되었습니다.');
      } else {
        saved = await http.post('/api/v1/board/pst', multipart, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('게시물이 등록되었습니다.');
      }

      const responseData = unwrapData(saved);
      setFormData((prev) => ({
        ...prev,
        atchFileId: responseData?.atchFileId || prev.atchFileId,
        rprsImgAtchFileId:
          responseData?.rprsImgAtchFileId || prev.rprsImgAtchFileId,
      }));

      navigate('..', { state: { refreshListAt: Date.now() } });
    } catch (error) {
      console.error('게시물 저장 실패:', error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          '게시물 저장 중 오류가 발생했습니다.'
      );
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async () => {
    if (!isEdit || saving || deleting) return;
    if (!window.confirm('게시물을 삭제하시겠습니까?')) return;

    setDeleting(true);
    try {
      await http.delete(`/api/v1/board/pst/${bbsNo}/${pstNo}`);
      alert('게시물이 삭제되었습니다.');
      navigate('..');
    } catch (error) {
      console.error('게시물 삭제 실패:', error);
      alert(
        error?.response?.data?.message || '게시물 삭제 중 오류가 발생했습니다.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleGoToList = () => {
    if (
      window.confirm(
        '작성 중인 내용은 저장되지 않습니다. 목록으로 이동하시겠습니까?'
      )
    ) {
      navigate('..');
    }
  };

  if (loading) {
    return (
      <div className="oncontentbox full">
        <div className="oncontents">
          <div className="loading">데이터를 불러오는 중입니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>게시물 등록/수정</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>시스템 설정</li>
          <li>게시물 관리</li>
          <li>게시판 선택</li>
          <li>게시물 목록</li>
          <li className="on">게시물 등록/수정</li>
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
                  <td>게시물 ID</td>
                  <td>
                    {isEdit ? auditData.pstNo || pstNo || '-' : '자동생성'}
                  </td>
                  <td>작성자</td>
                  <td>홍길동</td>
                </tr>
                <tr>
                  <td>제목</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="500px"
                      value={formData.pstTtl}
                      onChange={(e) => handleChange('pstTtl', e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>내용</td>
                  <td colSpan={3}>
                    <RichEditor
                      theme="light"
                      value={formData.pstCn}
                      onChange={(value) => handleChange('pstCn', value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>출처</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="500px"
                      value={formData.pstSrcCn}
                      onChange={(e) => handleChange('pstSrcCn', e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>게시물 URL</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="500px"
                      value={formData.pstUrlAddr}
                      onChange={(e) =>
                        handleChange('pstUrlAddr', e.target.value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>게시 여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="useYn_y"
                        radioGroup="useYn"
                        radioValue="Y"
                        radioName="게시"
                        selectedValue={formData.useYn}
                        onChange={(value) => handleChange('useYn', value)}
                      />
                      <RadioButton
                        groupId="useYn_n"
                        radioGroup="useYn"
                        radioValue="N"
                        radioName="미게시"
                        selectedValue={formData.useYn}
                        onChange={(value) => handleChange('useYn', value)}
                      />
                    </div>
                  </td>
                  <td>상단 고정</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="upendPstgYn_y"
                        radioGroup="upendPstgYn"
                        radioValue="Y"
                        radioName="사용"
                        selectedValue={formData.upendPstgYn}
                        onChange={(value) => handleChange('upendPstgYn', value)}
                      />
                      <RadioButton
                        groupId="upendPstgYn_n"
                        radioGroup="upendPstgYn"
                        radioValue="N"
                        radioName="미사용"
                        selectedValue={formData.upendPstgYn}
                        onChange={(value) => handleChange('upendPstgYn', value)}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>카테고리</td>
                  <td>
                    <MenuInputBox
                      menuType="select"
                      menuSize="180px"
                      options={categoryOptions}
                      value={formData.ctgryNo}
                      showAllOption={!isCategoryRequired}
                      disabled={!isCategoryRequired}
                      onChange={(e) => handleChange('ctgryNo', e.target.value)}
                    />
                  </td>
                  <td>게시 기간</td>
                  <td>
                    <div className="ondatepickerbox">
                      <DatepickerBox
                        value={formData.pstgBgngYmd}
                        outputFormat="ymd"
                        onChange={(value) => handleChange('pstgBgngYmd', value)}
                      />
                      <span className="onunit">~</span>
                      <DatepickerBox
                        value={formData.pstgEndYmd}
                        outputFormat="ymd"
                        onChange={(value) => handleChange('pstgEndYmd', value)}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>첨부파일</td>
                  <td colSpan={3}>
                    <FileUpload
                      mode="edit"
                      maxFiles={5}
                      fileType="attachment"
                      files={attachFiles}
                      onFilesChange={setAttachFiles}
                    />
                  </td>
                </tr>
                {canShowThumbnailImage && (
                  <tr>
                    <td>썸네일 이미지</td>
                    <td colSpan={3}>
                      <FileUpload
                        mode="edit"
                        maxFiles={1}
                        fileType="attachment"
                        files={rprsImgFiles}
                        onFilesChange={setRprsImgFiles}
                      />
                    </td>
                  </tr>
                )}
                {isEdit && (
                  <>
                    <tr>
                      <td>작성자</td>
                      <td>{formData.pstRgtrNm || '-'}</td>
                      <td>작성일시</td>
                      <td>
                        {auditData.pstRegDt
                          ? formatDate(
                              auditData.pstRegDt,
                              'yyyy-MM-dd HH:mm:ss'
                            )
                          : '-'}
                      </td>
                    </tr>
                    <tr>
                      <td>수정자</td>
                      <td>{auditData.pstMdfrNm || '-'}</td>
                      <td>수정일시</td>
                      <td>
                        {auditData.pstMdfcnDt
                          ? formatDate(
                              auditData.pstMdfcnDt,
                              'yyyy-MM-dd HH:mm:ss'
                            )
                          : '-'}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {canWriteAnswer && (
            <>
              <h4 className="ontableTitle">답글 작성</h4>
              <div className="ontableBox">
                <table>
                  <colgroup>
                    <col style={{ width: '180px' }} />
                    <col style={{ width: 'auto' }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td>답글 내용</td>
                      <td>
                        <RichEditor
                          theme="light"
                          value={formData.pstAnsCn}
                          onChange={(value) => handleChange('pstAnsCn', value)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className="onflexbtns">
          <div style={{ marginRight: 'auto' }}>
            <Button btnType="list" btnNames="목록" onClick={handleGoToList} />
          </div>
          {isEdit && (
            <Button
              btnType="del"
              btnNames={deleting ? '삭제중...' : '삭제'}
              onClick={handleDelete}
            />
          )}
          <Button
            btnType="add"
            btnNames={saving ? '저장중...' : '저장'}
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
