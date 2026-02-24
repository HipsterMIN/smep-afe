import Button from '@components/ui/Button.jsx';
import http from '@lib/http.js';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function CertificateDetail() {
  const { prdocCd } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificateDetail();
  }, [prdocCd]);

  // 증명서 상세 조회
  const fetchCertificateDetail = async () => {
    try {
      setLoading(true);
      const response = await http.get(`/api/v1/certificates/${prdocCd}`);
      setCertificate(response.data);
    } catch (error) {
      console.error('증명서 정보 조회 실패:', error);
      alert('증명서 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleList = () => {
    navigate('/prdocIssu/prdocInfo');
  };

  const handleEdit = () => {
    navigate(`/prdocIssu/prdocInfo/${prdocCd}/edit`);
  };

  // 날짜 포맷팅
  const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';
    return new Date(dateTime).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!certificate) {
    return <div>증명서 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>증명서 정보 상세조회</h2>
        <ul className="onbreadcrumb">
          <li>증명서 발급 관리</li>
          <li>증명서 정보 관리</li>
          <li>증명서 정보 목록</li>
          <li className="on">증명서 정보 상세조회</li>
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
                  <td>증명서 명</td>
                  <td>{certificate.prdocTtl}</td>
                  <td>공개여부</td>
                  <td>{certificate.rlsYn === 'Y' ? '공개' : '비공개'}</td>
                </tr>
                <tr>
                  <td>소관기관</td>
                  <td>{certificate.jrsdInstNm}</td>
                  <td>발급기관</td>
                  <td>{certificate.issuInstNm}</td>
                </tr>
                <tr>
                  <td>등록일시</td>
                  <td>{formatDateTime(certificate.regDt)}</td>
                  <td>최종수정일시</td>
                  <td>{formatDateTime(certificate.mdfcnDt)}</td>
                </tr>
                <tr>
                  <td>직접발급 여부</td>
                  <td>
                    {certificate.drctIssuYn === 'Y' ? '대상' : '대상아님'}
                  </td>
                  <td>전자증명서 대상 여부</td>
                  <td>{certificate.elpblYn === 'Y' ? '대상' : '대상아님'}</td>
                </tr>
                <tr>
                  <td>타서비스 링크</td>
                  <td colSpan={3}>
                    <div className="onmenuspace">
                      <span className="onmenunames">서비스명</span>
                      <span>{certificate.prdocTtl}</span>

                      <span className="onmenunames">링크</span>
                      <span>
                        {certificate.otsdSiteUrlAddr ? (
                          <a
                            href={certificate.otsdSiteUrlAddr}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {certificate.otsdSiteUrlAddr}
                          </a>
                        ) : (
                          '-' // 링크 없을 때 대시만 표시
                        )}
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>내용(PC)</td>
                  <td colSpan={3}>
                    <div
                      style={{ whiteSpace: 'pre-wrap' }}
                      dangerouslySetInnerHTML={{
                        __html: certificate.prdocExpln || '-',
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>내용(모바일)</td>
                  <td colSpan={3}>
                    <div
                      style={{ whiteSpace: 'pre-wrap' }}
                      dangerouslySetInnerHTML={{
                        __html: certificate.moblPrdocExpln || '-',
                      }}
                    ></div>
                  </td>
                </tr>
                <tr>
                  <td>안내문구</td>
                  <td colSpan={3}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {certificate.prdocIssuGdCn || '-'}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="onflexbtns">
          <div style={{ marginRight: 'auto' }}>
            <Button btnType="list" btnNames="목록" onClick={handleList} />
          </div>
          <Button btnType="edit" btnNames="수정" onClick={handleEdit} />
        </div>
      </div>
    </div>
  );
}
