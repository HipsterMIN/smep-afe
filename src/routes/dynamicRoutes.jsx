import TabPageWrapper from '@components/TabPageWrapper.jsx';
import { Suspense } from 'react';
import { Navigate } from 'react-router-dom';

import { buildFullPath } from '../utils/menuUtils.js';
import { componentMap } from './componentMap.js';

/**
 * =============================================================================
 * Dynamic Routes Generator - 메뉴 데이터를 React Router 라우트로 변환
 * =============================================================================
 */

/**
 * M 타입 노드의 첫 번째 T 타입 자식 찾기 (redirect용)
 * DFS로 탐색하여 가장 먼저 만나는 T 타입 노드 반환
 * Side Navigation에서 사용되는 메뉴 노드 기준
 *
 * @param {Object} menuNode - 메뉴 노드
 * @returns {Object|null} 첫 번째 T 타입 노드 또는 null
 */
export const findFirstTComponentBySide = (menuNode) => {
  if (!menuNode.children || menuNode.children.length === 0) {
    return null;
  }

  // BFS로 자식들 탐색
  const queue = [...menuNode.children];
  while (queue.length > 0) {
    const node = queue.shift();
    // T 타입 발견 ( lfsdMenuExpsrYn 체크 )
    if (node.scrnTypeCd === 'T' && node.lfsdMenuExpsrYn === 'Y') {
      return node;
    }

    // M 타입이면 자식들을 큐에 추가
    if (node.children && node.children.length > 0) {
      queue.push(...node.children);
    }
  }
  return null;
};

/**
 * 단일 메뉴 노드를 라우트 객체로 변환
 *
 * @param {Object} menuNode - 메뉴 노드
 * @param {Object} flatMenuMap - menuId를 key로 하는 flat map
 * @returns {{route: Object, layout: Object|null}|null} 라우트 + 레이아웃 정보
 */
const createRouteFromNode = (menuNode, flatMenuMap) => {
  if (menuNode.depth === 0) {
    return null;
  }

  const fullPath = buildFullPath(menuNode, flatMenuMap);
  const routeConfig = {
    path: fullPath,
    handle: {
      menuId: menuNode.menuId,
      menuNm: menuNode.menuNm,
      scrnTypeCd: menuNode.scrnTypeCd,
    },
  };

  // T 타입: 실제 컴포넌트 매핑
  if (menuNode.scrnTypeCd === 'T') {
    const componentConfig = componentMap[menuNode.menuId];

    if (componentConfig) {
      const {
        component: Component,
        layout: Layout,
        children,
      } = componentConfig;

      const hasChildren = children && children.length > 0;

      // layout은 상위 그룹에서 주입하고, 여기서는 컨텐츠 라우트만 구성합니다.
      if (hasChildren) {
        routeConfig.children = [
          {
            index: true,
            element: renderRouteElement(Component),
          },
          ...mapComponentChildrenToRoutes(children || []),
        ];
      } else {
        routeConfig.element = renderRouteElement(Component);
      }

      return {
        route: routeConfig,
        layout: Layout || null,
      };
    } else {
      // 컴포넌트가 등록되지 않은 경우
      return {
        route: {
          ...routeConfig,
          element: (
            <div style={{ padding: '2rem' }}>
              <h3>준비중입니다.</h3>
              <p>
                컴포넌트가 아직 등록되지 않았습니다. (menuId: {menuNode.menuId})
              </p>
            </div>
          ),
        },
        layout: null,
      };
    }
  } else if (menuNode.scrnTypeCd === 'M') {
    // M 타입: 메뉴 그룹
    const firstTNode = findFirstTComponentBySide(menuNode);
    if (firstTNode) {
      const targetPath = buildFullPath(firstTNode, flatMenuMap);
      return {
        route: {
          ...routeConfig,
          element: <Navigate to={targetPath} replace />,
        },
        // 그룹 메뉴는 첫 번째 T 메뉴의 layout을 상속
        layout: componentMap[firstTNode.menuId]?.layout || null,
      };
    } else {
      return {
        route: {
          ...routeConfig,
          element: (
            <div style={{ padding: '2rem' }}>
              <h3>준비중입니다.</h3>
              <p>하위 메뉴를 선택해주세요.</p>
            </div>
          ),
        },
        layout: null,
      };
    }
  }

  return null;
};

const renderRouteElement = (Component) => (
  <Suspense fallback={<div>로딩중...</div>}>
    <Component />
  </Suspense>
);

const mapComponentChildrenToRoutes = (children = []) => {
  return children.map((child) => {
    const ChildComponent = child.component;

    if (child.children && child.children.length > 0) {
      return {
        path: child.path,
        children: [
          {
            index: true,
            element: renderRouteElement(ChildComponent),
          },
          ...mapComponentChildrenToRoutes(child.children),
        ],
      };
    }

    return {
      path: child.path,
      element: renderRouteElement(ChildComponent),
    };
  });
};

// 같은 layout을 사용하는 동적 라우트를 한 부모 라우트로 묶고,
// TabPageWrapper를 1회만 마운트하여 탭 전환 시 wrapper 언마운트를 방지합니다.
const groupRoutesByLayout = (routeEntries) => {
  const layoutBuckets = new Map();
  const nonLayoutRoutes = [];

  routeEntries.forEach(({ route, layout }) => {
    if (!layout) {
      nonLayoutRoutes.push(route);
      return;
    }

    if (!layoutBuckets.has(layout)) {
      layoutBuckets.set(layout, []);
    }
    layoutBuckets.get(layout).push(route);
  });

  const grouped = [...layoutBuckets.entries()].map(([Layout, routes]) => ({
    element: <Layout />,
    children: [
      {
        element: <TabPageWrapper />,
        children: routes,
      },
    ],
  }));

  return [...grouped, ...nonLayoutRoutes];
};

/**
 * 메뉴 트리 전체를 순회하며 동적 라우트 배열 생성
 *
 * @param {Object} menuTree - 메뉴 트리 루트
 * @param {Object} flatMenuMap - menuId를 key로 하는 flat map
 * @returns {Array} React Router 라우트 배열
 */
export const generateDynamicRoutes = (menuTree, flatMenuMap) => {
  if (!menuTree || !flatMenuMap) {
    return [];
  }

  const routeEntries = [];
  const processNode = (node) => {
    const routeEntry = createRouteFromNode(node, flatMenuMap);
    if (routeEntry) {
      routeEntries.push(routeEntry);
    }

    // 자식 노드들도 재귀적으로 처리
    if (node.children && node.children.length > 0) {
      node.children.forEach(processNode);
    }
  };

  processNode(menuTree);
  return groupRoutesByLayout(routeEntries);
};
