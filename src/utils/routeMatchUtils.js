const normalizePath = (path = '') => {
  const value = String(path).trim();
  if (!value) return '';

  const normalized = value.replace(/\/{2,}/g, '/');
  if (normalized !== '/' && normalized.endsWith('/')) {
    return normalized.slice(0, -1);
  }
  return normalized;
};

const buildChildPath = (basePath, childPath) => {
  const normalizedBase = normalizePath(basePath);
  const normalizedChild = String(childPath || '').replace(/^\/+/, '');
  return normalizePath(`${normalizedBase}/${normalizedChild}`);
};

/**
 * 동적 라우트 패턴 매칭
 * 예) /sys/:id 와 /sys/123 은 매칭됨
 */
export const matchDynamicRoutePattern = (pattern, pathname) => {
  const normalizedPattern = normalizePath(pattern);
  const normalizedPathname = normalizePath(pathname);

  const patternParts = normalizedPattern.split('/').filter(Boolean);
  const pathParts = normalizedPathname.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) return false;

  return patternParts.every((part, index) => {
    if (part.startsWith(':')) return true;
    return part === pathParts[index];
  });
};

/**
 * componentMap children를 재귀 순회하며 pathname과 일치하는 동적 경로가 있는지 검사
 */
export const hasMatchingDynamicChildPath = (
  basePath,
  children,
  pathname
) => {
  if (!Array.isArray(children) || children.length === 0) return false;

  for (const child of children) {
    if (!child || typeof child !== 'object') continue;

    const hasPath = typeof child.path === 'string' && child.path.length > 0;
    const currentPath = hasPath ? buildChildPath(basePath, child.path) : basePath;

    if (hasPath && matchDynamicRoutePattern(currentPath, pathname)) {
      return true;
    }

    if (
      Array.isArray(child.children) &&
      hasMatchingDynamicChildPath(currentPath, child.children, pathname)
    ) {
      return true;
    }
  }

  return false;
};

