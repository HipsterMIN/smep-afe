import PropTypes from 'prop-types';

// GridTable의 cell 내부에서 클릭 가능한 값을 일관된 방식으로 렌더링하기 위한 공통 버튼 컴포넌트.
// 핵심 목적:
// 1) row 클릭과 cell 내부 버튼 클릭이 충돌하지 않도록 이벤트 전파를 강제로 차단한다.
// 2) 링크처럼 보이는 값 클릭 UI를 화면마다 중복 작성하지 않게 한다.
// 3) 필요 시 일반 버튼 스타일(className 기반)로도 동일 로직을 재사용할 수 있게 한다.

// 링크 스타일(기본값) 공통 정의.
// 기존 화면에서 반복되던 inline style을 여기로 모아서 유지보수 포인트를 단일화한다.
const LINK_VARIANT_STYLE = {
  background: 'none',
  border: 'none',
  padding: 0,
  color: '#004EA2',
  cursor: 'pointer',
  textDecoration: 'underline',
};

export default function GridCellActionButton({
  // 버튼 안에 보여줄 텍스트/노드.
  children,
  // 클릭 시 실행할 핸들러. 이벤트 객체를 그대로 넘겨준다.
  onClick,
  // 링크 스타일을 쓸지, className 기반 일반 버튼을 쓸지 선택.
  variant = 'link', // 'link' | 'button'
  // 기존 스타일 시스템(className)을 그대로 연결할 수 있도록 노출.
  className,
  // variant 스타일 위에 추가/덮어쓰기할 사용자 스타일.
  style,
  // button 엘리먼트의 기타 속성(ex: disabled, title)을 그대로 전달.
  ...rest
}) {
  // row 선택/더블클릭 등의 상위 이벤트로 버블링되는 것을 차단.
  // onMouseDown/onPointerDown 모두 막아야 브라우저/디바이스별 동작 차이를 최소화할 수 있다.
  const stopPropagation = (e) => e.stopPropagation();

  // variant가 link일 때만 기본 링크 스타일을 자동 적용.
  // button variant는 화면별 className 스타일을 신뢰하고 별도 강제 스타일을 주지 않는다.
  const resolvedStyle = variant === 'link' ? { ...LINK_VARIANT_STYLE, ...style } : style;

  return (
    <button
      type="button"
      // GridTable 내부에서 "행 클릭 제외 대상"으로 처리하기 위한 기존 데이터 속성 유지.
      data-action="ignore-click"
      className={className}
      style={resolvedStyle}
      onMouseDown={stopPropagation}
      onPointerDown={stopPropagation}
      onClick={(e) => {
        // 최종 클릭에서도 버블링을 재차 차단해서 의도치 않은 row 이벤트 발화를 방지.
        e.stopPropagation();
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

// 프로젝트 eslint(`react/prop-types`) 규칙 준수를 위해 명시적 타입 계약을 선언.
GridCellActionButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['link', 'button']),
  className: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};
