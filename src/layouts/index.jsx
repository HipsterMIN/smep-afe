// layouts/index.jsx
import AuthBar from '@components/AuthBar.jsx';
import { UserMenuProvider } from '@context/UserMenuContext.jsx';

import AdminLayout from './AdminLayout.jsx';

/**
 * =============================================================================
 * Layout 조합 컴포넌트들
 * =============================================================================
 *
 * 다양한 Layout 조합을 미리 정의하여 Route에서 재사용
 */

// ============================================
// 1. AdminLayout + AuthBar 조합
// ============================================
export function AdminLayoutWithAuth() {
  return (
    <UserMenuProvider>
      <AuthBar />
      <AdminLayout />
    </UserMenuProvider>
  );
}

// ============================================
// 2. AdminLayout 단독 (AuthBar 없음)
// ============================================
export function AdminLayoutOnly() {
  return (
    <UserMenuProvider>
      <AdminLayout />
    </UserMenuProvider>
  );
}
