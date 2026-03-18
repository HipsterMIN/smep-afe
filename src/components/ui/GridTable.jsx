import '@svar-ui/react-grid/all.css';
import '@components/ui/css/GridTable.css';

import { Grid, Willow } from '@svar-ui/react-grid';
import PropTypes from 'prop-types';
import React from 'react';

import ButtonCell from '../custom/ButtonCell';
import ButtonCell2 from '../custom/ButtonCell2';
import CheckBox from './CheckBox';

const DEFAULT_ALIGN = 'center';
const VALID_ALIGNMENTS = ['left', 'center', 'right'];

const mergeClassNames = (...classNames) => classNames.filter(Boolean).join(' ');

const resolveColumnAlign = (column, columnAlignKey, globalAlign) => {
  if (VALID_ALIGNMENTS.includes(column?.[columnAlignKey])) {
    return column[columnAlignKey];
  }

  if (VALID_ALIGNMENTS.includes(globalAlign)) {
    return globalAlign;
  }

  return DEFAULT_ALIGN;
};

// 그리드 컬럼 정의
export const defaultColumns = [
  { cell: CheckBox, id: 'checkbox', width: 40 },
  { id: 'id', flexgrow: 1, header: 'ID' },
  { id: 'name', flexgrow: 1, header: '성명' },
  { id: 'organ', flexgrow: 1, header: '기관명' },
  { cell: ButtonCell, id: 'management', width: 76, header: '관리' },
  { cell: ButtonCell2, id: 'edit', width: 76, header: '하위추가' },
];

// 예제 데이터
export const defaultData = [
  {
    cell: CheckBox,
    id: 'admin12301',
    name: '홍길동',
    organ: '기관명',
    management: '버튼1',
    edit: '버튼2',
  },
  {
    cell: CheckBox,
      id: 'admin12302',
    name: '홍길동',
    organ: '기관명',
    management: '버튼1',
    edit: '버튼2',
  },
  {
    cell: CheckBox,
      id: 'admin12303',
    name: '홍길동',
    organ: '기관명',
    management: '버튼1',
    edit: '버튼2',
  },
  {
    cell: CheckBox,
      id: 'admin12304',
    name: '홍길동',
    organ: '기관명',
    management: '버튼1',
    edit: '버튼2',
  },
  {
    cell: CheckBox,
      id: 'admin12305',
    name: '홍길동',
    organ: '기관명',
    management: '버튼1',
    edit: '버튼2',
  },
  {
    cell: CheckBox,
      id: 'admin12306',
    name: '홍길동',
    organ: '기관명',
    management: '버튼1',
    edit: '버튼2',
  },
  {
    cell: CheckBox,
      id: 'admin12307',
    name: '홍길동',
    organ: '기관명',
    management: '버튼1',
    edit: '버튼2',
  },
  {
    cell: CheckBox,
      id: 'admin12308',
    name: '홍길동',
    organ: '기관명',
    management: '버튼1',
    edit: '버튼2',
  },
  {
    cell: CheckBox,
      id: 'admin12309',
    name: '홍길동',
    organ: '기관명',
    management: '버튼1',
    edit: '버튼2',
  },
  {
    cell: CheckBox,
      id: 'admin12310',
    name: '홍길동',
    organ: '기관명',
    management: '버튼1',
    edit: '버튼2',
  },
  {
    cell: CheckBox,
      id: 'admin12311',
    name: '홍길동',
    organ: '기관명',
    management: '버튼1',
    edit: '버튼2',
  },
  {
    cell: CheckBox,
      id: 'admin12312',
    name: '홍길동',
    organ: '기관명',
    management: '버튼1',
    edit: '버튼2',
  },
  {
    cell: CheckBox,
      id: 'admin12313',
    name: '홍길동',
    organ: '기관명',
    management: '버튼1',
    edit: '버튼2',
  },
  {
    cell: CheckBox,
      id: 'admin12314',
    name: '홍길동',
    organ: '기관명',
    management: '버튼1',
    edit: '버튼2',
  },
  {
    cell: CheckBox,
      id: 'admin12315',
    name: '홍길동',
    organ: '기관명',
    management: '버튼1',
    edit: '버튼2',
  },
];

// 관리자 화면 - 그리드 테이블 컴포넌트
export default function GridTable({
  data = defaultData,
  columns = defaultColumns,
  headerAlign = DEFAULT_ALIGN,
  dataAlign = DEFAULT_ALIGN,
  gridProps = {},
  useWillow = true,
}) {
  const { columnStyle: customColumnStyle, cellStyle: customCellStyle, ...restGridProps } = gridProps;

  const columnStyle = (column) =>
    mergeClassNames(
      typeof customColumnStyle === 'function' ? customColumnStyle(column) : '',
      `gridtable-header-align-${resolveColumnAlign(column, 'headerAlign', headerAlign)}`
    );

  const cellStyle = (row, column) =>
    mergeClassNames(
      typeof customCellStyle === 'function' ? customCellStyle(row, column) : '',
      `gridtable-data-align-${resolveColumnAlign(column, 'dataAlign', dataAlign)}`
    );

  const gridElement = (
    <Grid
      data={data}
      columns={columns}
      columnStyle={columnStyle}
      cellStyle={cellStyle}
      {...restGridProps}
    />
  );

  if (!useWillow) return gridElement;
  return <Willow>{gridElement}</Willow>;
}

GridTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  headerAlign: PropTypes.oneOf(VALID_ALIGNMENTS),
  dataAlign: PropTypes.oneOf(VALID_ALIGNMENTS),
  gridProps: PropTypes.object,
  useWillow: PropTypes.bool,
};
