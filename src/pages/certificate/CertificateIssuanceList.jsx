import CertificateIssuanceListGrid from '@components/certificate/CertificateIssuanceListGrid.jsx';
import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import http from '@lib/http.js';
import { fetchCommonCodes } from '@utils/commonUtils.js';
import { useEffect, useState } from 'react';

export default function CertificateIssuanceList() {
  const [issuanceData, setIssuanceData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // 검색 조건
  const [prdocIssuAplyNo, setPrdocIssuAplyNo] = useState('');
  const [prdocCd, setPrdocCd] = useState('');
  const [brno, setBrno] = useState(''); // TODO: 기업명 검색 방식 확정 후 교체
  const [prdocIssuPrgrsSttsCd, setPrdocIssuPrgrsSttsCd] = useState('');
  const [vldBgngYmdFrom, setVldBgngYmdFrom] = useState('');
  const [vldBgngYmdTo, setVldBgngYmdTo] = useState('');
  const [aplyDtFrom, setAplyDtFrom] = useState('');
  const [aplyDtTo, setAplyDtTo] = useState('');

  // 드롭다운 옵션
  const [prdocIssuPrgrsSttsCdList, setPrdocIssuPrgrsSttsCdList] = useState([]);
  const [certificateOptions, setCertificateOptions] = useState([]);

  useEffect(() => {
    fetchInitialData();
    fetchIssuances();
  }, []);

  // 공통코드 + 증명서 옵션 병렬 조회
  const fetchInitialData = async () => {
    try {
      const [commonCodeResponse, certificateResponse] = await Promise.all([
        fetchCommonCodes(['PRDOC_ISSU_PRGRS_STTS_CD']),
        http.get('/api/v1/certificates/options'),
      ]);

      const prdocIssuPrgrsSttsCdOptions = (
        commonCodeResponse.PRDOC_ISSU_PRGRS_STTS_CD || []
      ).map((item) => ({
        value: item.comCd,
        label: item.comCdNm,
      }));

      setPrdocIssuPrgrsSttsCdList(prdocIssuPrgrsSttsCdOptions);
      setCertificateOptions(certificateResponse.data || []);
    } catch (error) {
      console.error('초기 데이터 조회 실패:', error);
    }
  };

  const fetchIssuances = async () => {
    try {
      const params = { size: 100 };
      if (prdocIssuAplyNo) params.prdocIssuAplyNo = prdocIssuAplyNo;
      if (prdocCd) params.prdocCd = prdocCd;
      if (brno) params.brno = brno;
      if (prdocIssuPrgrsSttsCd)
        params.prdocIssuPrgrsSttsCd = prdocIssuPrgrsSttsCd;
      if (vldBgngYmdFrom) params.vldBgngYmdFrom = vldBgngYmdFrom;
      if (vldBgngYmdTo) params.vldBgngYmdTo = vldBgngYmdTo;
      if (aplyDtFrom) params.aplyDtFrom = aplyDtFrom;
      if (aplyDtTo) params.aplyDtTo = aplyDtTo;

      const response = await http.get('/api/v1/certificate-issuances', {
        params,
      });

      const data = (response.data?.data || []).map((item, index) => ({
        ...item,
        id: item.prdocIssuAplyNo,
        no: index + 1,
      }));

      setIssuanceData(data);
      setTotalCount(data.length);
    } catch (error) {
      console.error('증명서 발급 이력 조회 실패:', error);
      setIssuanceData([]);
      setTotalCount(0);
    }
  };

  const handleSearch = () => fetchIssuances();

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>증명서 발급 이력</h2>
        <ul className="onbreadcrumb">
          <li>증명서 발급 관리</li>
          <li className="on">증명서 발급 이력</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            <div className="onparagraph">
              <MenuInputBox
                menuType="input"
                menuName="신청번호"
                menuSize="150px"
                value={prdocIssuAplyNo}
                onChange={(e) => setPrdocIssuAplyNo(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <MenuInputBox
                menuType="select"
                menuName="증명서"
                menuSize="150px"
                options={certificateOptions}
                value={prdocCd}
                onChange={(e) => setPrdocCd(e.target.value)}
              />
              <MenuInputBox
                menuType="input"
                menuName="기업명"
                menuSize="300px"
                value={brno}
                onChange={(e) => setBrno(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              {/* TODO: 기업명 검색 방식 확정 후 brno → cmpnyNm 검색으로 교체 */}
              <MenuInputBox
                menuType="select"
                menuName="발급상태"
                menuSize="150px"
                options={prdocIssuPrgrsSttsCdList}
                value={prdocIssuPrgrsSttsCd}
                onChange={(e) => setPrdocIssuPrgrsSttsCd(e.target.value)}
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
              <div className="ondatepickerbox">
                <DatepickerBox
                  menuName="유효기간"
                  value={vldBgngYmdFrom}
                  onChange={(date) => setVldBgngYmdFrom(date)}
                  outputFormat="ymd"
                />
                <span className="onunit">~</span>
                <DatepickerBox
                  value={vldBgngYmdTo}
                  onChange={(date) => setVldBgngYmdTo(date)}
                  outputFormat="ymd"
                />
              </div>
              <div className="ondatepickerbox">
                <DatepickerBox
                  menuName="신청일"
                  value={aplyDtFrom}
                  onChange={(date) => setAplyDtFrom(date)}
                  outputFormat="dash"
                />
                <span className="onunit">~</span>
                <DatepickerBox
                  value={aplyDtTo}
                  onChange={(date) => setAplyDtTo(date)}
                  outputFormat="dash"
                />
              </div>
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>{totalCount}</b>개
            </span>
          </div>

          <div className="ongrid-tableform onSCrollBox">
            <CertificateIssuanceListGrid data={issuanceData} />
          </div>
        </div>
      </div>
    </div>
  );
}
