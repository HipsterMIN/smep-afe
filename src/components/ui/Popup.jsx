import { useState } from 'react';

// 관리자 화면 - 팝업 컴포넌트
export default function Popup({ title, autoHeight, children }) {
  const [isOpen, setOpen] = useState(true);

  return (
    <>
      {
        isOpen &&
        <div className="popup">
        <div className="inner">
          <div className="titleBox">
            <h2>{ title }</h2>
            <a className="close" onClick={ () => setOpen(false)} />
          </div>
          <div className={`oncontents ${autoHeight && 'autoHeight'}`}>
            { children }
          </div>
        </div>
      </div>
      }
    </>
    
  )
}
