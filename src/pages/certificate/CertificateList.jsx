import CertificateListGrid from '@components/certificate/CertificateListGrid.jsx';
import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import http from '@lib/http.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CertificateList() {
  const navigate = useNavigate();

  const [certificateData, setCertificateData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // 검색 조건
  const [prdocTtl, setPrdocTtl] = useState('');
  const [jrsdInstNm, setJrsdInstNm] = useState('');
  const [issuInstNm, setIssuInstNm] = useState('');
  const [rlsYn, setRlsYn] = useState('');
  const [drctIssuYn, setDrctIssuYn] = useState('');
  const [elpblYn, setElpblYn] = useState('');
  const [regDtFrom, setRegDtFrom] = useState('');
  const [regDtTo, setRegDtTo] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  // 증명서 목록 조회
  const fetchCertificates = async () => {
    try {
      const params = { size: 100 };

      // 검색 조건 추가
      if (prdocTtl) params.prdocTtl = prdocTtl;
      if (jrsdInstNm) params.jrsdInstNm = jrsdInstNm;
      if (issuInstNm) params.issuInstNm = issuInstNm;
      if (rlsYn) params.rlsYn = rlsYn;
      if (drctIssuYn) params.drctIssuYn = drctIssuYn;
      if (elpblYn) params.elpblYn = elpblYn;
      if (regDtFrom) params.regDtFrom = regDtFrom;
      if (regDtTo) params.regDtTo = regDtTo;

      const response = await http.get('/api/v1/certificates', { params });

      const data = (response.data?.data || []).map((item, index) => ({
        ...item,
        id: item.prdocCd,
        no: index + 1, // 순번
      }));

      setCertificateData(data);
      setTotalCount(data.length);
    } catch (error) {
      console.error('증명서 목록 조회 실패:', error);
      setCertificateData([]);
      setTotalCount(0);
    }
  };

  // 검색 버튼 클릭
  const handleSearch = () => {
    fetchCertificates();
  };

  // 등록 버튼 클릭
  const handleAdd = () => {
    navigate('create');
  };

  // 수정 버튼 클릭
  const handleEdit = (row) => {
    console.log('수정 버튼 클릭:', row);
    navigate(`/prdocIssu/prdocInfo/${row.prdocCd}/edit`);
  };

  // 행 클릭
  const handleRowClick = (row) => {
    navigate(`${row.prdocCd}`);
  };

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>증명서 정보 목록</h2>
        <ul className="onbreadcrumb">
          <li>증명서 발급 관리</li>
          <li>증명서 정보 관리</li>
          <li className="on">증명서 정보 목록</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox
                menuType="input"
                menuName="증명서"
                menuSize="150px"
                placeholder="증명서명을 입력하세요"
                value={prdocTtl}
                onChange={(e) => setPrdocTtl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <MenuInputBox
                menuType="input"
                menuName="소관기관"
                menuSize="200px"
                placeholder="소관기관명을 입력하세요"
                value={jrsdInstNm}
                onChange={(e) => setJrsdInstNm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <MenuInputBox
                menuType="input"
                menuName="발급기관"
                menuSize="200px"
                placeholder="발급기관명을 입력하세요"
                value={issuInstNm}
                onChange={(e) => setIssuInstNm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <MenuInputBox
                menuType="select"
                menuName="공개여부"
                menuSize="150px"
                options={[
                  { value: 'Y', label: '공개' },
                  { value: 'N', label: '비공개' },
                ]}
                value={rlsYn}
                onChange={(e) => setRlsYn(e.target.value)}
              />
              <div style={{ marginLeft: 'auto' }}>
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={handleSearch}
                />
              </div>
            </div>
            <div className="onparagraph middle">
              <MenuInputBox
                menuType="select"
                menuName="직접발급 여부"
                menuSize="150px"
                options={[
                  { value: 'Y', label: '대상' },
                  { value: 'N', label: '대상아님' },
                ]}
                value={drctIssuYn}
                onChange={(e) => setDrctIssuYn(e.target.value)}
              />
              <MenuInputBox
                menuType="select"
                menuName="전자증명서 대상여부"
                menuSize="150px"
                options={[
                  { value: 'Y', label: '대상' },
                  { value: 'N', label: '대상아님' },
                ]}
                value={elpblYn}
                onChange={(e) => setElpblYn(e.target.value)}
              />
              <div className="ondatepickerbox">
                <DatepickerBox
                  menuName="등록일"
                  value={regDtFrom}
                  onChange={(date) => setRegDtFrom(date)}
                  outputFormat="dash"
                />
                <span className="onunit">~</span>
                <DatepickerBox
                  value={regDtTo}
                  onChange={(date) => setRegDtTo(date)}
                  outputFormat="dash"
                />
              </div>
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>{totalCount}</b>개
            </span>
            <Button btnType="add" btnNames="등록" onClick={handleAdd} />
          </div>

          <div className="ongrid-tableform onSCrollBox">
            <CertificateListGrid
              data={certificateData}
              onEdit={handleEdit}
              onRowClick={handleRowClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
