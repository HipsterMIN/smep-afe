import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import clockIcon from '../../assets/images/common/ico_datepicker_clock.svg';

// 관리자 화면 - 커스텀 데이트피커 컴포넌트 (시간 선택)
export default function DatepickerTimeBox({
  menuName,
  dateFormat = 'HH:mm',
  placeholder = '00:00',
  value,
  onChange,
}) {
  const [selectedDate, setSelectedDate] = useState(value || null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (onChange) {
      onChange(date);
    }
  };

  return (
    <div className="onmenubox">
      {menuName ? <span className="onmenunames">{menuName}</span> : null}
      <div className="ondatepicker-wrapper time">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat={dateFormat}
          showTimeSelect
          showTimeSelectOnly
          timeFormat="HH:mm"
          timeIntervals={15}
          placeholderText={placeholder}
          className="ondatepicker"
          locale={ko}
        />
        <img src={clockIcon} alt="clock" className="ondatepicker-icon" />
      </div>
    </div>
  );
}
