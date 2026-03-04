import {
  hasMatchingDynamicChildPath,
  matchDynamicRoutePattern,
} from './routeMatchUtils.js';

describe('routeMatchUtils', () => {
  describe('matchDynamicRoutePattern', () => {
    it('matches static path exactly', () => {
      expect(matchDynamicRoutePattern('/sys/menu', '/sys/menu')).toBe(true);
      expect(matchDynamicRoutePattern('/sys/menu', '/sys/menu/1')).toBe(false);
    });

    it('matches dynamic segments', () => {
      expect(matchDynamicRoutePattern('/sys/:id', '/sys/123')).toBe(true);
      expect(matchDynamicRoutePattern('/sys/:id/edit', '/sys/123/edit')).toBe(
        true
      );
      expect(matchDynamicRoutePattern('/sys/:id/edit', '/sys/123')).toBe(false);
    });

    it('normalizes duplicate and trailing slashes', () => {
      expect(matchDynamicRoutePattern('//sys/:id/', '/sys/999')).toBe(true);
      expect(matchDynamicRoutePattern('/sys/:id/', '/sys/999/')).toBe(true);
    });
  });

  describe('hasMatchingDynamicChildPath', () => {
    it('matches first-level child routes', () => {
      const children = [
        { path: 'create' },
        { path: ':id' },
        { path: ':id/edit' },
      ];

      expect(
        hasMatchingDynamicChildPath('/sys/sysStng/mngrMenu', children, '/sys/sysStng/mngrMenu/create')
      ).toBe(true);
      expect(
        hasMatchingDynamicChildPath('/sys/sysStng/mngrMenu', children, '/sys/sysStng/mngrMenu/10')
      ).toBe(true);
      expect(
        hasMatchingDynamicChildPath('/sys/sysStng/mngrMenu', children, '/sys/sysStng/mngrMenu/10/edit')
      ).toBe(true);
    });

    it('matches nested child routes recursively', () => {
      const children = [
        {
          path: ':bbsNo',
          children: [{ path: 'create' }, { path: ':pstNo' }],
        },
      ];

      expect(
        hasMatchingDynamicChildPath('/sys/sysStng/bbsInfo', children, '/sys/sysStng/bbsInfo/22/create')
      ).toBe(true);
      expect(
        hasMatchingDynamicChildPath('/sys/sysStng/bbsInfo', children, '/sys/sysStng/bbsInfo/22/333')
      ).toBe(true);
      expect(
        hasMatchingDynamicChildPath('/sys/sysStng/bbsInfo', children, '/sys/sysStng/bbsInfo/22')
      ).toBe(true);
    });

    it('returns false for non-matching paths', () => {
      const children = [
        {
          path: ':bbsNo',
          children: [{ path: 'create' }, { path: ':pstNo' }],
        },
      ];

      expect(
        hasMatchingDynamicChildPath('/sys/sysStng/bbsInfo', children, '/sys/sysStng/bbsInfo')
      ).toBe(false);
      expect(
        hasMatchingDynamicChildPath('/sys/sysStng/bbsInfo', children, '/sys/sysStng/bbsInfo/22/create/extra')
      ).toBe(false);
    });
  });
});

