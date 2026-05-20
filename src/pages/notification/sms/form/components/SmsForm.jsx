import Button from '@components/ui/Button.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import TextareaBox from '@components/ui/TextareaBox.jsx';
import http from '@lib/http.js';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function SmsForm({ mode = 'create' }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const isUpdateMode = mode === 'update';

  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [content, setContent] = useState('');
  const [writer, setWriter] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [loading, setLoading] = useState(false);

  const formatDateTime = (value) => {
    if (!value) return '';
    if (/^\d{14}$/.test(value)) {
      return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)} ${value.slice(8, 10)}:${value.slice(10, 12)}`;
    }
    return value;
  };

  const fetchDetail = async () => {
    if (!isUpdateMode || !id) return;

    setLoading(true);
    try {
      const response = await http.get(
        `/api/v1/notification/sms/templates/${id}`
      );
      const payload = response?.data?.data ?? response?.data ?? response ?? {};

      setFormId(payload?.tplId ? String(payload.tplId) : '');
      setFormName(payload?.tplTitle ?? '');
      setContent(payload?.tplContent ?? '');
      setWriter(payload?.writer ?? '');
      setCreatedAt(formatDateTime(payload?.inDate));
    } catch (error) {
      console.error('SMS 양식 상세 조회 실패:', error);
      alert('SMS 양식 상세 조회 중 오류가 발생했습니다.');
      navigate('..');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUpdateMode) {
      fetchDetail();
      return;
    }

    setFormId('');
    setFormName('');
    setContent('');
    setWriter('');
    setCreatedAt('');
  }, [isUpdateMode, id]);

  const validate = () => {
    if (!formName.trim()) {
      alert('양식 명을 입력하세요.');
      return false;
    }

    if (!content || !String(content).trim()) {
      alert('내용을 입력하세요.');
      return false;
    }

    return true;
  };

  const buildRequestBody = () => ({
    tplTitle: formName.trim(),
    tplContent: content,
  });

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (isUpdateMode) {
        await http.post(
          `/api/v1/notification/sms/templates/update/${id}`,
          buildRequestBody()
        );
        alert('수정되었습니다.');
      } else {
        await http.post(
          '/api/v1/notification/sms/templates',
          buildRequestBody()
        );
        alert('등록되었습니다.');
      }

      navigate('..');
    } catch (error) {
      console.error('SMS 양식 저장 실패:', error);
      alert('SMS 양식 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isUpdateMode || !id) return;

    if (!window.confirm('삭제하시겠습니까?')) return;

    setLoading(true);
    try {
      await http.post(`/api/v1/notification/sms/templates/delete/${id}`);
      alert('삭제되었습니다.');
      navigate('..');
    } catch (error) {
      console.error('SMS 양식 삭제 실패:', error);
      alert('SMS 양식 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>SMS 양식 등록/수정</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li>SMS 관리</li>
          <li>SMS 양식 목록</li>
          <li className="on">SMS 양식 등록/수정</li>
        </ul>
      </div>

      <div className="oncontents">
        <div className="oncontent ontable-form">
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>양식 ID</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="500px"
                      value={isUpdateMode ? formId : '자동생성'}
                      disabled={true}
                    />
                  </td>
                </tr>
                <tr>
                  <td>양식 명</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="500px"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="양식 명을 입력하세요."
                      maxLength={1000}
                    />
                  </td>
                </tr>
                <tr>
                  <td>내용</td>
                  <td>
                    <TextareaBox
                      menuSize="100%"
                      placeholder="여기에 발송할 메시지를 입력해주세요"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>작성자</td>
                  <td>{writer || '-'}</td>
                </tr>
                <tr>
                  <td>작성일</td>
                  <td>{createdAt || '-'}</td>
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

          {isUpdateMode && (
            <Button
              btnType="del"
              btnNames="삭제"
              onClick={handleDelete}
              disabled={loading}
            />
          )}

          <Button
            btnType="add"
            btnNames="저장"
            onClick={handleSave}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}
