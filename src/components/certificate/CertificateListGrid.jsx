import '@svar-ui/react-grid/all.css';

import { Grid, Willow } from '@svar-ui/react-grid';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

import Button from '../ui/Button';

function CertificateEditButton({ row, onEdit }) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(row);
    }
  };

  return <Button btnType="edit" btnNames="수정" onClick={handleClick} />;
}

const defaultColumns = [
  { id: 'no', width: 60, header: '순번' },
  { id: 'prdocTtl', flexgrow: 2, header: '증명서명' },
  { id: 'jrsdInstNm', flexgrow: 1, header: '소관기관' },
  { id: 'issuInstNm', flexgrow: 1, header: '발급기관' },
  { id: 'rlsYn', width: 100, header: '공개여부' },
  { id: 'drctIssuYn', width: 120, header: '직접발급 여부' },
  { id: 'elpblYn', width: 180, header: '전자증명서 대상여부' },
  { id: 'regDt', width: 180, header: '등록일시' },
  { id: 'management', width: 76, header: '관리' },
];

export default function CertificateListGrid({
  data = [],
  columns,
  onEdit,
  onRowClick,
}) {
  const gridColumns = columns || defaultColumns;
  const apiRef = useRef(null);
  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const enhancedColumns = gridColumns.map((col) => {
    // 공개여부
    if (col.id === 'rlsYn') {
      return {
        ...col,
        cell: (props) => {
          const value = props.row[col.id];
          return value === 'Y' ? '공개' : '비공개';
        },
      };
    }

    // 직접발급여부
    if (col.id === 'drctIssuYn') {
      return {
        ...col,
        cell: (props) => {
          const value = props.row[col.id];
          return value === 'Y' ? '대상' : '대상아님';
        },
      };
    }

    // 전자증명서 대상여부
    if (col.id === 'elpblYn') {
      return {
        ...col,
        cell: (props) => {
          const value = props.row[col.id];
          return value === 'Y' ? '대상' : '대상아님';
        },
      };
    }

    if (col.id === 'management') {
      return {
        ...col,
        cell: (props) => <CertificateEditButton {...props} onEdit={onEdit} />,
      };
    }
    if (col.id === 'regDt') {
      return {
        ...col,
        cell: (props) => {
          const dateStr = props.row[col.id];
          if (!dateStr) return '';
          // LocalDateTime 포맷팅 (YYYY-MM-DD HH:MM)
          return new Date(dateStr).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          });
        },
      };
    }
    return col;
  });

  const initGrid = (api) => {
    apiRef.current = api;

    if (onRowClick) {
      api.on('select-row', (ev) => {
        const rowData = dataRef.current.find((item) => item.id === ev.id);

        if (rowData) {
          onRowClick(rowData);
        }
      });
    }
  };

  return (
    <Willow>
      <Grid data={data} columns={enhancedColumns} init={initGrid} />
    </Willow>
  );
}

CertificateListGrid.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  onEdit: PropTypes.func,
  onRowClick: PropTypes.func,
};
