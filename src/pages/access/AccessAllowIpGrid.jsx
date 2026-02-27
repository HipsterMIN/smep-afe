import '@svar-ui/react-grid/all.css';

import Button from '@components/ui/Button.jsx';
import { Grid, Willow } from '@svar-ui/react-grid';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

function CodeDeleteButton({ row, onDelete }) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(row);
    }
  };

  return <Button btnType="del" btnNames="삭제" onClick={handleClick} />;
}
function formatDateTime(iso) {
  if (!iso) return '';
  return iso.replace('T', ' ').substring(0, 16);
}

const defaultAccessAllowIpColumns = [
  { id: 'mngrPrmIpNo', width: 86, header: '번호' },
  { id: 'ipAddr', flexgrow: 1, header: 'IP' },
  { id: 'memoCn', flexgrow: 2, header: '메모' },
  { id: 'useYn', width: 80, header: '사용여부' },
  { id: 'rgtrId', width: 76, header: '등록자' },
  { id: 'regDt', width: 140, header: '등록일시' },
  { id: 'mdfrId', width: 76, header: '수정자' },
  { id: 'mdfcnDt', width: 140, header: '수정일시' },
  { id: 'delete', width: 76, header: '삭제' },
];

export default function AccessAllowIpGrid({ data = [], onDelete, onRowClick }) {
  const gridColumns = defaultAccessAllowIpColumns;
  const apiRef = useRef(null);
  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const enhancedColumns = gridColumns.map((col) => {
    if (col.id === 'delete') {
      return {
        ...col,
        cell: (props) => {
          const row = props.row;
          if (row.useYn === 'N') {
            return <span>-</span>;
          }
          return <CodeDeleteButton {...props} onDelete={onDelete} />;
        },
      };
    }

    if (col.id === 'regDt' || col.id === 'mdfcnDt') {
      return {
        ...col,
        cell: (props) => {
          return formatDateTime(props.row[col.id]);
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

AccessAllowIpGrid.propTypes = {
  data: PropTypes.array,
  onDelete: PropTypes.func,
  onRowClick: PropTypes.func,
};
