import React from 'react';

import Button from '../components/ui/Button';
import GridTable from '../components/ui/GridTable';
import SearchBox from '../components/ui/SearchBox';

export default function CommonCode() {
    return (
        <div className="oncontentbox">
            <div className="oncontentTitle">
                <h2>공통코드 관리</h2>
                <ul className="onbreadcrumb">
                    <li>시스템 관리</li>
                    <li>시스템 설정</li>
                    <li className="on">공통코드 관리</li>
                </ul>
            </div>

            <div className="oncontents space">
                <div className="oncontentBox">
                    <div className="ongrid-form">
                        <h4>그룹코드 구분</h4>
                        <div className="ongrid-btnbox">
                            <SearchBox inputId="searchFormGroup" placeholder="검색어를 입력하세요." />
                            <Button btnType="search" btnNames="검색" />
                            <Button btnType="add" btnNames="추가" />
                        </div>
                    </div>
                    <div className="ongrid-tableform mask">
                        <GridTable />
                    </div>
                </div>

                <div className="oncontentBox">
                    <div className="ongrid-form">
                        <h4>하위코드 구분</h4>
                        <div className="ongrid-btnbox">
                            <SearchBox inputId="searchFormChild" placeholder="검색어를 입력하세요." />
                            <Button btnType="search" btnNames="검색" />
                            <Button btnType="add" btnNames="추가" />
                        </div>
                    </div>
                    <div className="ongrid-tableform">
                        <GridTable />
                    </div>
                </div>
            </div>
        </div>
    );
}