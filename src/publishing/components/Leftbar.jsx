import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import {autoPublishingRoutes} from "../../routes/autoRoutes.jsx";

export default function Leftbar({isOnNavToggle, setOnNavToggle}) {
  return (
    <aside className={`onleftbar ${isOnNavToggle ? 'close' : ''}`} >
      <div className="onlinksystem">퍼블리싱 메뉴 push 테스트</div>
      <nav>
        <ul className="onleftbar-navlink navdepth1">
          <li className="navdepth1-list">
            <button>
              <span>메뉴 LV2</span>
            </button>
            <ul className="navdepth2">
                <li key="dept2" className="navdepth2-list">
                  <a href="#">메뉴 LV3</a>
                </li>
            </ul>
          </li>
          <li className="navdepth1-list on">
            <button>
              <span>퍼블리싱 파일 목록</span>
            </button>
            <ul className="navdepth2">
              {autoPublishingRoutes.map(route => (
                  <li key={route.path} className="navdepth2-list">
                    <NavLink to={`/publishing/${route.path}`}>
                    {route.path}
                    </NavLink>
                  </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
