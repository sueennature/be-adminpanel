"use client";
import React, { useState, useEffect } from 'react';
import Calendar, { CalendarProps, TileContentProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import bookingsData from '../../components/Datatables/bookings.json'; // Adjust the path to your JSON file
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'; // Import icons from react-icons library

interface Booking {
  start: string;
  end: string;
  refNo: string;
  personName: string;
  room: string;
}

const Dashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date()); // Default to today
  const [endDate, setEndDate] = useState<Date | null>(new Date()); // Default to today
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showCount, setShowCount] = useState<number>(3); // Initial number of bookings to show
  const [isArrowUp, setIsArrowUp] = useState<boolean>(false); // Track arrow direction
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]); // Initialize filteredBookings state

  useEffect(() => {
    // Fetching bookings data from the local JSON file
    setBookings(bookingsData);
  }, []);

  useEffect(() => {
    // Update filtered bookings based on date range whenever startDate or endDate changes
    const updatedFilteredBookings = bookings.filter(booking =>
      isDateInRange(startDate!, booking.start, booking.end) ||
      isDateInRange(endDate!, booking.start, booking.end) ||
      (startDate! <= new Date(booking.start) && endDate! >= new Date(booking.end))
    );
    setFilteredBookings(updatedFilteredBookings);
  }, [startDate, endDate, bookings]);

  useEffect(() => {
    // Update isArrowUp based on showCount and filteredBookings length
    setIsArrowUp(showCount === filteredBookings.length && filteredBookings.length > 0);
  }, [showCount, filteredBookings.length]);

  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (Array.isArray(value) && value.length === 2) {
      // If a range is selected
      setStartDate(value[0]);
      setEndDate(value[1]);
    } else {
      // If a single date is selected or clear selection
      setStartDate(value instanceof Date ? value : new Date());
      setEndDate(value instanceof Date ? value : new Date());
    }
  };

  const isDateInRange = (date: Date, start: string, end: string) => {
    const selectedDateTime = date.getTime();
    const bookingStartTime = new Date(start).getTime();
    const bookingEndTime = new Date(end).getTime();
    // Check if the selected date is within the range, inclusive of start and end dates
    return selectedDateTime >= bookingStartTime && selectedDateTime <= bookingEndTime;
  };

  const renderTileContent = ({ date, view }: TileContentProps) => {
    if (view === 'month') {
      const dayBookings = filteredBookings.filter(booking => isDateInRange(date, booking.start, booking.end));
      if (dayBookings.length > 0) {
        return <div className="dot"></div>;
      }
    }
    return null;
  };

  const handleViewMore = () => {
    setShowCount(prevCount => {
      if (prevCount < filteredBookings.length) {
        return prevCount + 1; // Increase the count by 1 until reaching maximum
      } else {
        return prevCount; // Maintain the maximum count
      }
    });
  };

  const handleViewLess = () => {
    setShowCount(prevCount => {
      if (prevCount > 3) {
        return prevCount - 1; // Decrease the count by 1 until reaching the initial 3
      } else {
        return prevCount; // Maintain the minimum count
      }
    });
  };

  return (
    <div className="col-span-6 rounded-md border border-stroke bg-white p-6 shadow-default">
      <h2 className='text-title-md font-bold text-black pb-8'>Recent Booking Schedule</h2>
      
      <div className="w-full max-w-xl border-b pb-6 border-slate-300">
        <Calendar
          onChange={handleDateChange}
          selectRange={true} // Enable range selection
          value={[startDate, endDate]}
          tileContent={renderTileContent}
        />
      </div>
      <div className="w-full max-w-xl py-4">
        {filteredBookings.slice(0, showCount).map((booking, index) => (
          <div key={index} className="flex items-center justify-between gap-26 p-4 bg-white shadow-md rounded-md mb-4">
            <div className='flex flex-col'>
              <div className="font-bold text-nowrap">Ref No: {booking.refNo}</div>
              <div className="font-bold text-nowrap">Room Number: {booking.room}</div>
              <div className="text-sm text-nowrap text-slate-500 font-medium">{booking.personName}</div>
            </div>
            <div className="ml-auto">
              <span className="px-2 py-1 rounded bg-green-500 text-white text-nowrap">
                {`${new Date(booking.start).toLocaleDateString()} to ${new Date(booking.end).toLocaleDateString()}`}
              </span>
            </div>
          </div>
        ))}
        {isArrowUp ? (
          <div className="flex justify-center mt-4">
            <FiChevronUp
              className="text-blue-500 cursor-pointer"
              size={24}
              onClick={handleViewLess}
            />
          </div>
        ) : (
          <div className="flex justify-center mt-4">
            <FiChevronDown
              className="text-blue-500 cursor-pointer"
              size={24}
              onClick={handleViewMore}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;























