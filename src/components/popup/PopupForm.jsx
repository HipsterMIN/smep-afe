import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import FileUpload from '@components/ui/FileUpload.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import RadioButton from '@components/ui/RadioButton.jsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const INITIAL_FORM = {
  popupKndCd: 'NWND',
  popupTtl: '',
  upendPstnNvl: 0,
  lfsdPstnNvl: 0,
  popupShpSeCd: 'SQRE',
  wdthLen: 0,
  vrtcLen: 0,
  imgAtchFileId: '',
  imgSbstTxtCn: '',
  imgLnkgUrlAddr: '',
  imgLnkgNpagYn: 'N',
  pstgBgngYmd: '',
  pstgEndYmd: '',
  vwngStopUseYn: 'Y',
  useYn: 'Y',
};

export default function PopupForm({ data, isEdit, onSave, onDelete }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (data && isEdit) {
      setForm({
        popupKndCd: data.popupKndCd || 'NWND',
        popupTtl: data.popupTtl || '',
        upendPstnNvl: data.upendPstnNvl ?? 0,
        lfsdPstnNvl: data.lfsdPstnNvl ?? 0,
        popupShpSeCd: data.popupShpSeCd || 'SQRE',
        wdthLen: data.wdthLen ?? 0,
        vrtcLen: data.vrtcLen ?? 0,
        imgAtchFileId: data.imgAtchFileId || '',
        imgSbstTxtCn: data.imgSbstTxtCn || '',
        imgLnkgUrlAddr: data.imgLnkgUrlAddr || '',
        imgLnkgNpagYn: data.imgLnkgNpagYn || 'N',
        pstgBgngYmd: data.pstgBgngYmd || '',
        pstgEndYmd: data.pstgEndYmd || '',
        vwngStopUseYn: data.vwngStopUseYn || 'Y',
        useYn: data.useYn || 'Y',
      });
      setFiles(
        (data.imgAtchFiles || []).map((f) => ({
          id: f.atchFileId + '_' + f.atchFileSn,
          atchFileId: f.atchFileId,
          atchFileSn: f.atchFileSn,
          fileName: f.orgnlFileNm,
          fileSize: f.fileSz,
          status: 'existing',
        }))
      );
    } else {
      setForm(INITIAL_FORM);
      setFiles([]);
    }
  }, [data, isEdit]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.popupTtl.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!form.pstgBgngYmd || !form.pstgEndYmd) {
      alert('게시기간을 입력해주세요.');
      return;
    }

    const newFile = files.find((f) => f.status === 'new')?.file || null;
    const deletedSns = files
      .filter((f) => f.status === 'deleted' && f.atchFileSn !== undefined)
      .map((f) => f.atchFileSn);

    const fileStatusInfoJson =
      deletedSns.length > 0
        ? JSON.stringify({ deletedImgAtchFileSns: deletedSns })
        : null;

    const submitData = {
      ...form,
      upendPstnNvl: Number(form.upendPstnNvl),
      lfsdPstnNvl: Number(form.lfsdPstnNvl),
      wdthLen: Number(form.wdthLen),
      vrtcLen: Number(form.vrtcLen),
    };

    onSave(submitData, newFile, fileStatusInfoJson);
  };

  return (
    <div className="oncontent ontable-form">
      <h4>{isEdit ? '팝업 수정' : '팝업 등록'}</h4>
      <div className="ontableBox">
        <table>
          <colgroup>
            <col style={{ width: '150px' }} />
            <col style={{ width: 'auto' }} />
          </colgroup>
          <tbody>
            <tr>
              <td>팝업종류</td>
              <td>
                <div className="onradioBox">
                  <RadioButton
                    groupId="knd_nwnd"
                    radioGroup="popupKndCd"
                    radioValue="NWND"
                    radioName="새창"
                    selectedValue={form.popupKndCd}
                    onChange={(v) => handleChange('popupKndCd', v)}
                  />
                  <RadioButton
                    groupId="knd_layr"
                    radioGroup="popupKndCd"
                    radioValue="LAYR"
                    radioName="레이어"
                    selectedValue={form.popupKndCd}
                    onChange={(v) => handleChange('popupKndCd', v)}
                  />
                  <RadioButton
                    groupId="knd_bndb"
                    radioGroup="popupKndCd"
                    radioValue="BNDB"
                    radioName="띠배너"
                    selectedValue={form.popupKndCd}
                    onChange={(v) => handleChange('popupKndCd', v)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>제목</td>
              <td>
                <MenuInputBox
                  menuType="input"
                  menuSize="100%"
                  value={form.popupTtl}
                  onChange={(e) => handleChange('popupTtl', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>팝업창 위치</td>
              <td>
                <div className="onflexrow">
                  <MenuInputBox
                    menuType="input"
                    menuName="TOP"
                    menuSize="120px"
                    value={String(form.upendPstnNvl)}
                    onChange={(e) =>
                      handleChange('upendPstnNvl', e.target.value)
                    }
                  />
                  <MenuInputBox
                    menuType="input"
                    menuName="LEFT"
                    menuSize="120px"
                    value={String(form.lfsdPstnNvl)}
                    onChange={(e) =>
                      handleChange('lfsdPstnNvl', e.target.value)
                    }
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>팝업창 사이즈</td>
              <td>
                <div className="onflexrow">
                  <MenuInputBox
                    menuType="input"
                    menuName="가로"
                    menuSize="120px"
                    value={String(form.wdthLen)}
                    onChange={(e) => handleChange('wdthLen', e.target.value)}
                  />
                  <MenuInputBox
                    menuType="input"
                    menuName="세로"
                    menuSize="120px"
                    value={String(form.vrtcLen)}
                    onChange={(e) => handleChange('vrtcLen', e.target.value)}
                  />
                  <RadioButton
                    groupId="shp_sqre"
                    radioGroup="popupShpSeCd"
                    radioValue="SQRE"
                    radioName="정사각형"
                    selectedValue={form.popupShpSeCd}
                    onChange={(v) => handleChange('popupShpSeCd', v)}
                  />
                  <RadioButton
                    groupId="shp_rect"
                    radioGroup="popupShpSeCd"
                    radioValue="RECT"
                    radioName="직사각형"
                    selectedValue={form.popupShpSeCd}
                    onChange={(v) => handleChange('popupShpSeCd', v)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>이미지 파일</td>
              <td>
                <div className="onflexcolumn">
                  <FileUpload
                    mode="edit"
                    maxFiles={1}
                    fileType="attachment"
                    files={files}
                    onFilesChange={setFiles}
                  />
                  <MenuInputBox
                    menuType="input"
                    menuName="대체문구"
                    menuSize="300px"
                    value={form.imgSbstTxtCn}
                    onChange={(e) =>
                      handleChange('imgSbstTxtCn', e.target.value)
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
                  menuSize="100%"
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
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>그만보기 여부</td>
              <td>
                <div className="onflexrow">
                  <RadioButton
                    groupId="vwng_y"
                    radioGroup="vwngStopUseYn"
                    radioValue="Y"
                    radioName="사용"
                    selectedValue={form.vwngStopUseYn}
                    onChange={(v) => handleChange('vwngStopUseYn', v)}
                  />
                  <RadioButton
                    groupId="vwng_n"
                    radioGroup="vwngStopUseYn"
                    radioValue="N"
                    radioName="사용안함"
                    selectedValue={form.vwngStopUseYn}
                    onChange={(v) => handleChange('vwngStopUseYn', v)}
                  />
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

PopupForm.propTypes = {
  data: PropTypes.object,
  isEdit: PropTypes.bool,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
};
