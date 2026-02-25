import Button from '@components/ui/Button.jsx';
import CheckBox from '@components/ui/CheckBox.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import FileUpload from '@components/ui/FileUpload.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const BNR_PSTN_OPTIONS = [
  { value: 'UEBN', label: '상단배너' },
  { value: 'MDBN', label: '중단배너' },
  { value: 'LPBN', label: '하단배너' },
];

// 상시사용 시 게시종료일자
const PERMANENT_END_DATE = '99991231';

const INITIAL_FORM = {
  bnrTtl: '',
  bnrPstnSeCd: '',
  imgAtchFileId: '',
  imgFileSbstPhrsCn: '',
  moblImgAtchFileId: '',
  moblImgSbstPhrsCn: '',
  imgLnkgUrlAddr: '',
  imgLnkgNpagYn: 'N',
  pstgBgngYmd: '',
  pstgEndYmd: '',
  useYn: 'Y',
};

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

export default function BannerForm({ data, isEdit, onSave, onDelete }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isPermanent, setIsPermanent] = useState(false);
  const [pcFiles, setPcFiles] = useState([]);
  const [moblFiles, setMoblFiles] = useState([]);

  useEffect(() => {
    if (data && isEdit) {
      const permanent = data.pstgEndYmd === PERMANENT_END_DATE;
      setIsPermanent(permanent);
      setForm({
        bnrTtl: data.bnrTtl || '',
        bnrPstnSeCd: data.bnrPstnSeCd || '',
        imgAtchFileId: data.imgAtchFileId || '',
        imgFileSbstPhrsCn: data.imgFileSbstPhrsCn || '',
        moblImgAtchFileId: data.moblImgAtchFileId || '',
        moblImgSbstPhrsCn: data.moblImgSbstPhrsCn || '',
        imgLnkgUrlAddr: data.imgLnkgUrlAddr || '',
        imgLnkgNpagYn: data.imgLnkgNpagYn || 'N',
        pstgBgngYmd: data.pstgBgngYmd || '',
        pstgEndYmd: permanent ? '' : data.pstgEndYmd || '',
        useYn: data.useYn || 'Y',
      });
      setPcFiles(toFileList(data.imgAtchFiles || []));
      setMoblFiles(toFileList(data.moblImgAtchFiles || []));
    } else {
      setForm(INITIAL_FORM);
      setIsPermanent(false);
      setPcFiles([]);
      setMoblFiles([]);
    }
  }, [data, isEdit]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePermanentChange = (checked) => {
    setIsPermanent(checked);
    if (checked) {
      setForm((prev) => ({ ...prev, pstgEndYmd: '' }));
    }
  };

  const handleSubmit = () => {
    if (!form.bnrTtl.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!form.bnrPstnSeCd) {
      alert('배너구분을 선택해주세요.');
      return;
    }
    if (!form.pstgBgngYmd) {
      alert('게시 시작일자를 입력해주세요.');
      return;
    }
    if (!isPermanent && !form.pstgEndYmd) {
      alert('게시 종료일자를 입력하거나 상시사용을 체크해주세요.');
      return;
    }

    // PC 신규/삭제 파일
    const newImgFile = pcFiles.find((f) => f.status === 'new')?.file || null;
    const deletedPcSns = pcFiles
      .filter((f) => f.status === 'deleted' && f.atchFileSn !== undefined)
      .map((f) => f.atchFileSn);

    // 모바일 신규/삭제 파일
    const newMoblFile = moblFiles.find((f) => f.status === 'new')?.file || null;
    const deletedMoblSns = moblFiles
      .filter((f) => f.status === 'deleted' && f.atchFileSn !== undefined)
      .map((f) => f.atchFileSn);

    const fileStatusInfoJson =
      deletedPcSns.length > 0 || deletedMoblSns.length > 0
        ? JSON.stringify({
            deletedImgAtchFileSns: deletedPcSns,
            deletedMoblImgAtchFileSns: deletedMoblSns,
          })
        : null;

    const submitData = {
      ...form,
      pstgEndYmd: isPermanent ? PERMANENT_END_DATE : form.pstgEndYmd,
    };

    onSave(submitData, newImgFile, newMoblFile, fileStatusInfoJson);
  };

  return (
    <div className="oncontent ontable-form">
      <h4>{isEdit ? '배너 수정' : '배너 등록'}</h4>
      <div className="ontableBox">
        <table>
          <colgroup>
            <col style={{ width: '150px' }} />
            <col style={{ width: 'auto' }} />
          </colgroup>
          <tbody>
            <tr>
              <td>배너구분</td>
              <td>
                <MenuInputBox
                  menuType="select"
                  menuSize="150px"
                  options={BNR_PSTN_OPTIONS}
                  showAllOption={false}
                  value={form.bnrPstnSeCd}
                  onChange={(e) => handleChange('bnrPstnSeCd', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>제목</td>
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={form.bnrTtl}
                  onChange={(e) => handleChange('bnrTtl', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>이미지 파일(PC)</td>
              <td>
                <div className="onflexcolumn">
                  <FileUpload
                    mode="edit"
                    maxFiles={1}
                    fileType="attachment"
                    files={pcFiles}
                    onFilesChange={setPcFiles}
                  />
                  <MenuInputBox
                    menuType="input"
                    menuName="대체문구"
                    menuSize="300px"
                    value={form.imgFileSbstPhrsCn}
                    onChange={(e) =>
                      handleChange('imgFileSbstPhrsCn', e.target.value)
                    }
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>이미지 파일(태블릿)</td>
              <td>
                <div className="onflexcolumn">
                  {/* 태블릿은 모바일과 동일 파일 필드 공유 */}
                  <FileUpload
                    mode="edit"
                    maxFiles={1}
                    fileType="attachment"
                    files={moblFiles}
                    onFilesChange={setMoblFiles}
                  />
                  <MenuInputBox
                    menuType="input"
                    menuName="대체문구"
                    menuSize="300px"
                    value={form.moblImgSbstPhrsCn}
                    onChange={(e) =>
                      handleChange('moblImgSbstPhrsCn', e.target.value)
                    }
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>이미지 파일(모바일)</td>
              <td>
                <div className="onflexcolumn">
                  <FileUpload
                    mode="edit"
                    maxFiles={1}
                    fileType="attachment"
                    files={moblFiles}
                    onFilesChange={setMoblFiles}
                  />
                  <MenuInputBox
                    menuType="input"
                    menuName="대체문구"
                    menuSize="300px"
                    value={form.moblImgSbstPhrsCn}
                    onChange={(e) =>
                      handleChange('moblImgSbstPhrsCn', e.target.value)
                    }
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>링크</td>
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="300px"
                  value={form.imgLnkgUrlAddr}
                  onChange={(e) =>
                    handleChange('imgLnkgUrlAddr', e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td>링크타겟</td>
              <td>
                <div className="onflexrow">
                  <RadioButton
                    groupId="tgt_curr"
                    radioGroup="imgLnkgNpagYn"
                    radioValue="N"
                    radioName="현재창"
                    selectedValue={form.imgLnkgNpagYn}
                    onChange={(v) => handleChange('imgLnkgNpagYn', v)}
                  />
                  <RadioButton
                    groupId="tgt_new"
                    radioGroup="imgLnkgNpagYn"
                    radioValue="Y"
                    radioName="새창"
                    selectedValue={form.imgLnkgNpagYn}
                    onChange={(v) => handleChange('imgLnkgNpagYn', v)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>게시기간</td>
              <td>
                <div className="onparagraph">
                  <div className="ondatepickerbox">
                    <DatepickerBox
                      outputFormat="ymd"
                      value={form.pstgBgngYmd}
                      onChange={(val) => handleChange('pstgBgngYmd', val)}
                    />
                    <span className="onunit">~</span>
                    <DatepickerBox
                      outputFormat="ymd"
                      value={form.pstgEndYmd}
                      onChange={(val) => handleChange('pstgEndYmd', val)}
                      disabled={isPermanent}
                    />
                    <CheckBox
                      chkId="permanent"
                      chkName="상시사용"
                      checked={isPermanent}
                      onChange={({ checked }) => handlePermanentChange(checked)}
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>사용여부</td>
              <td>
                <div className="onflexrow">
                  <RadioButton
                    groupId="use_y"
                    radioGroup="useYn"
                    radioValue="Y"
                    radioName="사용"
                    selectedValue={form.useYn}
                    onChange={(v) => handleChange('useYn', v)}
                  />
                  <RadioButton
                    groupId="use_n"
                    radioGroup="useYn"
                    radioValue="N"
                    radioName="사용안함"
                    selectedValue={form.useYn}
                    onChange={(v) => handleChange('useYn', v)}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="onflexbtns" style={{ justifyContent: 'flex-end' }}>
        <Button btnType="add" btnNames="저장" onClick={handleSubmit} />
        {isEdit && <Button btnType="del" btnNames="삭제" onClick={onDelete} />}
      </div>
    </div>
  );
}

BannerForm.propTypes = {
  data: PropTypes.object,
  isEdit: PropTypes.bool,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
};
