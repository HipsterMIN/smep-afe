import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import DatepickerTimeBox from '@components/ui/DatepickerTimeBox.jsx';
import FileUpload from '@components/ui/FileUpload.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import { useNavigate } from 'react-router-dom';

export default function EmailSendCreate() {
  const navigate = useNavigate();

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>이메일 작성</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li>이메일 관리</li>
          <li className="on">이메일 작성</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent ontable-form">
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>메일분류</td>
                  <td colSpan={3}>
                    <MenuInputBox menuType="select" selectOption="전체" />
                  </td>
                </tr>
                <tr>
                  <td>제목</td>
                  <td colSpan={3}>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      placeholder="제목을 입력해주세요."
                    />
                  </td>
                </tr>
                <tr>
                  <td>발신자 정보</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      placeholder="발신자명을 입력해주세요."
                    />
                  </td>
                  <td>이메일 주소</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="100%"
                      placeholder="이메일 주소를 입력해주세요."
                    />
                  </td>
                </tr>
                <tr>
                  <td>수신자</td>
                  <td colSpan={3}>
                    <div className="flexColumn">
                      <div className="flexRow">
                        <MenuInputBox
                          menuType="input"
                          menuSize="150px"
                          placeholder="이름을 입력하세요."
                        />
                        <MenuInputBox
                          menuType="input"
                          menuSize="300px"
                          placeholder="이메일 주소를 입력해주세요."
                        />
                        <div style={{ marginRight: 'auto' }}>
                          <Button btnType="add" btnNames="추가" />
                        </div>
                        <Button btnType="add" btnNames="엑셀 불러오기" />
                        <Button btnType="list" btnNames="회원목록" />
                      </div>

                      <div className="flexRow">
                        <div className="onaddUserForm">
                          <div className="onaddUser">
                            <span>홍길동 gildong@hong.com</span>
                            <i className="onicon close" />
                          </div>
                          <div className="onaddUser">
                            <span>홍길동 gildong@hong.com</span>
                            <i className="onicon close" />
                          </div>
                          <div className="onaddUser">
                            <span>홍길동 gildong@hong.com</span>
                            <i className="onicon close" />
                          </div>
                        </div>
                        <div className="onDelBox">
                          <span>발송 총 인원 : 3명</span>
                          <Button btnType="del" btnNames="전체삭제" />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>발송일시</td>
                  <td colSpan={3}>
                    <div className="flexRow">
                      <Button btnType="add" btnNames="즉시발송" />
                      <Button btnType="list" btnNames="예약발송" />

                      <div
                        className="ondatepickerbox"
                        style={{ marginLeft: '10px' }}
                      >
                        <DatepickerBox />
                        <span className="onunit">~</span>
                        <DatepickerBox />
                        <DatepickerTimeBox />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>첨부파일</td>
                  <td colSpan={3}>
                    <Button btnType="addfile" btnNames="파일 선택" />
                    <FileUpload mode="edit" />
                    <FileUpload mode="edit" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="flexColumn centerGap">
                      <span>내용</span>
                      <div style={{ width: '108px', whiteSpace: 'nowrap' }}>
                        <Button btnType="add" btnNames="양식 불러오기" />
                      </div>
                    </div>
                  </td>
                  <td colSpan={3}>
                    <div className="oneditcontent"></div>
                  </td>
                </tr>
                <tr>
                  <td>설명</td>
                  <td colSpan={3}>
                    <div className="oneditcontent"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="onflexbtns">
          <div style={{ marginRight: 'auto' }}>
            <Button
              btnType="list"
              btnNames="목록"
              onClick={() => navigate('..')}
            />
          </div>
          <Button btnType="add" bgColor="color-gray" btnNames="다시쓰기" />
          <Button btnType="add" btnNames="발송" />
        </div>
      </div>
    </div>
  );
}
