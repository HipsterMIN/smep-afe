import Button from '@components/ui/Button.jsx';
import CheckBox from '@components/ui/CheckBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import Popup from '@components/ui/Popup.jsx';
import PropTypes from 'prop-types';
import { Willow } from '@svar-ui/react-grid';
import { useMemo } from 'react';

const GRID_PROPS = { rowHeight: 36, headerRowHeight: 40 };

export default function TemplatePopup({
  title = '양식 목록',
  templateList = [],
  totalCount = 0,
  selectedTemplateId = null,
  loading = false,
  gridViewportRef,
  onClose,
  onToggleSelect,
  onConfirm,
}) {
  const columns = useMemo(
    () => [
      {
        id: 'checked',
        header: '선택',
        width: 60,
        cell: ({ row }) => (
          <CheckBox
            chkId={`template-${row.id}`}
            checked={selectedTemplateId === row.id}
            onChange={() => onToggleSelect(row.id)}
          />
        ),
      },
      { id: 'rowNo', header: '번호', width: 70 },
      { id: 'tplTitle', header: '템플릿명', flexgrow: 1.5 },
      { id: 'inDate', header: '작성일', width: 120 },
      { id: 'writer', header: '작성자', width: 120 },
    ],
    [selectedTemplateId, onToggleSelect]
  );

  return (
    <Popup title={title} autoHeight={true} onClose={onClose}>
      <div className="oncontent">
        <div className="onselect-form open" style={{ minHeight: 'auto' }}>
          <div className="onparagraph">
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              <Button btnType="add" btnNames="추가" onClick={onConfirm} />
            </div>
          </div>
        </div>

        <div className="ontable-legend">
          <span>
            총 <b>{totalCount}</b>개
          </span>
        </div>

        <div className="ongrid-tableform" style={{ scrollbarGutter: 'stable' }}>
          <Willow>
            <div
              ref={gridViewportRef}
              style={{
                height: '420px',
                overflow: 'hidden',
              }}
            >
              <GridTable
                data={templateList}
                columns={columns}
                useWillow={false}
                gridProps={GRID_PROPS}
              />
            </div>
          </Willow>
        </div>

        {loading ? (
          <div
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              color: '#666',
              textAlign: 'right',
            }}
          >
            양식 목록을 불러오는 중입니다...
          </div>
        ) : null}
      </div>
    </Popup>
  );
}

TemplatePopup.propTypes = {
  title: PropTypes.string,
  templateList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      rowNo: PropTypes.number,
      tplId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      tplTitle: PropTypes.string,
      writer: PropTypes.string,
      inDate: PropTypes.string,
      tplContent: PropTypes.string,
    })
  ),
  totalCount: PropTypes.number,
  selectedTemplateId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.bool,
  gridViewportRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  onClose: PropTypes.func.isRequired,
  onToggleSelect: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
