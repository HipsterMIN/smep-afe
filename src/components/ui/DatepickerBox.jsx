import 'react-datepicker/dist/react-datepicker.css';

import { ko } from 'date-fns/locale';
import {useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';

import calendarIcon from '../../assets/images/common/ico_datepicker_calendar.svg';

/* =========================
   날짜 파싱 (입력 → Date)
========================= */
function parseDateValue(value) {
  if (!value) return null;

  if (value instanceof Date) return value;

  const str = String(value);

  // yyyymmdd
  if (/^\d{8}$/.test(str)) {
    return new Date(
        str.slice(0, 4),
        Number(str.slice(4, 6)) - 1,
        str.slice(6, 8)
    );
  }

  // yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return new Date(str);
  }

  return null;
}

/* =========================
   Date → 포맷 변환
========================= */
function formatDate(date, type) {
  if (!date) return '';

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  if (type === 'ymd') return `${y}${m}${d}`;
  if (type === 'dash') return `${y}-${m}-${d}`;

  return date; // 기본 Date 객체
}

// 관리자 화면 - 커스텀 데이트피커 컴포넌트 (날짜만)
export default function DatepickerBox({
  menuName,
  dateFormat = 'yyyy-MM-dd', // 'yyyy-MM-dd', 'yyyy-MM'
  showMonthYearPicker = false,
  placeholder = 'yyyy-mm-dd',
  value,
  onChange,
  outputFormat = 'date', // 'date' | 'ymd' | 'dash'
}) {
  const [selectedDate, setSelectedDate] = useState(parseDateValue(value) || null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (onChange) {
      onChange(formatDate(date, outputFormat));
    }
  };

  // 부모 value 변경 대응
  useEffect(() => {
    setSelectedDate(parseDateValue(value));
  }, [value]);

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
