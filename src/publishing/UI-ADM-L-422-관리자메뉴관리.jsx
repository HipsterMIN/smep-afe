import React from 'react';

import Button from '../components/ui/Button';
import GridTable from '../components/ui/GridTable';
import SearchBox from '../components/ui/SearchBox';
import MenuInputBox from "../components/ui/MenuInputBox.jsx";

export default function CommonCode() {
    return (
        <div className="oncontentbox full">
            <div className="oncontentTitle">
                <h2>관리자 메뉴 관리</h2>
                <ul className="onbreadcrumb">
                    <li>시스템 관리</li>
                    <li>시스템 설정</li>
                    <li className="on">관리자 메뉴 관리</li>
                </ul>
            </div>
            <div className="oncontents">
                <div className="oncontent">
                    <div className="onselect-form">
                        <div className="onparagraph">
                            <MenuInputBox
                                menuType="input"
                                menuName="메뉴ID"
                                placeholder="ID 입력"
                            />
                            <MenuInputBox
                                menuType="input"
                                menuSize="200px"
                                menuName="메뉴명"
                                placeholder="검색어를 입력하세요."
                            />
                            <MenuInputBox
                                menuType="input"
                                menuSize="200px"
                                menuName="상위메뉴"
                                placeholder="000000"
                            />
                            <MenuInputBox
                                menuType="input"
                                menuSize="300px"
                                menuName="URL"
                                placeholder="검색어를 입력하세요."
                            />
                            <MenuInputBox
                                menuType="select"
                                menuName="유형"
                                selectOption="Y"
                            />
                            <MenuInputBox
                                menuType="select"
                                menuName="사용여부"
                                selectOption="전체"
                            />
                            <div className="onbtn" style={{marginLeft: 'auto'}}>
                                <Button btnType="menuSearch" btnNames="검색"/>
                            </div>
                        </div>
                    </div>
                    <div className="ontable-legend">
                <span>
                  총 <b>468</b>개
                </span>
                        <div className="onbtns">
                            <button className="onallopen-ico"/>
                            <button className="onallclose-ico"/>
                        </div>
                    </div>

                    <div className="ongrid-tableform mask">
                        <GridTable/>
                    </div>
                </div>
            </div>
        </div>
    );
}