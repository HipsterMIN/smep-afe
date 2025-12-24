import { useState } from "react"

// 관리자 화면 - checkbox 컴포넌트 
export default function CheckBox({ chkId, chkName }) { 
  const [isChk, setChk] = useState(false);
  const toggleChk = () => { setChk(!isChk) };

  return (
    <label htmlFor={chkId} className={`onchkLabel ${isChk && 'checked'}`}>
      <input id={chkId} type="checkbox" onClick={toggleChk} />
      {chkName && <span className="onchkName">{ chkName }</span>}
    </label>
  )
}