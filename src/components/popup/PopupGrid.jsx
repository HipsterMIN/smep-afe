import '@svar-ui/react-grid/all.css';

import Button from '@components/ui/Button.jsx';
import { Grid, Willow } from '@svar-ui/react-grid';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

function PopupManageCell({ row, onEdit, onToggleUseYn, onPreview }) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      <Button
        btnType="edit"
        btnNames="수정"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(row);
        }}
      />
      <Button
        btnType="edit"
        btnNames={row.useYn === 'Y' ? '사용안함' : '사용'}
        onClick={(e) => {
          e.stopPropagation();
          onToggleUseYn(row);
        }}
      />
      <Button
        btnType="edit"
        btnNames="미리보기"
        onClick={(e) => {
          e.stopPropagation();
          onPreview(row);
        }}
      />
    </div>
  );
}

function ImageCell({ row }) {
  if (!row.imgAtchFileId) {
    return (
      <div
        style={{
          width: '60px',
          height: '40px',
          background: '#eee',
          border: '1px solid #ddd',
        }}
      />
    );
  }
  return (
    <img
      src={`/api/v1/files/image/${row.imgAtchFileId}`}
      alt={row.popupTtl}
      style={{ width: '60px', height: '40px', objectFit: 'cover' }}
    />
  );
}

export default function PopupGrid({
  data = [],
  onRowClick,
  onEdit,
  onToggleUseYn,
  onPreview,
}) {
  const apiRef = useRef(null);
  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const columns = [
    { id: 'popupId', width: 60, header: '번호' },
    {
      id: 'image',
      width: 80,
      header: '이미지',
      cell: (props) => <ImageCell {...props} />,
    },
    { id: 'popupKndCdNm', width: 80, header: '팝업종류' },
    { id: 'popupTtl', flexgrow: 1, header: '제목' },
    {
      id: 'pstgPeriod',
      width: 200,
      header: '게시기간',
      cell: ({ row }) => `${row.pstgBgngYmd} ~ ${row.pstgEndYmd}`,
    },
    { id: 'useYn', width: 70, header: '사용여부' },
    {
      id: 'management',
      width: 220,
      header: '관리',
      cell: (props) => (
        <PopupManageCell
          {...props}
          onEdit={onEdit}
          onToggleUseYn={onToggleUseYn}
          onPreview={onPreview}
        />
      ),
    },
  ];

  const initGrid = (api) => {
    apiRef.current = api;
    if (onRowClick) {
      api.on('select-row', (ev) => {
        const rowData = dataRef.current.find((item) => item.id === ev.id);
        if (rowData) onRowClick(rowData);
      });
    }
  };

  return (
    <Willow>
      <Grid data={data} columns={columns} init={initGrid} />
    </Willow>
  );
}

PopupGrid.propTypes = {
  data: PropTypes.array,
  onRowClick: PropTypes.func,
  onEdit: PropTypes.func,
  onToggleUseYn: PropTypes.func,
  onPreview: PropTypes.func,
};
