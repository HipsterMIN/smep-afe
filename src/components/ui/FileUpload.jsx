import React, { useRef } from 'react';

import Button from './Button';

export default function FileUpload({
  mode = 'view',
  maxFiles = 5,
  fileType = 'attachment', // 'notice' | 'attachment'
  files = [],
  onFilesChange = () => {}
}) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const currentCount = files.filter((f) => f.status !== 'deleted').length;
    const availableSlots = maxFiles - currentCount;

    if (selectedFiles.length > availableSlots) {
      alert(`최대 ${maxFiles}개까지 업로드 가능합니다. (현재: ${currentCount}개)`);
      return;
    }

    const newFiles = selectedFiles.map((file) => ({
      id: `new_${Date.now()}_${Math.random()}`,
      file: file,
      fileName: file.name,
      fileSize: file.size,
      status: 'new', // 'new' | 'existing'
    }));

    onFilesChange([...files, ...newFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = (fileId) => {
    const updatedFiles = files.map((f) => {
      if (f.id === fileId) {
        return { ...f, status: 'deleted' };
      }
      return f;
    });

    onFilesChange(updatedFiles);
  };

  const handleDownload = (e, file) => {
    e.preventDefault();
    if (file.status === 'new') {
      // 신규 파일은 다운로드 불가
      alert('저장된 파일만 다운로드 가능합니다.');
      return;
    }
    // 기존 파일 다운로드 로직
    console.log('다운로드:', file);
  };

  const getFileSizeDisplay = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const visibleFiles = files.filter((f) => f.status !== 'deleted');
  const canAddMore = visibleFiles.length < maxFiles;

  return (
    <div className="onfileuploadcontainer">
      {mode === 'edit' && (
        <div className="onfileupload-input">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            disabled={!canAddMore}
          />
          <Button
            btnType="addfile"
            btnNames="파일 선택"
            onClick={() => fileInputRef.current?.click()}
            disabled={!canAddMore}
          />
          <span className="onfilecount">
            ({visibleFiles.length}/{maxFiles})
          </span>
        </div>
      )}

      <div className="onfileupload-list">
        {visibleFiles.length === 0 ? (
          <p className="onnofiles">등록된 파일이 없습니다.</p>
        ) : (
          visibleFiles.map((file) => (
            <div key={file.id} className="ondownloadlinkbox">
              <a
                href="#"
                className="ondownloadlink"
                onClick={(e) => handleDownload(e, file)}
              >
                <i className="onicon clip"></i>
                {file.fileName}
                {file.status === 'new' ? ' (신규)' : ''}
                {` (${getFileSizeDisplay(file.fileSize)} `}
              </a>
              {mode === 'edit' && (
                <button
                  className="onfiledeletebtn"
                  onClick={() => handleDeleteFile(file.id)}
                  title="파일 삭제"
                >
                  <i className="onicon close"></i>
                  <span className="sr-only">파일삭제</span>
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}