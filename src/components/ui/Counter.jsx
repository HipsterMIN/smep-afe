import React, { useState } from 'react';

/**
 * 퍼블리싱 테스트용 카운터 컴포넌트
 * UI 검수를 위해 스타일이 적용된 버전입니다.
 */
export default function Counter() {
    const [count, setCount] = useState(0);

    const containerStyle = {
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        maxWidth: '400px',
        margin: '20px auto',
        textAlign: 'center',
        border: '1px solid #eee'
    };

    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        margin: '0 5px',
        transition: 'background-color 0.2s'
    };

    const countStyle = {
        fontSize: '48px',
        fontWeight: 'bold',
        margin: '20px 0',
        color: '#333'
    };

    return (
        <div className="pub-counter-wrapper">
            <div style={{ marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
                <h2 style={{ color: '#444' }}>Counter 컴포넌트 퍼블리싱 검수</h2>
                <p style={{ color: '#888', fontSize: '14px' }}>인터랙션 및 기본 스타일 확인용 페이지입니다.</p>
            </div>

            <div style={containerStyle}>
                <h3 style={{ fontSize: '18px', color: '#666' }}>현재 카운트</h3>
                <div style={countStyle}>{count}</div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button
                        style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
                        onClick={() => setCount(count - 1)}
                    >
                        - 감소
                    </button>
                    <button
                        style={{ ...buttonStyle, backgroundColor: '#dc3545' }}
                        onClick={() => setCount(0)}
                    >
                        초기화
                    </button>
                    <button
                        style={buttonStyle}
                        onClick={() => setCount(count + 1)}
                    >
                        + 증가
                    </button>
                </div>
            </div>

            <div style={{ marginTop: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', fontSize: '13px', color: '#666' }}>
                <strong>💡 퍼블리셔 참고사항:</strong>
                <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                    <li>이 컴포넌트는 인라인 스타일로 작성되었습니다.</li>
                    <li>실제 적용 시에는 프로젝트의 공통 CSS 클래스를 활용해 주세요.</li>
                </ul>
            </div>
        </div>
    );
}