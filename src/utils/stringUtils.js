import { format, parseISO } from 'date-fns';
/**
 * 문자열 처리 유틸리티 함수 모음
 */

/**
 * 기관명 축약 (첫 단어 + 마지막 단어)
 * @example "중소벤처기업부 중소기업정책실 지역기업정책관 지역혁신정책과" → "중소벤처기업부 지역혁신정책과"
 */
export const shortenInstName = (fullName) => {
  if (!fullName || !fullName.includes(' ')) {
    return fullName;
  }
  const parts = fullName.split(' ');
  return `${parts[0]} ${parts[parts.length - 1]}`;
};

/**
 * ISO 날짜 문자열을 원하는 형식으로 변환
 *
 * @param {string} isoString - ISO 형식 날짜 (예: '2025-04-23T15:56:45')
 * @param {string} formatString - date-fns 포맷 문자열
 * @returns {string} 포맷팅된 날짜 문자열
 *
 * @example
 * formatDate('2025-04-23T15:56:45', 'yyyy-MM-dd HH:mm:ss') // "2025-04-23 15:56:45"
 * formatDate('2025-04-23T15:56:45', 'yyyy년 MM월 dd일') // "2025년 04월 23일"
 *
 * @see date-fns 포맷 토큰
 *
 * 년도:
 *   yyyy - 4자리 년도 (2025)
 *   yy   - 2자리 년도 (25)
 *
 * 월:
 *   MM   - 2자리 월 (01-12)
 *   M    - 1-2자리 월 (1-12)
 *
 * 일:
 *   dd   - 2자리 일 (01-31)
 *   d    - 1-2자리 일 (1-31)
 *
 * 요일:
 *   EEEE - 긴 요일명 (월요일, 화요일, ...)
 *   EEE  - 짧은 요일명 (월, 화, ...)
 *
 * 시간:
 *   HH   - 2자리 시간, 24시간제 (00-23)
 *   H    - 1-2자리 시간, 24시간제 (0-23)
 *   hh   - 2자리 시간, 12시간제 (01-12)
 *   h    - 1-2자리 시간, 12시간제 (1-12)
 *   a    - AM/PM
 *
 * 분:
 *   mm   - 2자리 분 (00-59)
 *   m    - 1-2자리 분 (0-59)
 *
 * 초:
 *   ss   - 2자리 초 (00-59)
 *   s    - 1-2자리 초 (0-59)
 *
 * 밀리초:
 *   SSS  - 3자리 밀리초 (000-999)
 *
 * 타임스탬프:
 *   T    - 밀리초 타임스탬프 (1714712345000)
 *   t    - 초 타임스탬프 (1714712345)
 *
 * 자주 사용하는 패턴:
 *   'yyyy-MM-dd'              → "2025-04-23"
 *   'yyyy-MM-dd HH:mm'        → "2025-04-23 15:56"
 *   'yyyy-MM-dd HH:mm:ss'     → "2025-04-23 15:56:45"
 *   'yyyy년 MM월 dd일'         → "2025년 04월 23일"
 *   'yy.MM.dd HH:mm'          → "25.04.23 15:56"
 *   'MM/dd/yyyy'              → "04/23/2025"
 *   'yyyy-MM-dd (EEEE)'       → "2025-04-23 (수요일)" (locale: ko 필요)
 *   'a h:mm'                  → "오후 3:56" (locale: ko 필요)
 */
export const formatDate = (isoString, formatString = 'yyyy-MM-dd HH:mm') => {
  if (!isoString) return '-';

  try {
    const date = parseISO(isoString);

    if (isNaN(date.getTime())) return '-';

    return format(date, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
};
