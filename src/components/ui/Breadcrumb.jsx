import UserMenuContext from '@context/UserMenuContext';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { useMatches } from 'react-router-dom';

export default function Breadcrumb({
  pageTitle,
  currentLabel,
  className = 'onbreadcrumb',
  items,
}) {
  const userMenu = useContext(UserMenuContext);
  const matches = useMatches();
  const contextLabels = userMenu?.breadcrumbItems?.map((item) => item.label) || [];
  const breadcrumbLabels = Array.isArray(items) ? [...items] : [...contextLabels];
  const routeMenuName =
    [...matches]
      .reverse()
      .map((match) => match?.handle?.menuNm)
      .find((menuNm) => typeof menuNm === 'string' && menuNm.trim()) || '';
  const trimmedCurrentLabel =
    pageTitle?.trim() || currentLabel?.trim() || routeMenuName;

  if (
    trimmedCurrentLabel &&
    breadcrumbLabels[breadcrumbLabels.length - 1] !== trimmedCurrentLabel
  ) {
    breadcrumbLabels.push(trimmedCurrentLabel);
  }

  if (breadcrumbLabels.length === 0) {
    return null;
  }

  return (
    <ul className={className}>
      {breadcrumbLabels.map((label, index) => (
        <li
          key={`${label}-${index}`}
          className={index === breadcrumbLabels.length - 1 ? 'on' : undefined}
        >
          {label}
        </li>
      ))}
    </ul>
  );
}

Breadcrumb.propTypes = {
  pageTitle: PropTypes.string,
  currentLabel: PropTypes.string,
  className: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.string),
};
