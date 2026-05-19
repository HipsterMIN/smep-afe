import Breadcrumb from '@components/ui/Breadcrumb.jsx';
import Button from '@components/ui/Button.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import http from '@lib/http.js';
import React, { useEffect, useState } from 'react';
import { useMatches, useNavigate, useParams } from 'react-router-dom';

const LIST_PATH = '/infoPvsn/utlzInfo/evntInfo';

const STREAMDOCS_VIEWER_URL =
  import.meta.env.VITE_STREAMDOCS_VIEWER_URL ||
  'https://www.smes.go.kr/e-paper/view/sd';

const buildStreamDocsPreviewUrl = (streamdocsId) =>
  `${STREAMDOCS_VIEWER_URL};streamdocsId=${encodeURIComponent(streamdocsId)}`;

export default function EventInfoDetail() {
  const navigate = useNavigate();
  const { evntInfoId } = useParams();
  const matches = useMatches();
  const ynoOptions = [
    { label: '사용', value: 'Y' },
    { label: '미사용', value: 'N' },
  ];
  const renderReadOnlyRadioGroup = (groupKey, value, options) => (
    <div className="onradioBox">
      {options.map((option, index) => (
        <RadioButton
          key={`${groupKey}_${option.value}`}
          groupId={`${groupKey}_${index + 1}`}
          radioGroup={groupKey}
          radioValue={option.value}
          radioName={option.label}
          selectedValue={value}
          onChange={() => {}} // 상세 화면이므로 클릭해도 변하지 않게 빈 함수 처리
          disabled={true} // 읽기 전용 설정
        />
      ))}
    </div>
  );
  const routeMenuName =
    [...matches]
      .reverse()
      .map((match) => match?.handle?.menuNm)
      .find((menuNm) => typeof menuNm === 'string' && menuNm.trim()) ||
    '행사 정보';

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  // console.log(form);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await http.get(`/api/v1/event-info/${evntInfoId}`);
        const detail = res?.data?.data || res?.data || res;
        setForm(detail);
        console.log(detail);
      } catch (error) {
        console.error('조회 실패:', error);
        alert('데이터를 불러오는데 실패했습니다.');
        navigate(LIST_PATH);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [evntInfoId, navigate]);

  if (loading)
    return (
      <div className="oncontentbox full">
        <div className="oncontents">로딩 중...</div>
      </div>
    );

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>{routeMenuName} 상세 조회</h2>
        <Breadcrumb pageTitle={routeMenuName} />
      </div>

      <div className="oncontents">
        <div className="oncontent ontable-form">
          <h4 className="ontableTitle">기본 정보</h4>
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
                  <td>행사명</td>
                  <td colSpan="3">{form.evntInfoTtlNm}</td>
                </tr>
                <tr>
                  <td>분야</td>
                  <td>{form.evntInfoFldNm}</td>
                  <td>행사유형</td>
                  <td>{form.evntInfoTypeNm}</td>
                </tr>
                <tr>
                  <td>지역</td>
                  <td>{form.evntInfoRgnNm}</td>
                  <td>수행기관</td>
                  <td>{form.evntInfoFlfmtInstNm}</td>
                </tr>
                <tr>
                  <td>접수기간</td>
                  <td>{form.rcptPrdCn}</td>
                  <td>행사기간</td>
                  <td>{form.evntPrdCn}</td>
                </tr>
                <tr>
                  <td>출처 URL</td>
                  <td colSpan="3">
                    <a
                      href={form.srcUrlAddr}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'blue', textDecoration: 'underline' }}
                    >
                      {form.srcUrlAddr}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>해시태그</td>
                  <td colSpan="3">
                    <div
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {(() => {
                        if (!form.hstgCn) return '';

                        let tags = [];
                        try {
                          let parsed = form.hstgCn;

                          // 1. 문자열인 경우 먼저 파싱
                          if (typeof form.hstgCn === 'string') {
                            parsed = JSON.parse(form.hstgCn);
                          }

                          // 2. 파싱된 결과가 객체이고 hstgCn이라는 키를 가지고 있는 경우 (유저님의 상황)
                          if (
                            parsed &&
                            !Array.isArray(parsed) &&
                            Array.isArray(parsed.hstgCn)
                          ) {
                            tags = parsed.hstgCn;
                          }
                          // 3. 파싱된 결과가 바로 배열인 경우
                          else if (Array.isArray(parsed)) {
                            tags = parsed;
                          }
                          // 4. 그 외 일반 문자열인 경우
                          else if (typeof form.hstgCn === 'string') {
                            tags = form.hstgCn.split(',').map((t) => t.trim());
                          }
                        } catch (e) {
                          // JSON 파싱 에러 시 단순 문자열 처리
                          return String(form.hstgCn).replace(
                            /[\[\]\"{}:]/g,
                            ''
                          );
                        }

                        // 최종 결과가 비어있으면 빈 문자열 반환, 있으면 콤마로 연결
                        return tags.length > 0 ? tags.join(', ') : '';
                      })()}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>사용 여부</td>
                  <td colSpan="3">
                    {renderReadOnlyRadioGroup('useYn', form.useYn, ynoOptions)}
                  </td>
                </tr>

                <tr>
                  <td>공고문</td>
                  <td colSpan="3">
                    {form.pbancDocAtchFiles &&
                    form.pbancDocAtchFiles.length > 0 ? (
                      form.pbancDocAtchFiles.map((file, idx) => {
                        const previewId =
                          file?.strmdcsId || (idx === 0 ? form.strmdcsId : '');
                        return (
                        <div key={idx} className="file-item">
                          <a
                            href={`/api/v1/file/download/${file.atchFileId}/${file.atchFileSn}`}
                            style={{
                              color: '#0056b3',
                              textDecoration: 'underline',
                            }}
                          >
                            {file.orgnlFileNm} ({Math.round(file.fileSz / 1024)}{' '}
                            KB)
                          </a>
                          {previewId && (
                            <a
                              href={buildStreamDocsPreviewUrl(previewId)}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                marginLeft: '10px',
                                fontSize: '12px',
                                color: '#666',
                              }}
                            >
                              [미리보기]
                            </a>
                          )}
                        </div>
                      );
                      })
                    ) : (
                      <span style={{ color: '#999' }}>
                        등록된 공고문이 없습니다.
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>첨부파일</td>
                  <td colSpan="3">
                    {form.pbancAtchFiles && form.pbancAtchFiles.length > 0 ? (
                      form.pbancAtchFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="file-item"
                          style={{ marginBottom: '5px' }}
                        >
                          <a
                            href={`/api/v1/file/download/${file.atchFileId}/${file.atchFileSn}`}
                            style={{
                              color: '#0056b3',
                              textDecoration: 'underline',
                            }}
                          >
                            {file.orgnlFileNm} ({Math.round(file.fileSz / 1024)}{' '}
                            KB)
                          </a>
                          {file?.strmdcsId && (
                            <a
                              href={buildStreamDocsPreviewUrl(file.strmdcsId)}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                marginLeft: '10px',
                                fontSize: '12px',
                                color: '#666',
                              }}
                            >
                              [미리보기]
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <span style={{ color: '#999' }}>
                        등록된 첨부파일이 없습니다.
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h4 className="ontableTitle">행사개요</h4>
          <div className="ontableBox">
            <div
              className="view-editor-content"
              style={{
                padding: '20px',
                border: '1px solid #ddd',
                minHeight: '200px',
              }}
              dangerouslySetInnerHTML={{ __html: form.evntOtlnCn }}
            />
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
          <Button
            btnType="edit"
            btnNames="수정"
            onClick={() =>
              navigate(`/infoPvsn/utlzInfo/evntInfo/${evntInfoId}/edit`)
            }
          />
        </div>
      </div>
    </div>
  );
}
