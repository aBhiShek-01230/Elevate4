import React from 'react'
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calender.css';

const CustomCalendar = () => {
  const [value, onChange] = useState(new Date());

  return (
    <div className='cal'>
      <Calendar onChange={onChange} value={value} />
    </div>
  );
}

export default CustomCalendar