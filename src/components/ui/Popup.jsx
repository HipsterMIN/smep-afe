// 관리자 화면 - 팝업 컴포넌트
export default function Popup({ title, autoHeight, children, onClose }) {
  return (
      <div className="popup">
        <div className="inner">
          <div className="titleBox">
            <h2>{title}</h2>
            <a className="close" onClick={onClose} />
          </div>
          <div className={`oncontents ${autoHeight && 'autoHeight'}`}>
            {children}
          </div>
        </div>
      </div>
  );
}