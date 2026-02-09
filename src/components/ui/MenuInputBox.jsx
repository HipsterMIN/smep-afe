// 관리자 화면 - 커스텀 인풋(메뉴) 컴포넌트
export default function MenuInputBox({
  menuType,
  inputId,
  menuName,
  menuSize = '100px',
  selectOption,
  options,
  placeholder,
  value,
  onChange,
}) {
    const handleChange = (e) => {
        if (onChange) onChange(e);
    };

    return (
        <>
            {menuType === 'input' ? (
                <div className={`onmenubox${menuSize === '100%' ? ' fullSize' : ''}`}>
                    {menuName ? <span className="onmenunames">{menuName}</span> : null}
                    <input
                        id={inputId}
                        type="text"
                        placeholder={placeholder}
                        style={{ width: menuSize }}
                        value={value ?? ''}
                        onChange={handleChange}
                    />
                </div>
            ) : menuType === 'select' ? (
                <div className={`onmenubox${menuSize === '100%' ? ' fullSize' : ''}`}>
                    {menuName ? <span className="onmenunames">{menuName}</span> : null}
                    <select
                        name={inputId || 'select'}
                        id={inputId || ''}
                        style={{ width: menuSize }}
                        value={value ?? (selectOption ?? '전체')}
                        onChange={handleChange}
                    >
                        {options && options.length > 0 ? (
                            options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))
                        ) : (
                            <>
                                <option value="전체">전체</option>
                                {selectOption ? <option value={selectOption}>{selectOption}</option> : null}
                            </>
                        )}
                    </select>
                </div>
            ) : null}
        </>
    );
}
