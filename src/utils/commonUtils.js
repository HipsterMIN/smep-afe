/**
 * 공통기능 유틸리티 함수 모음
 * # 공통코드 목록 조회
 */
// @utils/commonCodeUtils.js 또는 @lib/commonCodeUtils.js
import http from '@lib/http.js';

/**
 * 공통코드 그룹 조회 함수
 * @param {string[]} groups - 조회할 공통코드 그룹 배열 (예: ['MBR_STTS_CD', 'MBR_TYPE_CD'])
 * @returns {Promise<Object>} - 그룹별 공통코드 데이터 객체
 * @throws {Error} - API 호출 실패 시 에러
 */
export const fetchCommonCodes = async (groups) => {
    try {
        const response = await http.get('/api/v1/commoncode/bulk', {
            params: { groups: groups.join(',') },
        });
        return response.data;
    } catch (error) {
        console.error('공통코드 조회 실패:', error);
        throw error;
    }
};

/**
 * 공통코드를 MenuInputBox options 형식으로 변환
 * @param {Array} codeList - 공통코드 배열
 * @returns {Array} - {value, label} 형식의 옵션 배열
 */
export const convertToMenuOptions = (codeList) => {
    if (!Array.isArray(codeList)) return [];

    return codeList.map((item) => ({
        value: item.comCd,
        label: item.comCdNm,
    }));
};

/**
 * 공통코드 조회 및 변환 (통합 함수)
 * @param {string[]} groups - 조회할 공통코드 그룹 배열
 * @returns {Promise<Object>} - 그룹별로 변환된 옵션 객체
 */
export const fetchAndConvertCommonCodes = async (groups) => {
    try {
        const response = await fetchCommonCodes(groups);
        const result = {};

        groups.forEach((group) => {
            result[group] = convertToMenuOptions(response[group] || []);
        });

        return result;
    } catch (error) {
        console.error('공통코드 조회 및 변환 실패:', error);
        throw error;
    }
};
