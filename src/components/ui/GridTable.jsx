import '@svar-ui/react-grid/all.css';

import { Grid, Willow } from '@svar-ui/react-grid';
import React from 'react';

import ButtonCell from '../custom/ButtonCell';
import CheckBox from './CheckBox';
import PropTypes from "prop-types";

// 그리드 컬럼 정의
export const defaultColumns = [
  { cell: CheckBox, id: 'checkbox', width: 40 },
  { id: 'id', flexgrow: 1, header: 'ID' },
  { id: 'name', flexgrow: 1, header: '성명' },
  { id: 'organ', flexgrow: 1, header: '기관명' },
  { cell: ButtonCell, id: 'management', width: 76, header: '관리' },
];

// 예제 데이터
export const defaultData = [
  {
    cell: CheckBox,
    id: 'admin12301',
    name: '홍길동',
    organ: '기관명',
    management: '버튼',
  },
  {
    cell: CheckBox,
    id: 'admin12302',
    name: '홍길동',
    organ: '기관명',
    management: '버튼',
  },
  {
    cell: CheckBox,
    id: 'admin12303',
    name: '홍길동',
    organ: '기관명',
    management: '버튼',
  },
  {
    cell: CheckBox,
    id: 'admin12304',
    name: '홍길동',
    organ: '기관명',
    management: '버튼',
  },
  {
    cell: CheckBox,
    id: 'admin12305',
    name: '홍길동',
    organ: '기관명',
    management: '버튼',
  },
  {
    cell: CheckBox,
    id: 'admin12306',
    name: '홍길동',
    organ: '기관명',
    management: '버튼',
  },
  {
    cell: CheckBox,
    id: 'admin12307',
    name: '홍길동',
    organ: '기관명',
    management: '버튼',
  },
  {
    cell: CheckBox,
    id: 'admin12308',
    name: '홍길동',
    organ: '기관명',
    management: '버튼',
  },
  {
    cell: CheckBox,
    id: 'admin12309',
    name: '홍길동',
    organ: '기관명',
    management: '버튼',
  },
  {
    cell: CheckBox,
    id: 'admin12310',
    name: '홍길동',
    organ: '기관명',
    management: '버튼',
  },
  {
    cell: CheckBox,
    id: 'admin12311',
    name: '홍길동',
    organ: '기관명',
    management: '버튼',
  },
  {
    cell: CheckBox,
    id: 'admin12312',
    name: '홍길동',
    organ: '기관명',
    management: '버튼',
  },
  {
    cell: CheckBox,
    id: 'admin12313',
    name: '홍길동',
    organ: '기관명',
    management: '버튼',
  },
  {
    cell: CheckBox,
    id: 'admin12314',
    name: '홍길동',
    organ: '기관명',
    management: '버튼',
  },
  {
    cell: CheckBox,
    id: 'admin12315',
    name: '홍길동',
    organ: '기관명',
    management: '버튼',
  },
];

// 관리자 화면 - 그리드 테이블 컴포넌트
export default function GridTable({
                                    data = defaultData,
                                    columns = defaultColumns,
                                    gridProps = {},
                                  }) {
  return (
    <Willow>
      <Grid data={data} columns={columns} {...gridProps} />
    </Willow>
  );
}

GridTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  gridProps: PropTypes.object,
};