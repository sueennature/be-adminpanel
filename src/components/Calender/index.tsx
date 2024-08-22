"use client";
import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
// import bookingsData from "../../components/Datatables/eventData.json";
// import roomsData from "../../components/Datatables/roomsTypes.json";
import Cookies from "js-cookie";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  status: string; // Added status field
}

function filterBookingById(bookings:any, id:any) {
  return bookings?.filter((b:any) => b.id == id)?.[0];
}

const getColorForBooking = (id: any, bookings:any) => {
  const booking = filterBookingById(bookings,id)
  if(booking?.booking_type === 'internal'){
    return 'bg-blue-400';
  }else if(booking?.booking_type === 'website'){
    return 'bg-green-400';
  }
};

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};

function filterById(rooms:any, id:any) {
  return rooms?.filter((room:any) => room.id == id)?.[0];
}


const Home: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); //for get date from search input field
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

  const isMobile = useMediaQuery("(max-width: 1124px)");
  
  function convertToISO8601(dateStr: any) {
    let date = new Date(dateStr);
    let isoFormattedDateStr = date.toISOString();
    return isoFormattedDateStr;
  }

  const fetchBookings = async () => {
    try {
      const accessToken = Cookies.get("access_token");
      const response = await axios.get(`${process.env.BE_URL}/calendar/data`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });

      setRooms(response?.data?.rooms || []);

      const transformedBookings = response?.data?.bookings?.map((data:any) => ({
        check_in: convertToISO8601(data?.check_in),
        check_out: convertToISO8601(data?.check_out),
        refNo: "refNo",
        personName: data?.guest_name,
        room: `${data?.room_id}`,
        booking_type: data?.booking_type
      }));

      setBookings(transformedBookings || []);
      
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    
   
    fetchBookings();
  }, []);

  const navigate = (direction: "previous" | "next") => {
    if (isMobile) {
      let newStartDate =
        direction === "previous"
          ? startDate.subtract(7, "day")
          : startDate.add(7, "day");

      // Check if the new date is out of the current month
      const daysInMonth = dayjs(newStartDate).daysInMonth();
      if (newStartDate.date() > daysInMonth) {
        newStartDate = newStartDate
          .startOf("month")
          .add(1, "month")
          .startOf("month");
      }
      setStartDate(newStartDate);
    } else {
      const newStartDate =
        direction === "previous"
          ? startDate.subtract(1, "month")
          : startDate.add(1, "month");

      setStartDate(newStartDate.startOf("month"));
    }
  };

  const handleSearch = () => {
    if (selectedDate) {
      setStartDate(dayjs(selectedDate).startOf("month"));
    }
  }; //for input search

  const handleMouseEnter = (roomId: string, day: number) => {
    const booking = bookings.find(
      (booking) =>
        booking.room === roomId &&
        dayjs(booking.start).date() <= day &&
        dayjs(booking.end).date() >= day &&
        dayjs(booking.start).month() + 1 === startDate.month() + 1 &&
        dayjs(booking.start).year() === startDate.year(),
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

  const getDaysForWeek = (date: dayjs.Dayjs): number[] => {
    const startOfWeek = date.startOf("week");
    return new Array(7)
      .fill(null)
      .map((_, index) => startOfWeek.add(index, "day").date());
  };

  const getDaysForMonth = (date: dayjs.Dayjs): number[] => {
    const daysInMonth = date.daysInMonth();
    return new Array(daysInMonth).fill(null).map((_, index) => index + 1);
  };

  const daysToShow = isMobile
    ? getDaysForWeek(startDate)
    : getDaysForMonth(startDate);

  return (
    <div className="my-8 h-full bg-white p-4">
      <div className="mb-4 mt-2">
        <label
          htmlFor="monthPicker"
          className="text-gray-700 mb-2 block font-bold"
        >
          Month
        </label>
        <div className="flex items-center">
          <DatePicker
            id="monthPicker"
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            dateFormat="yyyy/MM/dd"
            className="rounded-sm border p-2"
            placeholderText="Select a date"
            showPopperArrow={false}
          />
          <button
            onClick={handleSearch}
            className="ml-2 rounded-sm bg-blue-900 px-4 py-2 text-white shadow-sm shadow-black hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <button
          className="bg-gray-200 hover:bg-gray-300 flex items-center rounded-md px-4 py-2"
          onClick={() => navigate("previous")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 20 20"
            className="ml-2"
          >
            <path
              fill="#2357ac"
              d="M2 10l8 8l1.4-1.4L5.8 11H18V9H5.8l5.6-5.6L10 2z"
            />
          </svg>
          <div className="ml-2 hidden sm:block">Previous</div>
        </button>
        <h2 className="text-md font-semibold md:text-lg">
          {startDate.format(isMobile ? "MMMM YYYY" : "MMMM YYYY")}
        </h2>
        <button
          className="bg-gray-200 hover:bg-gray-300 flex items-center rounded-md px-4 py-2"
          onClick={() => navigate("next")}
        >
          <div className="mr-2 hidden sm:block">Next </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 20 20"
          >
            <path
              fill="#2357ac"
              d="M8.6 3.4L14.2 9H2v2h12.2l-5.6 5.6L10 18l8-8l-8-8z"
            />
          </svg>
        </button>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <th className="w-16 border px-2 py-1 text-xxs 2xl:w-30 2xl:text-xs">
                Room Type
              </th>
              
              <th className="w-10 border px-2 py-1 text-xxs 2xl:w-24 2xl:text-xs">
                Room
              </th>
              <th className="w-16 border px-2 py-1 text-xxs 2xl:w-24 2xl:text-xs">
                Room View
              </th>

              {daysToShow.map((day) => (
                <th
                  key={day}
                  className="border px-2 py-1 text-center text-xxs 2xl:text-xxs"
                >
                  <div className="flex justify-center font-bold">
                    {String(day).padStart(2, '0')}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map((room : any) => (
              <tr key={room.id}>
                <td className={`text-nowrap text-white border-black px-2 py-1 text-center text-xxs 2xl:text-xs bg-blue-900`} style={ room?.status ? {

                  boxShadow: '0 -5px 5px -5px rgba(0, 0, 0, 0.7), 0 5px 5px -5px rgba(0, 0, 0, 0.7)',
                  
                } : {
                  boxShadow: '0 -5px 5px -5px rgba(0, 0, 0, 0.7), 0 5px 5px -5px rgba(0, 0, 0, 0.7)',
                  backgroundColor:"red"
                }}>
                  {room.room_type}
                </td>
                <td className="border-black text-white px-2 py-1 text-center text-xxs 2xl:text-xs bg-blue-900" style={ room?.status ? {

                  boxShadow: '0 -5px 5px -5px rgba(0, 0, 0, 0.7), 0 5px 5px -5px rgba(0, 0, 0, 0.7)',

                  } : {
                  boxShadow: '0 -5px 5px -5px rgba(0, 0, 0, 0.7), 0 5px 5px -5px rgba(0, 0, 0, 0.7)',
                  backgroundColor:"red"
                  }}>
                  { filterById(rooms, `${room.id}`)?.room_number}
                </td>
                <td className="text-nowrap text-white border-black px-2 py-1 text-center text-xxs 2xl:text-xs bg-blue-900" style={ room?.status ? {

                  boxShadow: '0 -5px 5px -5px rgba(0, 0, 0, 0.7), 0 5px 5px -5px rgba(0, 0, 0, 0.7)',

                  } : {
                  boxShadow: '0 -5px 5px -5px rgba(0, 0, 0, 0.7), 0 5px 5px -5px rgba(0, 0, 0, 0.7)',
                  backgroundColor:"red"
                  }}>
                  {room?.view}
                </td>
                
                {daysToShow.map((day) => {
                  const booking:any = bookings.find(
                    (booking:any) =>
                      booking.room === room.id &&
                      dayjs(booking.check_in).date() <= day &&
                      dayjs(booking.check_out).date() >= day &&
                      dayjs(booking.check_in).month() + 1 ===
                      startDate.month() + 1 &&
                      dayjs(booking.check_in).year() === startDate.year(),
                  );

                  return (
                    <td
                      key={`${room.id}-${day}`}
                      className={`border px-2 py-1 ${booking
                          ? `${getColorForBooking(
                            booking?.id,bookings
                          )} cursor-pointer border-black text-white`
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
                            className="border-gray-200 absolute -translate-x-25 translate-y-6 rounded-md border bg-black p-4 shadow-md"
                            style={{
                              top: popupRef.current?.offsetTop,
                              left: popupRef.current?.offsetLeft,
                              transform: "",
                            }}
                          >
                            <p className="text-xxs font-semibold md:text-sm">
                              Booking Details
                            </p>
                            <p className="text-xxs md:text-sm">
                              Ref No: {popupContent?.refNo}
                            </p>
                            <p className="text-xxs md:text-sm">
                              Person: {popupContent?.personName}
                            </p>
                          </div>
                        )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
