import Breadcrumb from '@components/ui/Breadcrumb.jsx';
import Button from '@components/ui/Button.jsx';
import FileUpload from '@components/ui/FileUpload.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import http from '@lib/http.js';
import { fetchAndConvertCommonCodes } from '@utils/commonUtils.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMatches } from 'react-router-dom';
import {Willow} from "@svar-ui/react-grid";

const API_BASE_URL = '/api/v1/portal-mng/rlvnt-sys';
const RLVNT_SYS_BIZ_TYPE_CODE_GROUP = 'RLVNT_INST_SYS_BIZ_TYPE_CD';

const createEmptyForm = () => ({
  rlvntInstSysMngSn: null,
  rlvntInstSysBizTypeCd: '',
  rlvntInstInstNm: '',
  rlvntInstSysNm: '',
  rlvntInstSysExplnCn: '',
  rlvntInstUrlAddr: '',
  rlvntInstThmbAtchFileId: '',
  expsrSeq: '',
  useYn: 'Y',
  rgtrId: '',
  regDt: '',
  mdfrId: '',
  mdfcnDt: '',
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

const appendNewFiles = (multipart, partName, files) => {
  files
    .filter((file) => file?.status === 'new' && file?.file)
    .forEach((file) => {
      multipart.append(partName, file.file);
    });
};

const getResponseData = (response) => {
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }
  return response;
};

const toText = (value) => (value == null ? '' : String(value));

const toOptionalText = (value) => {
  const trimmed = toText(value).trim();
  return trimmed ? trimmed : null;
};

const toOptionalNumber = (value) => {
  const trimmed = toText(value).trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatDateTime = (value) => {
  if (!value) return '-';

  if (Array.isArray(value) && value.length >= 5) {
    const [year, month, day, hour, minute] = value;
    const pad = (num) => String(num).padStart(2, '0');
    return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}`;
  }

  if (typeof value === 'string') {
    return value.replace('T', ' ').slice(0, 16);
  }

  return String(value);
};

export default function RlvntSysMng() {
  const matches = useMatches();
  const routeMenuName =
    [...matches]
      .reverse()
      .map((match) => match?.handle?.menuNm)
      .find((menuNm) => typeof menuNm === 'string' && menuNm.trim()) || '';
  const pageTitle = routeMenuName || '유관기관 시스템 관리';

  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedInstSysMngSn, setSelectedInstSysMngSn] = useState(null);
  const [bizTypeOptions, setBizTypeOptions] = useState([]);
  const [thmbFiles, setThmbFiles] = useState([]);

  const [searchParams, setSearchParams] = useState({
    rlvntInstSysBizTypeCd: '',
    rlvntInstInstNm: '',
    rlvntInstSysNm: '',
    useYn: '',
  });

  const [form, setForm] = useState(createEmptyForm);
  const rowsRef = useRef(rows);

  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);

  const isEditMode = selectedInstSysMngSn != null;

  const useYnOptions = useMemo(
    () => [
      { value: 'Y', label: '사용' },
      { value: 'N', label: '미사용' },
    ],
    []
  );


  const getBizTypeLabel = (code) => {
    if (!code) return '';
    const matchedCode = bizTypeOptions.find((item) => item?.value === code);
    return matchedCode?.label || code;
  };

  const handleSearchParamChange = (key, value) => {
    const nextValue = value?.target ? value.target.value : value;
    setSearchParams((prev) => ({
      ...prev,
      [key]: toText(nextValue),
    }));
  };

  const handleFormChange = (key, value) => {
    const nextValue = value?.target ? value.target.value : value;

    setForm((prev) => {
      if (key === 'expsrSeq') {
        return {
          ...prev,
          expsrSeq: toText(nextValue).replace(/[^\d]/g, ''),
        };
      }

      return {
        ...prev,
        [key]: toText(nextValue),
      };
    });
  };

  const resetForm = useCallback(() => {
    setSelectedInstSysMngSn(null);
    setForm(createEmptyForm());
    setThmbFiles([]);
  }, []);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await http.post(`${API_BASE_URL}/search`, {
        rlvntInstSysBizTypeCd: toText(searchParams.rlvntInstSysBizTypeCd).trim(),
        rlvntInstInstNm: toText(searchParams.rlvntInstInstNm).trim(),
        rlvntInstSysNm: toText(searchParams.rlvntInstSysNm).trim(),
        useYn: toText(searchParams.useYn).trim(),
      });

      const data = getResponseData(response);
      const list = Array.isArray(data) ? data : [];
      const mappedRows = list.map((item, index) => ({
        id: item?.rlvntInstSysMngSn ?? `row-${index}`,
        no: index + 1,
        ...item,
      }));

      setRows(mappedRows);

      if (
        selectedInstSysMngSn != null &&
        !mappedRows.some((row) => row.rlvntInstSysMngSn === selectedInstSysMngSn)
      ) {
        resetForm();
      }
    } catch (error) {
      console.error('Failed to fetch relevant institution list:', error);
      alert('목록 조회 중 오류가 발생했습니다.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [resetForm, searchParams, selectedInstSysMngSn]);

  const fetchDetail = useCallback(async (rlvntInstSysMngSn) => {
    if (rlvntInstSysMngSn == null) return;

    setDetailLoading(true);
    try {
      const response = await http.get(
        `${API_BASE_URL}/${encodeURIComponent(rlvntInstSysMngSn)}`
      );
      const detail = getResponseData(response);

      if (!detail) {
        alert('상세 정보가 없습니다.');
        return;
      }

      setSelectedInstSysMngSn(detail.rlvntInstSysMngSn ?? rlvntInstSysMngSn);
      setForm({
        rlvntInstSysMngSn: detail.rlvntInstSysMngSn ?? null,
        rlvntInstSysBizTypeCd: toText(detail.rlvntInstSysBizTypeCd),
        rlvntInstInstNm: toText(detail.rlvntInstInstNm),
        rlvntInstSysNm: toText(detail.rlvntInstSysNm),
        rlvntInstSysExplnCn: toText(detail.rlvntInstSysExplnCn),
        rlvntInstUrlAddr: toText(detail.rlvntInstUrlAddr),
        rlvntInstThmbAtchFileId: toText(detail.rlvntInstThmbAtchFileId),
        expsrSeq: detail.expsrSeq == null ? '' : toText(detail.expsrSeq),
        useYn: detail.useYn === 'N' ? 'N' : 'Y',
        rgtrId: toText(detail.rgtrId),
        regDt: detail.regDt || '',
        mdfrId: toText(detail.mdfrId),
        mdfcnDt: detail.mdfcnDt || '',
      });

      const existingThmbFiles = Array.isArray(detail?.rlvntInstThmbAtchFiles)
        ? detail.rlvntInstThmbAtchFiles.map(mapExistingFile)
        : [];
      setThmbFiles(existingThmbFiles.slice(0, 1));
    } catch (error) {
      console.error('Failed to fetch relevant institution detail:', error);
      alert('상세 조회 중 오류가 발생했습니다.');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleRowClick = useCallback(
    (row) => {
      const instSysMngSn = row?.rlvntInstSysMngSn;
      if (instSysMngSn == null) return;
      fetchDetail(instSysMngSn);
    },
    [fetchDetail]
  );

  const initGrid = useCallback(
    (api) => {
      api.on('select-row', (event) => {
        const selectedRow = rowsRef.current.find((row) => row.id === event.id);
        if (selectedRow) {
          handleRowClick(selectedRow);
        }
      });
    },
    [handleRowClick]
  );

  const handleSearch = () => {
    fetchList();
  };

  const handleSearchKeyDown = (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    fetchList();
  };

  const validateForm = () => {
    if (!toText(form.rlvntInstSysBizTypeCd).trim()) {
      alert('업종 구분을 선택해 주세요.');
      return false;
    }

    if (!toText(form.rlvntInstInstNm).trim()) {
      alert('기관명을 입력해 주세요.');
      return false;
    }

    if (!toText(form.rlvntInstSysNm).trim()) {
      alert('시스템명을 입력해 주세요.');
      return false;
    }

    if (
      toText(form.expsrSeq).trim() &&
      !/^\d+$/.test(toText(form.expsrSeq).trim())
    ) {
      alert('노출순서는 숫자만 입력할 수 있습니다.');
      return false;
    }

    return true;
  };

  const buildRequestPayload = () => ({
    rlvntInstSysBizTypeCd: toText(form.rlvntInstSysBizTypeCd).trim(),
    rlvntInstInstNm: toText(form.rlvntInstInstNm).trim(),
    rlvntInstSysNm: toText(form.rlvntInstSysNm).trim(),
    rlvntInstSysExplnCn: toOptionalText(form.rlvntInstSysExplnCn),
    rlvntInstUrlAddr: toOptionalText(form.rlvntInstUrlAddr),
    rlvntInstThmbAtchFileId: toOptionalText(form.rlvntInstThmbAtchFileId),
    expsrSeq: toOptionalNumber(form.expsrSeq),
    useYn: form.useYn === 'N' ? 'N' : 'Y',
  });

  const handleSave = async () => {
    if (!validateForm()) return;

    const saveMessage = isEditMode
      ? '선택한 항목을 수정하시겠습니까?'
      : '신규 항목을 등록하시겠습니까?';
    if (!window.confirm(saveMessage)) return;

    const deletedRlvntInstThmbAtchFileSns = getDeletedExistingFileSns(thmbFiles);
    const payload = buildRequestPayload();
    const multipart = new FormData();

    multipart.append(
      'data',
      new Blob([JSON.stringify(payload)], { type: 'application/json' })
    );
    appendNewFiles(multipart, 'rlvntInstThmbAtchFile', thmbFiles);
    multipart.append(
      'fileStatusInfo',
      JSON.stringify({
        deletedRlvntInstThmbAtchFileSns: isEditMode
          ? deletedRlvntInstThmbAtchFileSns
          : [],
      })
    );

    try {
      if (isEditMode) {
        const response = await http.post(
          `${API_BASE_URL}/update/${encodeURIComponent(selectedInstSysMngSn)}`,
          multipart,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        const updated = getResponseData(response);
        if (!updated) {
          alert('수정 대상이 존재하지 않습니다.');
          return;
        }

        alert('수정되었습니다.');
        await fetchList();
        await fetchDetail(selectedInstSysMngSn);
        return;
      }

      const response = await http.post(API_BASE_URL, multipart, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const created = getResponseData(response);

      alert('등록되었습니다.');
      await fetchList();

      if (created?.rlvntInstSysMngSn != null) {
        await fetchDetail(created.rlvntInstSysMngSn);
      } else {
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save relevant institution:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!isEditMode) {
      alert('삭제할 항목을 선택해 주세요.');
      return;
    }

    if (!window.confirm(`"${selectedInstSysMngSn}" 항목을 삭제하시겠습니까?`)) return;

    try {
      await http.post(`${API_BASE_URL}/delete/${encodeURIComponent(selectedInstSysMngSn)}`);
      alert('삭제되었습니다.');
      resetForm();
      await fetchList();
    } catch (error) {
      console.error('Failed to delete relevant institution:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const columns = [
    { id: 'no', header: '번호', width: 52 },
    {
      id: 'rlvntInstSysBizTypeCd',
      header: '업종구분',
      width: 120,
      template: (value) => getBizTypeLabel(value),
    },
    {
      id: 'rlvntInstInstNm',
      header: '기관명',
      width: 220,
      dataAlign: 'left',
    },
    {
      id: 'rlvntInstSysNm',
      header: '시스템명',
      width: 220,
      dataAlign: 'left',
    },
    {
      id: 'expsrSeq',
      header: '노출순서',
      width: 90,
    },
    {
      id: 'useYn',
      header: '사용여부',
      width: 90,
    },
    {
      id: 'rlvntInstUrlAddr',
      header: 'URL 주소',
      width: 320,
      dataAlign: 'left',
    },
  ];

  useEffect(() => {
    const loadCodes = async () => {
      try {
        const codeData = await fetchAndConvertCommonCodes([
          RLVNT_SYS_BIZ_TYPE_CODE_GROUP,
        ]);
        setBizTypeOptions(codeData?.[RLVNT_SYS_BIZ_TYPE_CODE_GROUP] || []);
      } catch (error) {
        console.error('공통코드 조회 실패 :', error);
      }
    };

    loadCodes();
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className="oncontentbox">
      <div className="oncontentTitle">
        <h2>{pageTitle}</h2>
        <Breadcrumb pageTitle={pageTitle} />
      </div>

      <div className="oncontents space ondivide" style={{ alignItems: 'flex-start' }}>
        <div className="oncontent">
          <div className="ongrid-form">
            <h4>유관기관 목록</h4>
            <div className="onselect-form open" style={{ minHeight: 'auto' }}>
              <div className="onparagraph">
                <MenuInputBox
                  menuType="select"
                  menuName="업종구분"
                  menuSize="180px"
                  options={bizTypeOptions}
                  value={searchParams.rlvntInstSysBizTypeCd}
                  onChange={(value) =>
                    handleSearchParamChange('rlvntInstSysBizTypeCd', value)
                  }
                />
                <MenuInputBox
                  menuType="input"
                  menuName="기관명"
                  menuSize="200px"
                  value={searchParams.rlvntInstInstNm}
                  onChange={(value) =>
                    handleSearchParamChange('rlvntInstInstNm', value)
                  }
                  onKeyDown={handleSearchKeyDown}
                />
                <MenuInputBox
                  menuType="input"
                  menuName="시스템명"
                  menuSize="200px"
                  value={searchParams.rlvntInstSysNm}
                  onChange={(value) =>
                    handleSearchParamChange('rlvntInstSysNm', value)
                  }
                  onKeyDown={handleSearchKeyDown}
                />
                <MenuInputBox
                  menuType="select"
                  menuName="사용여부"
                  menuSize="120px"
                  options={useYnOptions}
                  value={searchParams.useYn}
                  onChange={(value) => handleSearchParamChange('useYn', value)}
                />

                <div style={{ marginLeft: 'auto' }}>
                  <Button btnType="menuSearch" btnNames="검색" onClick={handleSearch} />
                </div>
              </div>
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>{rows.length}</b>건
            </span>
            <Button btnType="add" btnNames="신규" onClick={resetForm} />
          </div>

          <div className="ongrid-tableform">
            <Willow>
              <div
                style={{
                  height: 'max(420px, calc(100dvh - 430px))',
                  overflow: 'hidden',
                }}
              >
                <GridTable columns={columns} data={rows} gridProps={{ init: initGrid }}
                           useWillow={false}/>
              </div>
            </Willow>
          </div>
        </div>

        <div className="oncontent ontable-form">
          <h4>{isEditMode ? '유관기관 수정' : '유관기관 등록'}</h4>
          {detailLoading && (
            <div className="loading" style={{ marginBottom: 8 }}>
              상세 조회 중...
            </div>
          )}

          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '190px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '190px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>유관기관번호</td>
                  <td>{form.rlvntInstSysMngSn ?? '-'}</td>
                  <td>사용여부</td>
                  <td>
                    <div className="onradioBox">
                      <RadioButton
                        groupId="rlvnt-use-yn-y"
                        radioGroup="rlvnt-use-yn"
                        radioValue="Y"
                        radioName="사용"
                        selectedValue={form.useYn}
                        onChange={(value) => handleFormChange('useYn', value)}
                      />
                      <RadioButton
                        groupId="rlvnt-use-yn-n"
                        radioGroup="rlvnt-use-yn"
                        radioValue="N"
                        radioName="미사용"
                        selectedValue={form.useYn}
                        onChange={(value) => handleFormChange('useYn', value)}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>업종구분 *</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="select"
                      menuSize="320px"
                      showAllOption={false}
                      options={bizTypeOptions}
                      value={form.rlvntInstSysBizTypeCd}
                      onChange={(value) =>
                        handleFormChange('rlvntInstSysBizTypeCd', value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>기관명 *</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="320px"
                      value={form.rlvntInstInstNm}
                      onChange={(value) =>
                        handleFormChange('rlvntInstInstNm', value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>시스템명 *</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="320px"
                      value={form.rlvntInstSysNm}
                      onChange={(value) =>
                        handleFormChange('rlvntInstSysNm', value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>시스템 설명</td>
                  <td colSpan={3}>
                    <textarea
                      value={form.rlvntInstSysExplnCn}
                      onChange={(event) =>
                        handleFormChange('rlvntInstSysExplnCn', event)
                      }
                      style={{ width: '100%', minHeight: 90, resize: 'vertical' }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>URL 주소</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      value={form.rlvntInstUrlAddr}
                      onChange={(value) =>
                        handleFormChange('rlvntInstUrlAddr', value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>썸네일 이미지</td>
                  <td colSpan={3}>
                    <FileUpload
                      mode="edit"
                      maxFiles={1}
                      fileType="attachment"
                      files={thmbFiles}
                      onFilesChange={(nextFiles) => setThmbFiles(nextFiles.slice(0, 1))}
                    />
                  </td>
                </tr>
                <tr>
                  <td>노출순서</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="120px"
                      value={form.expsrSeq}
                      onChange={(value) => handleFormChange('expsrSeq', value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>등록자</td>
                  <td>{form.rgtrId || '-'}</td>
                  <td>등록일시</td>
                  <td>{formatDateTime(form.regDt)}</td>
                </tr>
                <tr>
                  <td>수정자</td>
                  <td>{form.mdfrId || '-'}</td>
                  <td>최종수정일시</td>
                  <td>{formatDateTime(form.mdfcnDt)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="onflexbtns" style={{ justifyContent: 'flex-end' }}>
            <Button
              btnType="add"
              btnNames={isEditMode ? '수정' : '등록'}
              onClick={handleSave}
            />
            <Button btnType="del" btnNames="삭제" onClick={handleDelete} />
          </div>
        </div>
      </div>
    </div>
  );
}
