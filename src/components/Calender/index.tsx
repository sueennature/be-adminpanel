"use client";
"use client";
import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import bookingsData from '../../components/Datatables/eventData.json'; // Replace with the path to your JSON file

interface Booking {
  start: string; // Assuming start and end are ISO 8601 formatted strings
  end: string;
  refNo: string;
  personName: string;
  room: string;
}

interface Room {
  id: string;
}

const rooms: Room[] = [
  { id: "101" },
  { id: "102" },
  { id: "103" },
  { id: "104" },
  { id: "105" },
  { id: "106" },
  { id: "107" },
  { id: "108" },
  { id: "109" },
  { id: "110" },
  { id: "111" },
  { id: "112" },
  { id: "201" },
  { id: "202" },
  { id: "203" },
  { id: "204" },
  { id: "205" },
  { id: "206" },
  { id: "207" },
  { id: "208" },
  { id: "209" },
  { id: "210" },
  { id: "211" },
  { id: "212" },
  { id: "213" },
  { id: "214" },
];

const getDaysInMonth = (month: number, year: number): number[] => {
  return new Array(dayjs(`${year}-${month}-01`).daysInMonth())
    .fill(null)
    .map((_, index) => index + 1);
};

const Home: React.FC = () => {
  const currentMonth = dayjs().month() + 1; // Current month
  const currentYear = dayjs().year(); // Current year

  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Simulate fetching data from JSON file
    // Replace with actual fetch logic in your application
    setBookings(bookingsData);
  }, []);

  // State to manage selected month and year
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // State to manage popup visibility and content
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState<{ refNo: string; personName: string } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ room: string; day: number } | null>(null);

  // Ref for tracking the popup position
  const popupRef = useRef<HTMLDivElement>(null);

  // Function to navigate to previous month
  const goToPreviousMonth = () => {
    setSelectedMonth((prevMonth) => {
      const newMonth = prevMonth === 1 ? 12 : prevMonth - 1;
      const newYear = prevMonth === 1 ? selectedYear - 1 : selectedYear;
      setSelectedYear(newYear);
      return newMonth;
    });
  };

  // Function to navigate to next month
  const goToNextMonth = () => {
    setSelectedMonth((prevMonth) => {
      const newMonth = prevMonth === 12 ? 1 : prevMonth + 1;
      const newYear = prevMonth === 12 ? selectedYear + 1 : selectedYear;
      setSelectedYear(newYear);
      return newMonth;
    });
  };

  // Function to handle mouse enter event
  const handleMouseEnter = (roomId: string, day: number) => {
    const booking = bookings.find(
      (booking) =>
        booking.room === roomId &&
        dayjs(booking.start).date() <= day &&
        dayjs(booking.end).date() >= day &&
        dayjs(booking.start).month() + 1 === selectedMonth &&
        dayjs(booking.start).year() === selectedYear
    );
    if (booking) {
      setHoveredCell({ room: roomId, day });
      setPopupContent({ refNo: booking.refNo, personName: booking.personName });
      setShowPopup(true);
    }
  };

  // Function to handle mouse leave event
  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  // Function to get days for a specific month and year
  const getDaysForMonth = (month: number, year: number): number[] => {
    return new Array(dayjs(`${year}-${month}-01`).daysInMonth())
      .fill(null)
      .map((_, index) => index + 1);
  };

  return (
    <div className="h-screen p-4">
      <div className="flex">
        <div className="w-1/5">
          <h2 className="text-lg font-semibold mb-7">Rooms</h2>
          <div className="overflow-y-auto max-h-full">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Room</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td className="border px-2 py-1 text-xs">#{room.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex-auto relative overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center"
              onClick={goToPreviousMonth}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 20 20"
                className="ml-2"
              >
                <path
                  fill="#3B82F6"
                  d="M2 10l8 8l1.4-1.4L5.8 11H18V9H5.8l5.6-5.6L10 2z"
                />
              </svg>
              Previous Month
            </button>
            <h2 className="text-lg font-semibold">
              {dayjs(`${selectedYear}-${selectedMonth}-01`).format('MMMM YYYY')}
            </h2>
            <button
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center"
              onClick={goToNextMonth}
            >
              Next Month{' '}
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="#3B82F6" d="M8.6 3.4L14.2 9H2v2h12.2l-5.6 5.6L10 18l8-8l-8-8z"/></svg>
            </button>
          </div>
          <div className="relative overflow-x-auto">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr>
                  {getDaysForMonth(selectedMonth, selectedYear).map((day) => (
                    <th key={day} className="border px-2 py-1">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    {getDaysForMonth(selectedMonth, selectedYear).map((day) => (
                      <td
                        key={day}
                        className={`border px-2 py-1 ${bookings.find(
                          (booking) =>
                            booking.room === room.id &&
                            dayjs(booking.start).date() <= day &&
                            dayjs(booking.end).date() >= day &&
                            dayjs(booking.start).month() + 1 === selectedMonth &&
                            dayjs(booking.start).year() === selectedYear
                        )
                          ? 'bg-blue-500 text-white cursor-pointer'
                          : 'cursor-pointer'}`}
                        style={{ width: '1rem', height: '1.55rem' }} // Adjust width and height as needed
                        onMouseEnter={() => handleMouseEnter(room.id, day)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {''}
                        {showPopup && hoveredCell?.room === room.id && hoveredCell?.day === day && (
                          <div
                            ref={popupRef}
                            className="absolute bg-black shadow-md border border-gray-200 p-4 rounded-md"
                            style={{
                              top: popupRef.current?.offsetTop,
                              left: popupRef.current?.offsetLeft,
                              transform: 'translateY(100%)',
                            }}
                          >
                            <p className="text-sm font-semibold">Booking Details</p>
                            <p className="text-xs">Ref No: {popupContent?.refNo}</p>
                            <p className="text-xs">Person: {popupContent?.personName}</p>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
































