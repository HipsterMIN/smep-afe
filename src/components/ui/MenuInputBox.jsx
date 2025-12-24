
// 관리자 화면 - 커스텀 인풋(메뉴) 컴포넌트 
export default function MenuInputBox({
  menuType,
  inputId,
  menuName,
  menuSize = '100px',
  selectOption,
  placeholder
}) { 
  return (
    <>
      {
        menuType === 'input' ?
        <div className="onmenubox">
          <span className="onmenunames">{ menuName }</span>
          <input type="text" placeholder={ placeholder } style={{ width : menuSize }} />
        </div>
        :
        menuType === 'select' ?
        <div className="onmenubox">
          <span className="onmenunames">{ menuName }</span>
          <select name="select" id="" style={{ width : menuSize }}>
            <option value="전체">전체</option>
            <option value={ selectOption }>{ selectOption }</option>
          </select>
        </div>
        :
        null
      }
    </>
  )
}