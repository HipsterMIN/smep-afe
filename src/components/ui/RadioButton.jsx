
// 관리자 화면 - 라디오 버튼 컴포넌트 
export default function RadioButton({
  groupId,
  radioGroup,
  radioValue,
  disabled,
  radioName,
  selectedValue,
  onChange
}) {
  const isChecked = selectedValue === radioValue

  return (
    <label
      htmlFor={groupId}
      className={`onradiobtns ${isChecked ? 'clicked' : ''}`}
    >
      <input
        type="radio"
        id={groupId}
        name={radioGroup}
        value={radioValue}
        checked={isChecked}
        disabled={disabled}
        onChange={() => onChange(radioValue)}
      />
      <span className="onnames">{radioName}</span>
    </label>
  )
}
