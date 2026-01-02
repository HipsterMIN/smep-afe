import React, { useState } from 'react';

/**
 * 퍼블리싱 검수용 파일 업로드 컴포넌트
 */
export default function FileUpload() {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    return (
        <div className="pub-fileupload-wrapper">
            <div style={{ marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
                <h2 style={{ color: '#444' }}>FileUpload 컴포넌트 퍼블리싱 검수</h2>
                <p style={{ color: '#888', fontSize: '14px' }}>첨부파일 업로드 및 목록 표시 스타일을 확인합니다.</p>
            </div>

            <div style={{
                padding: '30px',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                textAlign: 'center',
                backgroundColor: '#fafafa'
            }}>
                <input
                    type="file"
                    id="file-input"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <label
                    htmlFor="file-input"
                    style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    파일 선택하기
                </label>
                <p style={{ marginTop: '10px', color: '#666' }}>또는 파일을 여기로 드래그하세요.</p>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>선택된 파일 목록 ({selectedFiles.length})</h3>
                {selectedFiles.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {selectedFiles.map((file, index) => (
                            <li key={index} style={{
                                padding: '10px 15px',
                                background: '#fff',
                                border: '1px solid #ddd',
                                marginBottom: '5px',
                                borderRadius: '4px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span>{file.name}</span>
                                <span style={{ fontSize: '12px', color: '#999' }}>
                  {(file.size / 1024).toFixed(1)} KB
                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: '#999', fontStyle: 'italic' }}>선택된 파일이 없습니다.</p>
                )}
            </div>
        </div>
    );
}