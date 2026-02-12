import 'react-datepicker/dist/react-datepicker.css';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

import calendarIcon from '../../assets/images/common/ico_datepicker_calendar.svg';

/**
 * 커스텀 데이트피커 컴포넌트
 *
 * @param {string} menuName - 메뉴 레이블
 * @param {string} dateFormat - DatePicker 표시 형식 (예: 'yyyy-MM-dd', 'yyyy-MM')
 * @param {boolean} showMonthYearPicker - 월/년도 선택 모드 활성화 여부
 * @param {string} placeholder - 플레이스홀더 텍스트
 * @param {Date|string|null} value - 선택된 날짜 (제어 컴포넌트)
 * @param {Function} onChange - 날짜 변경 콜백 함수
 * @param {string} valueFormat - 반환 값 포맷 (지정 시 문자열 반환, 미지정 시 Date 객체 반환)
 *                                date-fns 포맷 사용 (예: 'yyyy-MM-dd', 'yyyy-MM-dd HH:mm:ss')
 */
export default function DatepickerBox({
  menuName,
  dateFormat = 'yyyy-MM-dd',
  showMonthYearPicker = false,
  placeholder = 'yyyy-mm-dd',
  value,
  onChange,
  valueFormat,
}) {
  const [selectedDate, setSelectedDate] = useState(value || null);

  // value prop 변경 시 내부 state 동기화 (제어 컴포넌트 패턴)
  useEffect(() => {
    setSelectedDate(value || null);
  }, [value]);

  const handleDateChange = (date) => {
    setSelectedDate(date);

    if (onChange) {
      // valueFormat이 지정되면 문자열로 변환, 없으면 Date 객체 반환
      if (valueFormat && date) {
        try {
          const formattedValue = format(date, valueFormat);
          onChange(formattedValue);
        } catch (error) {
          console.error('Date formatting error:', error);
          onChange(date); // 포맷 실패 시 Date 객체 반환
        }
      } else {
        onChange(date);
      }
    }
  };

  return (
    <div className="onmenubox">
      {menuName ? <span className="onmenunames">{menuName}</span> : null}
      <div className="ondatepicker-wrapper">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat={dateFormat}
          showMonthYearPicker={showMonthYearPicker}
          placeholderText={placeholder}
          className="ondatepicker"
          locale={ko}
          dateFormatCalendar="yyyy년 MM월"
        />
        <img src={calendarIcon} alt="calendar" className="ondatepicker-icon" />
      </div>
    </div>
  );
}
