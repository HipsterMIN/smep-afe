import GridCellActionButton from '@components/ui/GridCellActionButton.jsx';
import PropTypes from 'prop-types';

// GridTable column의 cell 렌더러를 "작업자 친화적"으로 생성하기 위한 팩토리.
// 사용자는 valueKey/getValue/onClick만 넘기면 동일한 클릭 로직을 반복 작성하지 않아도 된다.
export function createGridValueActionCell({
  // row 객체에서 값을 꺼낼 키(ex: 'bbsNm').
  valueKey,
  // valueKey 대신 직접 값을 계산하고 싶을 때 사용하는 함수.
  // ex) getValue: (row) => `${row.firstName} ${row.lastName}`
  getValue,
  // 값이 비어 있을 때 표시할 대체 문자열.
  fallback = '-',
  // 클릭 핸들러(핵심 비즈니스 로직). row와 event를 함께 넘겨준다.
  onClick,
  // GridCellActionButton의 표시 형태 선택.
  variant = 'link',
  // className 기반 버튼 스타일을 그대로 사용할 수 있도록 노출.
  className,
  // 필요 시 개별 화면에서 스타일 미세조정 가능.
  style,
  // disabled/title 등 button에 직접 전달할 확장 속성.
  buttonProps,
}) {
  // GridTable이 기대하는 형식: ({ row }) => JSX
  // 익명 함수로 반환하면 eslint가 display-name을 요구하므로 명명된 컴포넌트로 선언한다.
  function GridValueActionCell({ row }) {
    // getValue가 있으면 우선 사용하고, 없으면 valueKey로 기본 추출.
    const rawValue = typeof getValue === 'function' ? getValue(row) : row?.[valueKey];

    // null/undefined/빈문자열은 모두 fallback으로 통일해서 UX 일관성 확보.
    const displayValue =
      rawValue === null || rawValue === undefined || rawValue === '' ? fallback : rawValue;

    return (
      <GridCellActionButton
        variant={variant}
        className={className}
        style={style}
        onClick={(e) => onClick?.(row, e)}
        {...buttonProps}
      >
        {displayValue}
      </GridCellActionButton>
    );
  }

  // 디버깅/React DevTools/린트 규칙 대응을 위한 displayName 지정.
  GridValueActionCell.displayName = 'GridValueActionCell';

  // 팩토리로 생성되는 셀 컴포넌트의 입력 계약을 명시.
  GridValueActionCell.propTypes = {
    row: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  return GridValueActionCell;
}
