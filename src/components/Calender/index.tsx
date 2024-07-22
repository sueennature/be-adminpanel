"use client";
import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import bookingsData from "../../components/Datatables/eventData.json"; // Replace with the path to your JSON file
import roomsData from "../../components/Datatables/roomsTypes.json"; // Replace with the path to your JSON file

interface Booking {
  start: string;
  end: string;
  refNo: string;
  personName: string;
  room: string;
}

interface Room {
  id: string;
  room_type: string;
}

const colors = [
  "bg-blue-400",
  "bg-rose-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-indigo-400",
  "bg-teal-400",
];

const getColorForBooking = (index: number) => {
  return colors[index % colors.length];
};

const Home: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupContent, setPopupContent] = useState<{
    refNo: string;
    personName: string;
  } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{
    room: string;
    day: number;
  } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate fetching data from JSON file
    // Replace with actual fetch logic in your application
    setBookings(bookingsData);
    // Fetch rooms data
    setRooms(roomsData.rooms);
  }, []);

  useEffect(() => {
    const { month: initialMonth, year: initialYear } =
      getMonthWithMostBookings(bookings);
    setSelectedMonth(initialMonth);
    setSelectedYear(initialYear);
  }, [bookings]);

  const getMonthWithMostBookings = (
    bookings: Booking[],
  ): { month: number; year: number } => {
    const bookingsCount: { [key: string]: number } = {};

    bookings.forEach((booking, index) => {
      const startDate = dayjs(booking.start);
      const endDate = dayjs(booking.end);

      for (
        let date = startDate.startOf("month");
        date.isBefore(endDate.endOf("month"));
        date = date.add(1, "month")
      ) {
        const key = `${date.year()}-${date.month() + 1}`;
        if (bookingsCount[key]) {
          bookingsCount[key]++;
        } else {
          bookingsCount[key] = 1;
        }
      }
    });

    const maxBookings = Object.entries(bookingsCount).reduce(
      (max, entry) => (entry[1] > max[1] ? entry : max),
      ["", 0],
    );

    const [year, month] = maxBookings[0].split("-").map(Number);
    return { year, month };
  };

  const goToPreviousMonth = () => {
    setSelectedMonth((prevMonth) => {
      const newMonth = prevMonth === 1 ? 12 : prevMonth - 1;
      const newYear = prevMonth === 1 ? selectedYear - 1 : selectedYear;
      setSelectedYear(newYear);
      return newMonth;
    });
  };

  const goToNextMonth = () => {
    setSelectedMonth((prevMonth) => {
      const newMonth = prevMonth === 12 ? 1 : prevMonth + 1;
      const newYear = prevMonth === 12 ? selectedYear + 1 : selectedYear;
      return newMonth;
    });
  };

  const handleMouseEnter = (roomId: string, day: number) => {
    const booking = bookings.find(
      (booking) =>
        booking.room === roomId &&
        dayjs(booking.start).date() <= day &&
        dayjs(booking.end).date() >= day &&
        dayjs(booking.start).month() + 1 === selectedMonth &&
        dayjs(booking.start).year() === selectedYear,
    );
    if (booking) {
      setHoveredCell({ room: roomId, day });
      setPopupContent({ refNo: booking.refNo, personName: booking.personName });
      setShowPopup(true);
    }
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  const getDaysForMonth = (month: number, year: number): number[] => {
    if (month !== undefined && year !== undefined) {
      const formattedMonth = month.toString().padStart(2, "0");
      const daysInMonth = dayjs(`${year}-${formattedMonth}-01`).daysInMonth();
      return new Array(daysInMonth).fill(null).map((_, index) => index + 1);
    }
    return [];
  };

  return (
    <div className="h-screen p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          className="bg-gray-200 hover:bg-gray-300 flex items-center rounded-md px-4 py-2"
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
          Previous
        </button>
        <h2 className="text-lg font-semibold">
          {selectedMonth !== undefined &&
            selectedYear !== undefined &&
            dayjs(
              `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}-01`,
            ).format("MMMM YYYY")}
        </h2>
        <button
          className="bg-gray-200 hover:bg-gray-300 flex items-center rounded-md px-4 py-2"
          onClick={goToNextMonth}
        >
          Next{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 20 20"
          >
            <path
              fill="#3B82F6"
              d="M8.6 3.4L14.2 9H2v2h12.2l-5.6 5.6L10 18l8-8l-8-8z"
            />
          </svg>
        </button>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <th className="w-36 border px-2 py-1">Room Type</th>
              <th className="w-24 border px-2 py-1">Room</th>
              {getDaysForMonth(selectedMonth, selectedYear).map((day) => (
                <th key={day} className="border px-2 py-1 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="border px-2 py-1 text-xs text-center">{room.room_type}</td>
                <td className="border px-2 py-1 text-xs text-center">{room.id}</td>
                {getDaysForMonth(selectedMonth, selectedYear).map(
                  (day, dayIndex) => {
                    const booking = bookings.find(
                      (booking, index) =>
                        booking.room === room.id &&
                        dayjs(booking.start).date() <= day &&
                        dayjs(booking.end).date() >= day &&
                        dayjs(booking.start).month() + 1 === selectedMonth &&
                        dayjs(booking.start).year() === selectedYear,
                    );

                    return (
                      <td
                        key={`${room.id}-${day}`}
                        className={`border px-2 py-1 ${
                          booking
                            ? `${getColorForBooking(bookings.indexOf(booking))} cursor-pointer border-black text-white`
                            : "cursor-pointer"
                        }`}
                        style={{ width: "1rem", height: "1.58rem" }}
                        onMouseEnter={() => handleMouseEnter(room.id, day)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {""}
                        {showPopup &&
                          hoveredCell?.room === room.id &&
                          hoveredCell?.day === day && (
                            <div
                              ref={popupRef}
                              className="border-gray-200 absolute rounded-md border bg-black p-4 shadow-md"
                              style={{
                                top: popupRef.current?.offsetTop,
                                left: popupRef.current?.offsetLeft,
                                transform: "translateY(100%)",
                              }}
                            >
                              <p className="text-sm font-semibold">
                                Booking Details
                              </p>
                              <p className="text-xs">
                                Ref No: {popupContent?.refNo}
                              </p>
                              <p className="text-xs">
                                Person: {popupContent?.personName}
                              </p>
                            </div>
                          )}
                      </td>
                    );
                  },
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
