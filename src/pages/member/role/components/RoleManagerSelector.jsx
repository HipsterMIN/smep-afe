import Button from '@components/ui/Button';
import CheckBox from '@components/ui/CheckBox';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import Popup from '@components/ui/Popup.jsx';
import http from '@lib/http.js';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const DEFAULT_SEARCH_KEYWORD = '';
const DEFAULT_FETCH_SIZE = 100;
const DEFAULT_ORG_NAME = '-';

function resolvePayload(response) {
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    const responseData = response.data;

    if (
      responseData &&
      typeof responseData === 'object' &&
      !Array.isArray(responseData)
    ) {
      return responseData.data ?? responseData;
    }

    return responseData ?? response ?? [];
  }

  return response ?? [];
}

export default function RoleManagerSelector({ roleId, onClose, onAdded }) {
  const [keyword, setKeyword] = useState(DEFAULT_SEARCH_KEYWORD);
  const [rows, setRows] = useState([]);
  const [selectedMemberNos, setSelectedMemberNos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchAvailableMembers(nextKeyword = DEFAULT_SEARCH_KEYWORD) {
      if (!roleId) {
        return;
      }

      setLoading(true);

      try {
        const normalizedKeyword = nextKeyword.trim();
        const response = await http.post(
          `/api/v1/roles/${roleId}/members/available/search`,
          {
            keyword: normalizedKeyword || null,
            size: DEFAULT_FETCH_SIZE,
          }
        );
        const payload = resolvePayload(response);
        const items = Array.isArray(payload) ? payload : [];

        if (!isMounted) {
          return;
        }

        setRows(
          items.map((item) => ({
            mbrNo: item?.mbrNo ?? null,
            lgnId: item?.lgnId ?? '-',
            mbrNm: item?.mbrNm ?? '-',
            orgNm: item?.orgNm ?? DEFAULT_ORG_NAME,
          }))
        );
        setSelectedMemberNos([]);
      } catch (error) {
        console.error('[RoleManagerSelector] 추가 가능 관리자 조회 실패', error);
        if (isMounted) {
          setRows([]);
          setSelectedMemberNos([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAvailableMembers(DEFAULT_SEARCH_KEYWORD);

    return () => {
      isMounted = false;
    };
  }, [roleId]);

  async function handleSearch() {
    if (!roleId) {
      return;
    }

    setLoading(true);

    try {
      const normalizedKeyword = keyword.trim();
      const response = await http.post(
        `/api/v1/roles/${roleId}/members/available/search`,
        {
          keyword: normalizedKeyword || null,
          size: DEFAULT_FETCH_SIZE,
        }
      );
      const payload = resolvePayload(response);
      const items = Array.isArray(payload) ? payload : [];

      setRows(
        items.map((item) => ({
          mbrNo: item?.mbrNo ?? null,
          lgnId: item?.lgnId ?? '-',
          mbrNm: item?.mbrNm ?? '-',
          orgNm: item?.orgNm ?? DEFAULT_ORG_NAME,
        }))
      );
      setSelectedMemberNos([]);
    } catch (error) {
      console.error('[RoleManagerSelector] 추가 가능 관리자 검색 실패', error);
      setRows([]);
      setSelectedMemberNos([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchKeyDown(event) {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    void handleSearch();
  }

  function isSelected(mbrNo) {
    return selectedMemberNos.includes(mbrNo);
  }

  function handleToggle(mbrNo, checked) {
    if (!mbrNo) {
      return;
    }

    setSelectedMemberNos((prev) => {
      if (checked) {
        return prev.includes(mbrNo) ? prev : [...prev, mbrNo];
      }

      return prev.filter((value) => value !== mbrNo);
    });
  }

  async function handleAdd() {
    if (!roleId || selectedMemberNos.length === 0) {
      return;
    }

    setSaving(true);

    try {
      await http.post(`/api/v1/roles/${roleId}/members/assign`, {
        mbrNos: selectedMemberNos,
      });
      alert('추가되었습니다.');
      await onAdded?.();
    } catch (error) {
      console.error('[RoleManagerSelector] 권한 소속인원 추가 실패', error);
      alert(
        error?.response?.data?.message || '소속인원 추가에 실패했습니다.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Popup title="소속인원 추가" isBtns={true} autoHeight={true} onClose={onClose}>
      <h4 className="onsubtitle" style={{ margin: '0 2px 12px' }}>
        미등록 인원
      </h4>
      <div className="ongrid-form" style={{ margin: '0 2px 8px' }}>
        <div className="flexRow">
          <MenuInputBox
            menuType="input"
            menuSize="300px"
            placeholder="검색어를 입력하세요."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            disabled={loading || saving}
          />
          <Button
            btnType="search"
            btnNames="검색"
            onClick={handleSearch}
            disabled={loading || saving}
          />
        </div>
        <Button
          btnType="add"
          btnNames="추가"
          onClick={handleAdd}
          disabled={selectedMemberNos.length === 0 || loading || saving}
        />
      </div>
      <div className="oncontent ontable-form" style={{ paddingRight: '0' }}>
        <div className="ontableBox onbgtable">
          <table>
            <colgroup>
              <col style={{ width: '60px' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>선택</td>
                <td style={{ borderRight: '1px solid #E1E1E1' }}>ID</td>
                <td>성명</td>
                <td>기관명</td>
              </tr>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="4">{loading ? '조회중...' : '데이터가 없습니다.'}</td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.mbrNo ?? row.lgnId}>
                    <td>
                      <CheckBox
                        chkId={`role-selector-${row.mbrNo ?? row.lgnId}`}
                        value={row.mbrNo}
                        checked={isSelected(row.mbrNo)}
                        onChange={({ checked }) => handleToggle(row.mbrNo, checked)}
                      />
                    </td>
                    <td style={{ borderRight: '1px solid #E1E1E1' }}>{row.lgnId}</td>
                    <td>{row.mbrNm}</td>
                    <td>{row.orgNm || DEFAULT_ORG_NAME}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Popup>
  );
}

RoleManagerSelector.propTypes = {
  roleId: PropTypes.string,
  onClose: PropTypes.func,
  onAdded: PropTypes.func,
};
