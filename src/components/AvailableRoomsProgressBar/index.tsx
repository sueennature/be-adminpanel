"use client";
import React, { useEffect, useState } from 'react';
import bookingsData from '../../components/Datatables/bookings.json'; // Adjust the path to your JSON file

interface Booking {
  start: string;
  end: string;
  refNo: string;
  personName: string;
  room: string;
}

interface Props {
  totalRooms: number;
}

const AvailableRoomsProgressBar: React.FC<Props> = ({ totalRooms }) => {
  const [progress, setProgress] = useState(0);

  // Calculate today's date
  const today = new Date().toISOString().split('T')[0];

  // Filter bookings for today
  const bookingsToday = bookingsData.filter((booking: Booking) => {
    const startDate = new Date(booking.start).toISOString().split('T')[0];
    return startDate === today;
  });

  // Calculate booked rooms count for today
  const bookedRoomsToday = bookingsToday.length;

  // Calculate available rooms count for today
  const availableRoomsToday = totalRooms - bookedRoomsToday;

  // Calculate progress percentage for today
  let progressPercentageToday = 0;
  if (totalRooms > 0) {
    progressPercentageToday = (availableRoomsToday / totalRooms) * 100;
  }

  useEffect(() => {
    setProgress(progressPercentageToday);
  }, [progressPercentageToday]);

  return (
    <div className="flex flex-col gap-4">
      {/* Display bookings count for today */}
      <div className="flex flex-row justify-between items-center xl:gap-10 text-white font-bold">
        <p className="text-md">Available Room Today</p>
        <div className="font-bold text-lg">{availableRoomsToday}</div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white bg-opacity-20 border-black rounded-full h-2.5 dark:bg-gray-700">
        <div className="bg-white h-2.5 rounded-full progress-bar" style={{ width: `${progress}%`, '--progress-width': `${progress}%` } as React.CSSProperties}></div>
      </div>
    </div>
  );
};

export default AvailableRoomsProgressBar;





