import Button from '../ui/Button';

// 관리자 화면 - 그리드 테이블 버튼
function ButtonCell({ row, column, onAction }) {
  function onClick() {
    onAction &&
      onAction({
        action: 'custom-button',
        data: {
          column: column.id,
          row: row.id,
        },
      });
  }

  return <Button btnType="edit" btnNames="수정" />;
}

export default ButtonCell;
