import Button from '@components/ui/Button.jsx';
import FileUpload from '@components/ui/FileUpload.jsx';
import PropTypes from 'prop-types';

export default function PopupDetail({ data, onEdit }) {
  if (!data) return null;

  const fileList = (data.imgAtchFiles || []).map((f) => ({
    id: f.atchFileId + '_' + f.atchFileSn,
    atchFileId: f.atchFileId,
    atchFileSn: f.atchFileSn,
    fileName: f.orgnlFileNm,
    fileSize: f.fileSz,
    status: 'existing',
  }));

  return (
    <div className="oncontent ontable-form">
      <h4>팝업 상세조회</h4>
      <div className="ontableBox">
        <table>
          <colgroup>
            <col style={{ width: '150px' }} />
            <col style={{ width: 'auto' }} />
          </colgroup>
          <tbody>
            <tr>
              <td>팝업종류</td>
              <td>{data.popupKndCdNm}</td>
            </tr>
            <tr>
              <td>제목</td>
              <td>{data.popupTtl}</td>
            </tr>
            <tr>
              <td>팝업창 위치</td>
              <td>
                <div className="onmenuspace">
                  <dl>
                    <dt>TOP</dt>
                    <dd>{data.upendPstnNvl}</dd>
                  </dl>
                  <dl>
                    <dt>LEFT</dt>
                    <dd>{data.lfsdPstnNvl}</dd>
                  </dl>
                </div>
              </td>
            </tr>
            <tr>
              <td>팝업창 사이즈</td>
              <td>
                <div className="onmenuspace">
                  <dl>
                    <dt>가로</dt>
                    <dd>{data.wdthLen}</dd>
                  </dl>
                  <dl>
                    <dt>세로</dt>
                    <dd>{data.vrtcLen}</dd>
                  </dl>
                </div>
              </td>
            </tr>
            <tr>
              <td>이미지 파일</td>
              <td>
                <div className="onflexcolumn">
                  <FileUpload mode="view" files={fileList} />
                  {data.imgSbstTxtCn && (
                    <dl>
                      <dt>대체 문구 : </dt>
                      <dd>{data.imgSbstTxtCn}</dd>
                    </dl>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td>링크</td>
              <td>
                {data.imgLnkgUrlAddr ? (
                  <a
                    href={data.imgLnkgUrlAddr}
                    target={data.imgLnkgNpagYn === 'Y' ? '_blank' : '_self'}
                    rel="noreferrer"
                  >
                    {data.imgLnkgUrlAddr}
                  </a>
                ) : (
                  '-'
                )}
              </td>
            </tr>
            <tr>
              <td>링크타겟</td>
              <td>{data.imgLnkgNpagYn === 'Y' ? '새창' : '현재창'}</td>
            </tr>
            <tr>
              <td>게시기간</td>
              <td>
                {data.pstgBgngYmd} ~ {data.pstgEndYmd}
              </td>
            </tr>
            <tr>
              <td>그만보기 여부</td>
              <td>{data.vwngStopUseYn === 'Y' ? '사용' : '사용안함'}</td>
            </tr>
            <tr>
              <td>사용여부</td>
              <td>{data.useYn === 'Y' ? '사용' : '사용안함'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="onflexbtns">
        <div style={{ marginLeft: 'auto' }}>
          <Button btnType="edit" btnNames="수정" onClick={onEdit} />
        </div>
      </div>
    </div>
  );
}

PopupDetail.propTypes = {
  data: PropTypes.object,
  onEdit: PropTypes.func,
};
