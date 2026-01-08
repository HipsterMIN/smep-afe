import axios from 'axios';
import React, { useState } from 'react';

import copyIcon from '../assets/images/common/ico_detail.svg';

const ApiTest = () => {
    // 상태 관리
    const [method, setMethod] = useState('GET');
    const [endpoint, setEndpoint] = useState('/actuator/health/readiness');
    const [requestBody, setRequestBody] = useState('{\n  "key": "value"\n}');
    const [token, setToken] = useState(localStorage.getItem('accessToken') || ''); // 로컬 스토리지 토큰 연동
    const [customResponse, setCustomResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 운영/개발 모두에서 안전하게 동작하도록 기본값을 BASE_URL 기반으로 산출
    // VITE_API_BASE_URL이 지정되지 않은 경우: `${BASE_URL}/main-dev`
    const baseUrl = import.meta.env.VITE_API_BASE_URL
        || `${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/main-dev`;

    // curl 명령줄 생성 로직
    const fullUrl = `${window.location.origin}${baseUrl}${endpoint}`;
    const curlCommand = `curl -X '${method}' \\\n  '${fullUrl}' \\\n  -H 'accept: application/json'${token ? ` \\\n  -H 'Authorization: Bearer ${token}'` : ''}${method !== 'GET' ? ` \\\n  -d '${requestBody.replace(/\n/g, '')}'` : ''}`;

    const handleCopyCurl = () => {
        navigator.clipboard.writeText(curlCommand);
        alert('CURL 명령어가 클립보드에 복사되었습니다.');
    };

    // API 호출 로직
    const handleCustomTest = async () => {
        setIsLoading(true);
        setCustomResponse(null);
        try {
            const config = {
                method,
                url: `${baseUrl}${endpoint}`,
                data: method !== 'GET' ? JSON.parse(requestBody) : undefined,
                headers: {
                    'Content-Type': 'application/json',
                    // 토큰이 입력되어 있을 경우에만 헤더에 포함
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
            };
            const response = await axios(config);
            setCustomResponse(response.data);
        } catch (error) {
            setCustomResponse(error.response?.data || { error: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="oncontentbox full">
            {/* 상단 타이틀 영역 */}
            <div className="oncontentTitle">
                <h2>API Connectivity Debugger</h2>
                <ul className="onbreadcrumb">
                    <li>시스템 관리</li>
                    <li>개발 도구</li>
                    <li className="on">API 테스트</li>
                </ul>
            </div>

            <div className="oncontents">
                {/* 표준 페이지 폭을 유지하기 위한 oncontentBox 사용 */}
                <div className="oncontentBox">

                    {/* 1. 엔드포인트 및 메서드 설정 영역 */}
                    <div className="onselect-form">
                        <div className="onparagraph">
                            <select
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                style={{
                                    height: '32px',
                                    padding: '0 10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '2px',
                                    backgroundColor: '#fff'
                                }}
                            >
                                {['GET', 'POST', 'PUT', 'DELETE'].map(m => <option key={m} value={m}>{m}</option>)}
                            </select>

                            <div style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #ccc',
                                padding: '0 10px',
                                backgroundColor: '#f9f9f9',
                                height: '30px',
                                overflow: 'hidden'
                            }}>
                                <span style={{ color: '#007bff', marginRight: '8px', fontSize: '10px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{baseUrl}</span>
                                <input
                                    type="text"
                                    value={endpoint}
                                    onChange={(e) => setEndpoint(e.target.value)}
                                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', backgroundColor: 'transparent' }}
                                    placeholder="/endpoint/path"
                                />
                            </div>

                            <button
                                onClick={handleCustomTest}
                                disabled={isLoading}
                                className="onbtn"
                                style={{
                                    minWidth: '100px',
                                    height: '32px',
                                    backgroundColor: '#333',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                {isLoading ? 'WAIT...' : 'CURL'}
                            </button>
                        </div>

                        {/* 2. 인증 토큰 설정 영역 */}
                        <div className="onparagraph" style={{ marginTop: '10px' }}>
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #ced4da',
                                padding: '0 10px',
                                backgroundColor: '#fff',
                                height: '30px'
                            }}>
                                <span style={{ color: '#ff4757', marginRight: '8px', fontSize: '11px', fontWeight: 'bold' }}>AUTH TOKEN</span>
                                <input
                                    type="text"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="Bearer 토큰 입력 (입력 시 헤더에 자동 포함)"
                                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: '12px' }}
                                />
                            </div>
                            <button
                                className="onbtn"
                                style={{ height: '30px', fontSize: '11px', marginLeft: '5px' }}
                                onClick={() => setToken(localStorage.getItem('accessToken') || '')}
                            >
                                로컬토큰 불러오기
                            </button>
                        </div>

                        {/* 3. POST/PUT 시 바디 입력 영역 */}
                        {method !== 'GET' && (
                            <div style={{ marginTop: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>Request Body (JSON)</label>
                                <textarea
                                    value={requestBody}
                                    onChange={(e) => setRequestBody(e.target.value)}
                                    rows="5"
                                    style={{
                                        width: '100%',
                                        border: '1px solid #ccc',
                                        padding: '10px',
                                        fontFamily: "'Cascadia Code', monospace",
                                        fontSize: '13px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* CURL 명령어 미리보기 및 복사 영역 */}
                    <div className="ontable-legend" style={{ marginTop: '25px' }}>
                        <span>Curl Command Preview</span>
                    </div>
                    <div style={{
                        position: 'relative',
                        background: '#2d2d2d',
                        color: '#fff',
                        padding: '15px 45px 15px 15px',
                        borderRadius: '4px',
                        marginTop: '10px',
                        fontSize: '13px',
                        fontFamily: "'Cascadia Code', monospace",
                        overflowX: 'auto'
                    }}>
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                {curlCommand}
                            </pre>
                        <button
                            onClick={handleCopyCurl}
                            title="Copy to clipboard"
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                padding: '5px',
                                cursor: 'pointer',
                                filter: 'invert(1)'
                            }}
                        >
                            <img src={copyIcon} alt="copy" style={{ width: '16px' }} />
                        </button>
                    </div>

                    {/* 4. 응답 결과 출력 영역 */}
                    <div className="ontable-legend" style={{ marginTop: '25px' }}>
                        <span>Response Body</span>
                    </div>

                    <div style={{
                        background: '#1e1e1e', // 터미널 느낌의 배경
                        color: '#00ff00',      // 초록색 텍스트
                        padding: '25px',
                        borderRadius: '4px',
                        border: '1px solid #333',
                        marginTop: '10px',
                        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
                    }}>
                        <pre style={{
                            margin: 0,
                            fontSize: '14px',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                            fontFamily: "'Cascadia Code', 'Courier New', monospace"
                        }}>
                            {customResponse ? JSON.stringify(customResponse, null, 2) : '// No response yet. Execute CURL to test connectivity.'}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiTest;