import Button from '@components/ui/Button.jsx';
import http from '@lib/http.js';
import { useEffect, useState } from 'react';

import ChildCodeModal from '../components/commoncode/ChildCodeModal';
import CommonCodeGrid from '../components/commoncode/CommonCodeGrid';
import GroupCodeModal from '../components/commoncode/GroupCodeModal';
import SearchBox from '../components/ui/SearchBox';

export default function CommonCode() {
  const [groupCodeData, setGroupCodeData] = useState([]);
  const [childCodeData, setChildCodeData] = useState([]);
  const [groupSearchKeyword, setGroupSearchKeyword] = useState('');
  const [childSearchKeyword, setChildSearchKeyword] = useState('');
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const [selectedGroupData, setSelectedGroupData] = useState(null);
  const [selectedChildData, setSelectedChildData] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  useEffect(() => {
    fetchGroupCodes();
  }, []);

  // 그룹코드 목록 조회
  const fetchGroupCodes = async (searchKeyword = '') => {
    try {
      const params = { size: 100 };
      if (searchKeyword) {
        params.searchKeyword = searchKeyword;
      }

      const response = await http.get('/api/v1/commoncode', { params });

      const data = (response.data?.data || []).map((item) => ({
        ...item,
        id: item.comCdGroupId,
      }));

      setGroupCodeData(data);
    } catch (error) {
      console.error('그룹코드 조회 실패:', error);
      setGroupCodeData([]);
    }
  };

  // 하위코드 목록 조회
  const fetchChildCodes = async (comCdGroupId, searchKeyword = '') => {
    if (!comCdGroupId) {
      setChildCodeData([]);
      return;
    }

    try {
      const params = { size: 100 };
      if (searchKeyword) {
        params.searchKeyword = searchKeyword;
      }

      const response = await http.get(
        `/api/v1/commoncode/${comCdGroupId}/codes`,
        { params }
      );

      const data = (response.data?.data || []).map((item) => ({
        ...item,
        id: item.comCd,
      }));

      setChildCodeData(data);
    } catch (error) {
      console.error('하위코드 조회 실패:', error);
      setChildCodeData([]);
    }
  };

  // 그룹코드 검색
  const handleGroupSearch = () => {
    fetchGroupCodes(groupSearchKeyword);
  };

  // 그룹코드 추가
  const handleGroupAdd = () => {
    setSelectedGroupData(null);
    setIsGroupModalOpen(true);
  };

  // 그룹코드 row 클릭
  const handleGroupRowClick = (row) => {
    setSelectedGroupId(row.comCdGroupId);
    fetchChildCodes(row.comCdGroupId, childSearchKeyword);
  };

  // 그룹코드 수정
  const handleGroupEdit = async (row) => {
    try {
      const response = await http.get(`/api/v1/commoncode/${row.comCdGroupId}`);
      const groupData = response.data;
      setSelectedGroupData(groupData);
      setIsGroupModalOpen(true);
    } catch (error) {
      console.error('그룹코드 조회 실패:', error);
    }
  };

  // 하위코드 수정
  const handleChildEdit = async (row) => {
    try {
      const response = await http.get(
        `/api/v1/commoncode/${selectedGroupId}/codes/${row.comCd}`
      );
      const childData = response.data;
      setSelectedChildData(childData);
      setIsChildModalOpen(true);
    } catch (error) {
      console.error('하위코드 조회 실패:', error);
    }
  };

  // 그룹코드 저장 (등록/수정)
  const handleGroupSave = async (formData) => {
    try {
      if (selectedGroupData) {
        // 수정 모드
        await http.put(`/api/v1/commoncode/${formData.comCdGroupId}`, formData);
        alert('그룹코드가 수정되었습니다.');
      } else {
        // 등록 모드
        await http.post('/api/v1/commoncode', formData);
        alert('그룹코드가 등록되었습니다.');
      }

      // 모달 닫기
      setIsGroupModalOpen(false);
      setSelectedGroupData(null);

      // 목록 새로고침
      fetchGroupCodes(groupSearchKeyword);
    } catch (error) {
      console.error('그룹코드 저장 실패:', error);

      // 에러 메시지 처리
      const errorMessage =
        error.response?.data?.message || '그룹코드 저장에 실패했습니다.';
      alert(errorMessage);
    }
  };

  // 하위코드 검색
  const handleChildSearch = () => {
    if (!selectedGroupId) {
      alert('그룹코드를 먼저 선택하세요.');
      return;
    }
    fetchChildCodes(selectedGroupId, childSearchKeyword);
  };

  // 하위코드 추가
  const handleChildAdd = () => {
    if (!selectedGroupId) {
      alert('그룹코드를 먼저 선택하세요.');
      return;
    }
    setSelectedChildData(null);
    setIsChildModalOpen(true);
  };

  // 하위코드 저장 (등록/수정)
  const handleChildSave = async (formData) => {
    try {
      // API 요청 데이터 변환 (필드명 맞추기)
      const requestData = {
        comCdGroupId: selectedGroupId,
        comCd: formData.code,
        comCdNm: formData.codeName,
        sortSeq: Number(formData.sortOrder),
        useYn: formData.useYn,
      };

      if (selectedChildData) {
        // 수정 모드
        await http.put(
          `/api/v1/commoncode/${selectedGroupId}/codes/${formData.code}`,
          requestData
        );
        alert('하위코드가 수정되었습니다.');
      } else {
        // 등록 모드
        await http.post(
          `/api/v1/commoncode/${selectedGroupId}/codes`,
          requestData
        );
        alert('하위코드가 등록되었습니다.');
      }

      // 모달 닫기
      setIsChildModalOpen(false);
      setSelectedChildData(null);

      // 목록 새로고침
      fetchChildCodes(selectedGroupId, childSearchKeyword);
    } catch (error) {
      console.error('하위코드 저장 실패:', error);

      // 에러 메시지 처리
      const errorMessage =
        error.response?.data?.message || '하위코드 저장에 실패했습니다.';
      alert(errorMessage);
    }
  };

  return (
    <div className="oncontentbox">
      <div className="oncontentTitle">
        <h2>공통코드 관리</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>시스템 설정</li>
          <li className="on">공통코드 관리</li>
        </ul>
      </div>

      <div className="oncontents space">
        <div className="oncontent">
          <div className="ongrid-form">
            <h4>그룹코드 구분</h4>
            <div className="ongrid-btnbox">
              <SearchBox
                inputId="searchFormGroup"
                placeholder="검색어를 입력하세요."
                value={groupSearchKeyword}
                onChange={(e) => setGroupSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGroupSearch()}
              />
              <Button
                btnType="search"
                btnNames="검색"
                onClick={handleGroupSearch}
              />
              <Button btnType="add" btnNames="추가" onClick={handleGroupAdd} />
            </div>
          </div>
          <div className="ongrid-tableform onSCrollBox">
            <CommonCodeGrid
              type="group"
              data={groupCodeData}
              onEdit={handleGroupEdit}
              onRowClick={handleGroupRowClick}
            />
          </div>
        </div>

        <div className="oncontent">
          <div className="ongrid-form">
            <h4>하위코드 구분</h4>
            <div className="ongrid-btnbox">
              <SearchBox
                inputId="searchFormChild"
                placeholder="검색어를 입력하세요."
                value={childSearchKeyword}
                onChange={(e) => setChildSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChildSearch()}
              />
              <Button
                btnType="search"
                btnNames="검색"
                onClick={handleChildSearch}
              />
              <Button btnType="add" btnNames="추가" onClick={handleChildAdd} />
            </div>
          </div>
          <div className="ongrid-tableform onSCrollBox">
            <CommonCodeGrid
              type="child"
              data={childCodeData}
              onEdit={handleChildEdit}
            />
          </div>
        </div>
      </div>

      {isGroupModalOpen && (
        <GroupCodeModal
          onClose={() => {
            setIsGroupModalOpen(false);
            setSelectedGroupData(null);
          }}
          onSave={handleGroupSave}
          data={selectedGroupData}
          mode={selectedGroupData ? 'edit' : 'create'}
        />
      )}

      {isChildModalOpen && (
        <ChildCodeModal
          onClose={() => {
            setIsChildModalOpen(false);
            setSelectedChildData(null);
          }}
          onSave={handleChildSave}
          data={selectedChildData}
          groupCodeId={selectedGroupId}
          mode={selectedChildData ? 'edit' : 'create'}
        />
      )}
    </div>
  );
}
