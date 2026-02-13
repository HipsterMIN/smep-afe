// 관리자 화면 - 커스텀 인풋(메뉴) 컴포넌트
export default function MenuInputBox({
  menuType, // 'input' 또는 'select' 타입 지정
  inputId, // input/select의 id 속성
  menuName, // 왼쪽에 표시될 라벨명
  menuSize = '100px', // input/select의 너비 (기본값 100px)
  selectOption, // (레거시) options 미사용 시 단일 옵션 추가용
  options, // select의 옵션 배열 [{ value: '', label: '' }, ...]
  showAllOption = true, // options 사용 시 "전체" 옵션 표시 여부 (기본 true)
  placeholder, // input type일 때 placeholder
  value, // controlled component로 사용 시 현재 값
  onChange, // 값 변경 시 호출될 핸들러
  disabled = false, // input/select 비활성화 여부 (기본 false)
}) {
  // 입력값 변경 시 부모 컴포넌트로 이벤트 전달
  const handleChange = (e) => {
    if (onChange) onChange(e)
  }

  return (
    <>
      {/* input 타입: 텍스트 입력 필드 */}
      {menuType === 'input' ? (
        <div className={`onmenubox${menuSize === '100%' ? ' fullSize' : ''}`}>
          {/* 라벨이 있으면 표시 */}
          {menuName ? <span className="onmenunames">{menuName}</span> : null}
          <input
            id={inputId}
            type="text"
            placeholder={placeholder}
            style={{ width: menuSize }}
            value={value ?? ''} // null/undefined 방지를 위해 기본값 ''
            onChange={handleChange}
            disabled={disabled}
          />
        </div>
      ) : /* select 타입: 드롭다운 선택 필드 */
      menuType === 'select' ? (
        <div className={`onmenubox${menuSize === '100%' ? ' fullSize' : ''}`}>
          {/* 라벨이 있으면 표시 */}
          {menuName ? <span className="onmenunames">{menuName}</span> : null}
          <select
            name={inputId || 'select'}
            id={inputId || ''}
            style={{ width: menuSize }}
            value={value ?? ''} // value 기본값을 빈 문자열로 통일
            onChange={handleChange}
            disabled={disabled}
          >
            {/* options 배열이 존재하고 비어있지 않을 때 */}
            {options && options.length > 0 ? (
              <>
                {/* showAllOption이 true일 때만 "전체" 옵션 추가 */}
                {showAllOption && <option value="">전체</option>}

                {/* options 배열을 순회하며 option 태그 생성 */}
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </>
            ) : (
              /* options가 없을 때: 레거시 방식으로 fallback */
              <>
                {/* 기본 "전체" 옵션 */}
                <option value="">전체</option>

                {/* selectOption prop이 있으면 추가 옵션 하나 더 표시 (레거시 지원) */}
                {selectOption ? (
                  <option value={selectOption}>{selectOption}</option>
                ) : null}
              </>
            )}
          </select>
        </div>
      ) : null}
    </>
  )
}
