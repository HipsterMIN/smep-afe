import Button from '@components/ui/Button';
import http from '@lib/http.js';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PolicyFinanceDetailGuarantee from './components/policyFinanceDetailGuarantee.jsx';
import PolicyFinanceDetailInsurance from './components/policyFinanceDetailInsurance.jsx';
import PolicyFinanceDetailLoan from './components/policyFinanceDetailLoan.jsx';

// 상품유형코드(FT01/FT02/FT03)에 따라 상세 컴포넌트를 분기한다.
const resolveDetailComponent = (plcyFnncGdsTypeCd) => {
  const componentMap = {
    // FT01: 대출, FT02: 보증, FT03: 보증보험
    FT01: PolicyFinanceDetailLoan,
    FT02: PolicyFinanceDetailGuarantee,
    FT03: PolicyFinanceDetailInsurance,
  };

  return componentMap[plcyFnncGdsTypeCd] || PolicyFinanceDetailLoan;
};

export default function PolicyFinanceDetail() {
  const navigate = useNavigate();
  const { policyNo } = useParams();
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    if (!policyNo) return;

    const fetchDetail = async () => {
      try {
        const response = await http.get(`/api/v1/policy-finance/${policyNo}`);
        setDetail(response?.data ?? response ?? null);
      } catch (error) {
        console.error('정책금융 상세 조회 실패:', error);
        alert('정책금융 상세정보를 불러오는데 실패했습니다.');
      }
    };

    fetchDetail();
  }, [policyNo]);

  const detailData = detail ?? {};
  const DetailComponent = resolveDetailComponent(detailData.plcyFnncGdsTypeCd);
  const detailTypeLabel =
    detailData.plcyFnncGdsTypeCdNm || detailData.plcyFnncGdsTypeCd || '-';

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>{`정책금융 상세조회(${detailTypeLabel})`}</h2>
        <ul className="onbreadcrumb">
          <li>지원사업 관리</li>
          <li>사업공고 관리</li>
          <li>정책금융 관리</li>
          <li>정책금융 목록</li>
          <li className="on">정책금융 상세조회</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent ontable-form">
          <DetailComponent detailData={detailData} />
        </div>
        <div className="onflexbtns">
          <div style={{ marginRight: 'auto' }}>
            <Button
              btnType="list"
              btnNames="목록"
              onClick={() => navigate('..')}
            />
          </div>
          <Button
            btnType="edit"
            btnNames="수정"
            onClick={() => navigate('update')}
          />
        </div>
      </div>
    </div>
  );
}
