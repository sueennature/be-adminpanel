'use client'
// pages/calendar.js
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';

const CalendarWrapper = styled.div`
  .react-calendar {
    width: 100%;
    max-width: 1100px;
    margin: auto;
    border: 1px solid #a0a096;
    border-radius: 10px;
    padding: 10px;
  }

  .react-calendar__tile--now {
    background: #fffae6 !important;
    color: #d64545;
  }

  .react-calendar__tile--active {
    background: #d64545 !important;
    color: white !important;
  }

  .booked {
    background-color: #ff5252;
    color: white;
  }

  .tile-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .tile-content span {
    font-size: 10px;
  }
`;

// Helper function to generate dates within a range
const generateDateRange = (start: string | number | Date, end: number | Date) => {
  const dates = [];
  let currentDate = new Date(start);
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const johnDoeBooking = generateDateRange(new Date(2024, 6, 9), new Date(2024, 7, 9));
  const bookedDates = [
    ...johnDoeBooking.map(d => ({ date: d, refNo: '12345', name: 'John Doe' })),
    { date: new Date(2024, 6, 11), refNo: '12346', name: 'Jane Smith' },
    { date: new Date(2024, 6, 15), refNo: '12347', name: 'Alice Brown' },
  ];

  const tileClassName = ({ date, view }:any) => {
    if (view === 'month') {
      if (bookedDates.find(d => d.date.toDateString() === date.toDateString())) {
        return 'booked';
      }
    }
  };

  const tileContent = ({ date, view }:any) => {
    if (view === 'month') {
      const booking = bookedDates.find(d => d.date.toDateString() === date.toDateString());
      if (booking) {
        return (
          <div className="tile-content">
            <span>{booking.refNo}</span>
            <span>{booking.name}</span>
          </div>
        );
      }
    }
  };

  const handleDateChange = (value :any) => {
    setDate(value);
  };

  return (
    <CalendarWrapper className='h-[90vh]'>
      <h1>Room Management Calendar</h1>
      <Calendar
        onChange={handleDateChange} // Adjusted onChange handler
        value={date}
        tileClassName={tileClassName}
        tileContent={tileContent}
      />
      <div>
        <h2>Selected Date: {date.toDateString()}</h2>
      </div>
    </CalendarWrapper>
  );
};

export default CalendarPage;
