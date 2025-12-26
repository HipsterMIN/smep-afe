import React from 'react';
import { RouterProvider } from 'react-router-dom';

import Counter from './components/Counter.jsx';
import FileUpload from './components/FileUpload';
import RichEditor from './components/RichEditor.jsx';
import Button from './components/ui/Button'; // 공통 버튼 컴포넌트 추가
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout'; // 레이아웃 추가
import router from './routes/index.jsx';
import SvarGridExample from './SvarGridExample.jsx';

// 공통 콜백 함수
const handleUploadComplete = (results) => {
  console.log('Upload results:', results);
  const successfulUploads = results.filter((r) => r.success).length;
  const failedUploads = results.filter((r) => !r.success).length;
  if (successfulUploads > 0) alert(`${successfulUploads}개 파일 업로드 성공!`);
  if (failedUploads > 0) alert(`${failedUploads}개 파일 업로드 실패.`);
};

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
