import '@svar-ui/react-grid/all.css';

import { Grid, Willow } from '@svar-ui/react-grid';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

import Button from '../ui/Button';

function CodeEditButton({ row, onEdit }) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(row);
    }
  };

  return <Button btnType="edit" btnNames="수정" onClick={handleClick} />;
}

const defaultGroupColumns = [
  { id: 'comCdGroupId', flexgrow: 1, header: '그룹코드 ID' },
  { id: 'comCdGroupNm', flexgrow: 1, header: '그룹코드명' },
  { id: 'comCdGroupExpln', flexgrow: 2, header: '그룹코드 설명' },
  { id: 'useYn', width: 80, header: '사용여부' },
  { id: 'management', width: 76, header: '관리' },
];

const defaultChildColumns = [
  { id: 'comCd', flexgrow: 1, header: '코드 ID' },
  { id: 'comCdNm', flexgrow: 1, header: '코드명' },
  { id: 'sortSeq', width: 100, header: '정렬순서' },
  { id: 'useYn', width: 80, header: '사용여부' },
  { id: 'management', width: 76, header: '관리' },
];

export default function CommonCodeGrid({
  data = [],
  columns,
  type = 'group',
  onEdit,
  onRowClick,
}) {
  const gridColumns =
    columns || (type === 'group' ? defaultGroupColumns : defaultChildColumns);
  const apiRef = useRef(null);
  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const enhancedColumns = gridColumns.map((col) => {
    if (col.id === 'management') {
      return {
        ...col,
        cell: (props) => <CodeEditButton {...props} onEdit={onEdit} />,
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

CommonCodeGrid.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  type: PropTypes.oneOf(['group', 'child']),
  onEdit: PropTypes.func,
  onRowClick: PropTypes.func,
};
