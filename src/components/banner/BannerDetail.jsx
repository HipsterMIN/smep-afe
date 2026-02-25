import Button from '@components/ui/Button.jsx';
import FileUpload from '@components/ui/FileUpload.jsx';
import PropTypes from 'prop-types';

/**
 * 파일 상세 배열을 FileUpload 컴포넌트용 포맷으로 변환
 */
function toFileList(atFiles = []) {
  return atFiles.map((f) => ({
    id: f.atchFileId + '_' + f.atchFileSn,
    atchFileId: f.atchFileId,
    atchFileSn: f.atchFileSn,
    fileName: f.orgnlFileNm,
    fileSize: f.fileSz,
    status: 'existing',
  }));
}

export default function BannerDetail({ data, onEdit }) {
  if (!data) return null;

  const pcFileList = toFileList(data.imgAtchFiles);
  // 태블릿 = 모바일 파일과 동일 필드 사용 (DDL 기준)
  const moblFileList = toFileList(data.moblImgAtchFiles);

  return (
    <div className="oncontent ontable-form">
      <h4>배너 상세조회</h4>
      <div className="ontableBox">
        <table>
          <colgroup>
            <col style={{ width: '150px' }} />
            <col style={{ width: 'auto' }} />
          </colgroup>
          <tbody>
            <tr>
              <td>배너구분</td>
              <td>{data.bnrPstnSeCdNm}</td>
            </tr>
            <tr>
              <td>제목</td>
              <td>{data.bnrTtl}</td>
            </tr>
            <tr>
              <td>이미지 파일(PC)</td>
              <td>
                <div className="onflexcolumn">
                  <FileUpload mode="view" files={pcFileList} />
                  {data.imgFileSbstPhrsCn && (
                    <dl>
                      <dt>대체 문구 : </dt>
                      <dd>{data.imgFileSbstPhrsCn}</dd>
                    </dl>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td>이미지 파일(태블릿)</td>
              <td>
                <div className="onflexcolumn">
                  <FileUpload mode="view" files={moblFileList} />
                  {data.moblImgSbstPhrsCn && (
                    <dl>
                      <dt>대체 문구 : </dt>
                      <dd>{data.moblImgSbstPhrsCn}</dd>
                    </dl>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td>이미지 파일(모바일)</td>
              <td>
                <div className="onflexcolumn">
                  <FileUpload mode="view" files={moblFileList} />
                  {data.moblImgSbstPhrsCn && (
                    <dl>
                      <dt>대체 문구 : </dt>
                      <dd>{data.moblImgSbstPhrsCn}</dd>
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

BannerDetail.propTypes = {
  data: PropTypes.object,
  onEdit: PropTypes.func,
};
