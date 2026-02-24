import '@svar-ui/react-grid/all.css';

import { Grid, Willow } from '@svar-ui/react-grid';
import PropTypes from 'prop-types';
import React from 'react';

const formatYmd = (ymd) => {
  if (!ymd || ymd.length !== 8) return '-';
  return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
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

const columns = [
  { id: 'no', header: '순번', width: 60 },
  { id: 'prdocIssuAplyNo', header: '신청번호', width: 180 },
  { id: 'prdocTtl', header: '증명서', flexgrow: 1 },
  { id: 'cmpnyNm', header: '기업명', flexgrow: 3 }, // TODO: 회원통합 연동 확정 후 연결
  {
    id: 'vldPeriod',
    header: '유효기간',
    width: 220, // 날짜 두 개라 고정폭
    cell: (props) => {
      const { vldBgngYmd, vldEndYmd } = props.row;
      if (!vldBgngYmd && !vldEndYmd) return '-';
      return `${formatYmd(vldBgngYmd)} ~ ${formatYmd(vldEndYmd)}`;
    },
  },
  {
    id: 'aplyDt',
    header: '신청일시',
    width: 200,
    cell: (props) => formatDateTime(props.row.aplyDt),
  },
  { id: 'prdocIssuPrgrsSttsCdNm', header: '발급상태', width: 100 },
];

export default function CertificateIssuanceListGrid({ data = [] }) {
  return (
    <Willow>
      <Grid data={data} columns={columns} />
    </Willow>
  );
}

CertificateIssuanceListGrid.propTypes = {
  data: PropTypes.array,
};
