import Button from '@components/ui/Button.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import http from '@lib/http.js';
import { fetchAndConvertCommonCodes } from '@utils/commonUtils.js';
import { createElement, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const LIST_PATH = '/sprtBiz/bizPbanc/bizInfo';

const COMMON_CODE_GROUPS = [
  'BIZ_PBANC_CLSF_CD',
  'BIZ_PBANC_SPRT_INST_CD',
  'ENT_LFCY_SE_CD',
  'LFCY_TRGT_ENT_SE_CD',
];

const labelOrValue = (map, value) => map?.[value] || value || '-';

const sanitizeHtml = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (typeof window === 'undefined') return raw;

  const parser = new window.DOMParser();
  const doc = parser.parseFromString(raw, 'text/html');

  doc
    .querySelectorAll('script,style,iframe,object,embed,link,meta')
    .forEach((node) => node.remove());

  doc.querySelectorAll('*').forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      const attrValue = attr.value || '';
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name);
        return;
      }
      if (
        (name === 'href' || name === 'src') &&
        /^\s*javascript:/i.test(attrValue)
      ) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML.trim();
};

const ALLOWED_HTML_TAGS = new Set([
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'span',
  'div',
  'ul',
  'ol',
  'li',
  'blockquote',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'a',
  'img',
]);

