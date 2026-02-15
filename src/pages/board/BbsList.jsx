import Button from "@components/ui/Button.jsx";
import GridTable from "@components/ui/GridTable.jsx";
import MenuInputBox from "@components/ui/MenuInputBox.jsx";
import {fetchAndConvertCommonCodes} from '@utils/commonUtils.js';
import {formatDate} from '@utils/stringUtils.js';
import http from "@lib/http.js";
import {useEffect, useRef, useState} from "react";
import ButtonCell from "@components/custom/ButtonCell.jsx";
import {useNavigate} from 'react-router-dom';

export default function BbsList() {
  const navigate = useNavigate();
  // 게시판 목록 데이터 State
  const [bbsData, setBbsData] = useState([]);
  // 로딩 상태
  const [loading, setLoading] = useState(false);
  const [bbsTypeCdList, setBbsTypeCdList] = useState([]);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    // 공통코드 조회 및 변환
    const loadCommonCodes = async () => {
      try {
        const commonCodes = await fetchAndConvertCommonCodes(['BBS_TYPE_CD']);
        // 공통코드 데이터를 상태에 저장하거나 필요한 곳에 전달
        console.log("공통코드 조회 및 변환 결과:", commonCodes);
        setBbsTypeCdList(commonCodes['BBS_TYPE_CD'] || []);
      } catch (error) {
        console.error("공통코드 조회 및 변환 실패:", error);
      }
    };

    loadCommonCodes();
  }, []);

  //검색 파라미터 ref
  const searchParamsRef = useRef({
    hasNext: false,
    nextCursor: null,
  });

  // 검색 파라미터 State
  const [searchParams, setSearchParams] = useState({
    bbsNo: "",
    bbsNm: "",
    bbsTypeCd: "",
    bbsExplnCn: "",
    useYn: ""
  });

  // 게시판 그리드 컬럼 정의
  const bbsColumns = [
    { cell: "CheckBox", id: "checkbox", width: 40 },
    { id: "bbsNo", flexgrow: 1, header: "게시판 ID" },
    { id: "bbsNm", flexgrow: 1, header: "게시판 명" },
    { id: "bbsTypeCd", flexgrow: 1, header: "게시판 유형" },
    { id: "bbsExplnCn", flexgrow: 2, header: "게시판 소개글" },
    { id: "useYn", width: 80, header: "사용여부" },
    { id: "regDate", flexgrow: 1, header: "등록일" ,
      template: (value) => formatDate(value, 'yyyy-MM-dd HH:mm:ss'),},
    { cell: ButtonCell, id: 'management', header: '관리', width: 76 },
  ];

  // 게시판 목록 조회 API 호출
  const fetchBbsList = async (nextCursor = null) => {
    setLoading(true);
    try {
      const response = await http.post("/api/v1/board/bbs/search", {
        cursorPageRequest: {
          size: 20,
          cursor: nextCursor,
        },
        ...searchParams,
      });
      const data = response?.data || [];

      // API 응답 데이터를 Grid 형식에 맞게 변환
      const formattedData = data.data.map((item) => ({
        bbsNo: item?.bbsNo || '',
        bbsNm: item?.bbsNm || '',
        bbsTypeCd: item?.bbsTypeCd || '',
        bbsExplnCn: item?.bbsExplnCn || '',
        useYn: item?.useYn === "Y" ? "사용" : "미사용",
        regDate: item?.regDate || '',
        management: "관리"
      })) || [];

      setBbsData(formattedData);

      searchParamsRef.current = {
        hasNext: data.hasNext,
        nextCursor: data.nextCursor,
      };

    } catch (error) {
      console.error("게시판 목록 조회 실패:", error);
      alert("게시판 목록을 불러오는데 실패했습니다.");
      setBbsData([]);
    } finally {
      setLoading(false);
    }
  };

  // 등록 버튼 클릭 핸들러 - 상대 경로로 이동
  const handleAdd = () => {
    console.log("등록 버튼 클릭");
    navigate('create'); // 상대 경로 사용
  };

  // 검색 조건 입력 핸들러
  const handleInputChange = (name, value) => {
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
      <div className="oncontentbox full">
        <div className="oncontentTitle">
          <h2>게시판 목록</h2>
          <ul className="onbreadcrumb">
            <li>시스템 관리</li>
            <li>시스템 설정</li>
            <li>게시판 관리</li>
            <li className="on">게시판 목록</li>
          </ul>
        </div>

        <div className="oncontents">
          <div className="oncontent">
            <div className="onselect-form open" style={{ minHeight: 'auto' }}>
              <div className="onparagraph">
                <MenuInputBox
                    menuType="input"
                    menuName="게시판 ID"
                    menuSize="150px"
                    value={searchParams.bbsNo}
                    onChange={(e) => handleInputChange("bbsNo", e.target.value)}
                />
                <MenuInputBox
                    menuType="input"
                    menuName="게시판 명"
                    menuSize="150px"
                    value={searchParams.bbsNm}
                    onChange={(e) => handleInputChange("bbsNm", e.target.value)}
                />
                <MenuInputBox
                    menuType="select"
                    menuName="게시판 유형"
                    options={bbsTypeCdList}
                    showAllOption={true}
                    menuSize="100px"
                    value={searchParams.bbsTypeCd}
                    onChange={(e) => handleInputChange("bbsTypeCd", e.target.value)}
                />
                <MenuInputBox
                    menuType="input"
                    menuName="게시판 소개글"
                    menuSize="300px"
                    value={searchParams.bbsExplnCn}
                    onChange={(e) => handleInputChange("bbsExplnCn", e.target.value)}
                />
                <MenuInputBox
                    menuType="select"
                    menuName="사용여부"
                    options={[{ value: 'Y', label: '사용' }, { value: 'N', label: '미사용' }]}
                    showAllOption={true}
                    menuSize="100px"
                    value={searchParams.useYn}
                    onChange={(e) => handleInputChange("useYn", e.target.value)}
                />

                <div className="onbtn" style={{ marginLeft: 'auto' }}>
                  <Button btnType="menuSearch" btnNames="검색" onClick={() => fetchBbsList()} />
                </div>
              </div>
            </div>

            <div className="ontable-legend flexEnd">
              <Button btnType="add" btnNames="등록" onClick={() => handleAdd()} />
            </div>

            <div className="ongrid-tableform mask">
              {loading ? (
                  <div className="loading">데이터를 불러오는 중...</div>
              ) : (
                  <GridTable
                      data={bbsData}
                      columns={bbsColumns}
                      gridProps={{
                        selection: true,
                        autoHeight: true
                      }}
                  />
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
