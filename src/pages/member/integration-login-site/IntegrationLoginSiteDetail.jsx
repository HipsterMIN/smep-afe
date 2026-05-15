import Breadcrumb from '@components/ui/Breadcrumb.jsx';
import Button from '@components/ui/Button.jsx';
import http from '@lib/http.js';
import { fetchCommonCodes } from '@utils/commonUtils.js';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const toDisplayText = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return value;
};

const toYnLabel = (value, yesLabel, noLabel) => {
  if (value === 'Y') return yesLabel;
  if (value === 'N') return noLabel;
  return '-';
};

export default function IntegrationLoginSiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pageTitle = '통합로그인 사이트 상세조회';
  const [detail, setDetail] = useState(null);
  const [linkUseTrgtSeCd, setLinkUseTrgtSeCd] = useState([]);

  const getLinkUseTrgtSeLabel = (code) => {
    const fallbackMap = {
      IND: '개인',
      ENT: '기업',
      ALL: '모든 회원',
    };

    return (
      linkUseTrgtSeCd.find((item) => item.value === code)?.label ||
      fallbackMap[code] ||
      code ||
      '-'
    );
  };

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) {
        alert('사이트코드가 없습니다.');
        navigate('..', { relative: 'path' });
        return;
      }

      try {
        const response = await http.get(
          `/api/v1/linksite/${encodeURIComponent(id)}`
        );
        setDetail(response?.data || response || null);
      } catch (error) {
        console.error('통합로그인 사이트 상세 조회 실패:', error);
        alert('통합로그인 사이트 상세 정보를 불러오는데 실패했습니다.');
        setDetail(null);
      }
    };

    fetchDetail();
  }, [id, navigate]);

  useEffect(() => {
    const fetchCommonCode = async () => {
      try {
        const response = await fetchCommonCodes(['LINK_USE_TRGT_SE_CD']);
        const linkUseTrgtSeOptions = (response.LINK_USE_TRGT_SE_CD || []).map(
          (item) => ({
            value: item.comCd,
            label: item.comCdNm,
          })
        );

        setLinkUseTrgtSeCd(linkUseTrgtSeOptions);
      } catch (error) {
        console.error('공통코드 조회 실패:', error);
      }
    };

    fetchCommonCode();
  }, []);

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>{pageTitle}</h2>
        <Breadcrumb pageTitle={pageTitle} />
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
                  <td>사이트코드</td>
                  <td>{toDisplayText(detail?.linkSiteCd)}</td>
                  <td>사이트명</td>
                  <td>{toDisplayText(detail?.siteNm)}</td>
                </tr>
                <tr>
                  <td>사이트 설명</td>
                  <td colSpan={3}>{toDisplayText(detail?.siteExpln)}</td>
                </tr>
                <tr>
                  <td>사이트 URL</td>
                  <td colSpan={3}>{toDisplayText(detail?.siteUrlAddr)}</td>
                </tr>
                <tr>
                  <td>관리기관 명</td>
                  <td>{toDisplayText(detail?.siteMngInstNm)}</td>
                  <td>담당자 명</td>
                  <td>{toDisplayText(detail?.sitePicNm)}</td>
                </tr>
                <tr>
                  <td>노출여부</td>
                  <td>{toYnLabel(detail?.prtlSysExpsrYn, '노출', '미노출')}</td>
                  <td>사용여부</td>
                  <td>{toYnLabel(detail?.useYn, '사용', '미사용')}</td>
                </tr>
                <tr>
                  <td>회원구분</td>
                  <td colSpan={3}>
                    {getLinkUseTrgtSeLabel(detail?.linkUseTrgtSeCd)}
                  </td>
                </tr>
                <tr>
                  <td>등록일시</td>
                  <td>{formatDate(detail?.regDt, 'yyyy-MM-dd HH:mm:ss')}</td>
                  <td>등록자</td>
                  <td>{toDisplayText(detail?.rgtrId)}</td>
                </tr>
                <tr>
                  <td>최종수정일시</td>
                  <td colSpan={3}>
                    {formatDate(detail?.mdfcnDt, 'yyyy-MM-dd HH:mm:ss')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ontable-legend">
            <Button
              btnType="list"
              btnNames="목록"
              onClick={() => navigate('..', { relative: 'path' })}
            />
            <Button
              btnType="edit"
              btnNames="수정"
              onClick={() => navigate('update')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