const ALLOWED_HTML_ATTRS = {
  a: ['href', 'target', 'title'],
  img: ['src', 'alt', 'title', 'width', 'height'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan'],
};

const toReactNode = (node, key) => {
  if (!node) return null;
  if (node.nodeType === 3) return node.textContent;
  if (node.nodeType !== 1) return null;

  const tag = node.tagName.toLowerCase();
  const children = Array.from(node.childNodes)
    .map((child, idx) => toReactNode(child, `${key}-${idx}`))
    .filter((child) => child !== null && child !== undefined);

  if (!ALLOWED_HTML_TAGS.has(tag)) {
    return children.length > 0
      ? createElement('span', { key }, children)
      : null;
  }

  const props = { key };
  const allowedAttrs = ALLOWED_HTML_ATTRS[tag] || [];
  allowedAttrs.forEach((attrName) => {
    const attrValue = node.getAttribute(attrName);
    if (!attrValue) return;
    if (attrName === 'colspan') {
      props.colSpan = attrValue;
      return;
    }
    if (attrName === 'rowspan') {
      props.rowSpan = attrValue;
      return;
    }
    props[attrName] = attrValue;
  });

  if (tag === 'a') {
    props.rel = 'noopener noreferrer';
  }

  return createElement(tag, props, children.length > 0 ? children : undefined);
};

const renderEditorHtml = (value) => {
  const html = sanitizeHtml(value);
  if (!html) return '-';

  const parser = new window.DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const nodes = Array.from(doc.body.childNodes)
    .map((node, idx) => toReactNode(node, `editor-node-${idx}`))
    .filter((node) => node !== null && node !== undefined);

  if (nodes.length === 0) return '-';
  return <div className="editor-html-content">{nodes}</div>;
};

export default function SupportBusinessDetail() {
  const navigate = useNavigate();
  const { sprtBizId } = useParams();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [commonCodeMap, setCommonCodeMap] = useState({});

  const [relationLoading, setRelationLoading] = useState(false);
  const [relations, setRelations] = useState([]);

  const mapRelationRows = (list) =>
    list.map((item, idx) => ({ ...item, _rowIndex: idx + 1 }));

  const relationColumns = [
    {
      id: 'bizPbancNo',
      header: '공고명',
      width: 420,
      cell: ({ row }) => row?.bizPbancNm || row?.bizPbancNo || '-',
    },
    {
      id: 'ccrncVlCn',
      header: '유사율',
      width: 180,
      cell: ({ row }) => row?.ccrncVlCn || '-',
    },
  ];

  const fetchDetail = async () => {
    if (!sprtBizId) return;

    setLoading(true);
    try {
      const res = await http.get(`/api/v1/support-business/${sprtBizId}`);
      setDetail(res?.data ?? res ?? null);
    } catch (error) {
      console.error('지원사업 상세 조회 실패:', error);
      alert('지원사업 상세 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelations = async () => {
    if (!sprtBizId) return;

    setRelationLoading(true);
    try {
      const res = await http.get(
        `/api/v1/support-business/${sprtBizId}/public-announcements`
      );
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];
      setRelations(mapRelationRows(list));
    } catch (error) {
      console.error('연관 사업공고 조회 실패:', error);
      setRelations([]);
    } finally {
      setRelationLoading(false);
    }
  };

  useEffect(() => {
    const loadCommonCodes = async () => {
      try {
        const codes = await fetchAndConvertCommonCodes(COMMON_CODE_GROUPS);
        const mapped = {};
        COMMON_CODE_GROUPS.forEach((group) => {
          mapped[group] = (codes?.[group] || []).reduce((acc, item) => {
            if (item?.value) {
              acc[item.value] = item.label;
            }
            return acc;
          }, {});
        });
        setCommonCodeMap(mapped);
      } catch (error) {
        console.error('공통코드 조회 실패:', error);
        setCommonCodeMap({});
      }
    };

    loadCommonCodes();
  }, []);

  useEffect(() => {
    fetchDetail();
    fetchRelations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprtBizId]);

  if (loading) {
    return (
      <div className="oncontentbox full">
        <div className="oncontents">
          <div className="loading">데이터를 불러오는 중입니다.</div>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="oncontentbox full">
        <div className="oncontents">
          <div className="loading">조회된 지원사업이 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>지원사업 상세조회</h2>
        <ul className="onbreadcrumb">
          <li>지원사업 관리</li>
          <li>사업공고 관리</li>
          <li>사업정보 관리</li>
          <li className="on">지원사업 상세조회</li>
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
                  <td>사업ID</td>
                  <td>{detail.sprtBizId || '-'}</td>
                  <td>사업연도</td>
                  <td>{detail.sprtBizCrtrYr || '-'}</td>
                </tr>
                <tr>
                  <td>사업유형</td>
                  <td>
                    {labelOrValue(
                      commonCodeMap.BIZ_PBANC_CLSF_CD,
                      detail.bizPbancClsfCd
                    )}
                  </td>
                  <td>지원기관</td>
                  <td>
                    {labelOrValue(
                      commonCodeMap.BIZ_PBANC_SPRT_INST_CD,
                      detail.bizPbancSprtInstCd
                    )}
                  </td>
                </tr>
                <tr>
                  <td>기업유형</td>
                  <td>
                    {labelOrValue(commonCodeMap.ENT_LFCY_SE_CD, detail.entLfcySeCd)}
                  </td>
                  <td>기업구분</td>
                  <td>
                    {labelOrValue(
                      commonCodeMap.LFCY_TRGT_ENT_SE_CD,
                      detail.lfcyTrgtEntSeCd
                    )}
                  </td>
                </tr>
                <tr>
                  <td>공개여부</td>
                  <td>{detail.rlsYn === 'Y' ? '공개' : '비공개'}</td>
                  <td>사업색인명</td>
                  <td>{detail.sprtBizIndxNm || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="ontableTitle">사업정보</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>사업명</td>
                  <td>{detail.sprtBizNm || '-'}</td>
                </tr>
                <tr>
                  <td>사업개요</td>
                  <td>{renderEditorHtml(detail.sprtBizOtln)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="ontableTitle">사업개요</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>지원규모</td>
                  <td>{renderEditorHtml(detail.sprtSclCn)}</td>
                </tr>
                <tr>
                  <td>지원대상</td>
                  <td>{renderEditorHtml(detail.sprtTrgtCn)}</td>
                </tr>
                <tr>
                  <td>지원제외대상</td>
                  <td>{renderEditorHtml(detail.sprtExclTrgtCn)}</td>
                </tr>
                <tr>
                  <td>지원내용</td>
                  <td>{renderEditorHtml(detail.sprtCn)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="ontableTitle">신청절차</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>신청방법</td>
                  <td>{renderEditorHtml(detail.aplyMthdCn)}</td>
                </tr>
                <tr>
                  <td>심사평가</td>
                  <td>{renderEditorHtml(detail.srngEvlCn)}</td>
                </tr>
                <tr>
                  <td>신청처리과정</td>
                  <td>{renderEditorHtml(detail.aplyPrcsCrsCn)}</td>
                </tr>
                <tr>
                  <td>제출서류</td>
                  <td>{renderEditorHtml(detail.bizAplySbmsnDcmntCn)}</td>
                </tr>
                <tr>
                  <td>참고사항</td>
                  <td>{renderEditorHtml(detail.refMttr)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="ontableTitle">문의처</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>문의처</td>
                  <td>{renderEditorHtml(detail.sprtBizInqplCn)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="ontableTitle">관련 사업공고</h4>
          <div className="ontable-legend">
            <span>
              총 <b>{relations.length}</b>건
            </span>
          </div>
          <div className="ongrid-tableform">
            <GridTable data={relations} columns={relationColumns} />
          </div>

          {relationLoading && (
            <div className="loading" style={{ marginTop: '12px' }}>
              데이터를 처리 중입니다.
            </div>
          )}
        </div>

        <div className="onflexbtns">
          <div style={{ marginRight: 'auto' }}>
            <Button
              btnType="list"
              btnNames="목록"
              onClick={() => navigate(LIST_PATH)}
            />
          </div>
          <Button
            btnType="edit"
            btnNames="수정"
            onClick={() => navigate('edit')}
          />
        </div>
      </div>
      <style>
        {`
          .editor-html-content p,
          .editor-html-content ul,
          .editor-html-content ol {
            margin: 0 0 8px 0;
          }
          .editor-html-content ul,
          .editor-html-content ol {
            padding-left: 20px;
          }
          .editor-html-content p:last-child,
          .editor-html-content ul:last-child,
          .editor-html-content ol:last-child {
            margin-bottom: 0;
          }
        `}
      </style>
    </div>
  );
}
