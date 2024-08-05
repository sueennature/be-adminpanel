"use client";
import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import bookingsData from "../../components/Datatables/eventData.json";
import roomsData from "../../components/Datatables/roomsTypes.json";
import Cookies from "js-cookie";
import axios from "axios";

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

const Home: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [startDate, setStartDate] = useState(dayjs().startOf('month'));
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
  function convertToISO8601(dateStr:any) {
    // Convert the input date string to a Date object
    let date = new Date(dateStr);

    // Convert the Date object to the desired ISO 8601 format with milliseconds
    let isoFormattedDateStr = date.toISOString();

    return isoFormattedDateStr;
}
  async function transformBookingData(inputArray : any) {
    return await inputArray.map( async (booking: any) => {
        return {
            start: await convertToISO8601(booking.check_in),
            end: await convertToISO8601(booking.check_out),
            refNo: booking.booking_id,
            personName: booking.guest_name,
            room: booking.room_number
        };
    });
}

  const fetchBookings = async() =>{
    try{
      const accessToken = Cookies.get("access_token");
      const response = await axios.get(`${process.env.BE_URL}/calendar/data`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });
      
     // console.log("response?.data",response)
      console.log("bookingsData",)
      console.log("roomsData",roomsData)
      console.log("response",roomsData?.rooms )
      console.log("response?.data?.rooms",response?.data?.rooms )
      
      const transformedArray = await transformBookingData(response?.data?.bookings);

      setBookings( bookingsData || []);
      setRooms( roomsData?.rooms || []);
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, []);

  const navigate = (direction: "previous" | "next") => {
    if (isMobile) {
      let newStartDate = direction === "previous"
        ? startDate.subtract(7, "day")
        : startDate.add(7, "day");

      // Check if the new date is out of the current month
      const daysInMonth = dayjs(newStartDate).daysInMonth();
      if (newStartDate.date() > daysInMonth) {
        newStartDate = newStartDate.startOf('month').add(1, 'month').startOf('month');
      }
      setStartDate(newStartDate);
    } else {
      const newStartDate = direction === "previous"
        ? startDate.subtract(1, "month")
        : startDate.add(1, "month");
        
      setStartDate(newStartDate.startOf('month'));
    }
  };

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
    const startOfWeek = date.startOf('week');
    return new Array(7).fill(null).map((_, index) => startOfWeek.add(index, 'day').date());
  };

  const getDaysForMonth = (date: dayjs.Dayjs): number[] => {
    const daysInMonth = date.daysInMonth();
    return new Array(daysInMonth).fill(null).map((_, index) => index + 1);
  };

  const daysToShow = isMobile ? getDaysForWeek(startDate) : getDaysForMonth(startDate);

  return (
    <div className="h-screen p-4">
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
              fill="#3B82F6"
              d="M2 10l8 8l1.4-1.4L5.8 11H18V9H5.8l5.6-5.6L10 2z"
            />
          </svg>
          <div className="sm:block hidden"
          >Previous</div>
        </button>
        <h2 className="md:text-lg text-md font-semibold">
          {startDate.format(isMobile ? "MMMM YYYY" : "MMMM YYYY")}
        </h2>
        <button
          className="bg-gray-200 hover:bg-gray-300 flex items-center rounded-md px-4 py-2"
          onClick={() => navigate("next")}
        >
          <div className="sm:block hidden"
          >Next{" "}</div>
          
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
              <th className="2xl:w-36 w-18 border px-2 py-1 2xl:text-xs text-xxs">Room Type</th>
              <th className="2xl:w-24 w-10 border px-2 py-1 2xl:text-xs text-xxs">Room</th>
              {daysToShow.map((day) => (
                <th
                  key={day}
                  className="border px-2 py-1 text-center 2xl:text-xs text-xxs"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="border px-2 py-1 2xl:text-xs text-xxs text-center text-nowrap">
                  {room.room_type}
                </td>
                <td className="border px-2 py-1 2xl:text-xs text-xxs text-center">
                  {room.id}
                </td>
                {daysToShow.map((day) => {
                  const booking = bookings.find(
                    (booking) =>
                      booking.room === room.id &&
                      dayjs(booking.start).date() <= day &&
                      dayjs(booking.end).date() >= day &&
                      dayjs(booking.start).month() + 1 === startDate.month() + 1 &&
                      dayjs(booking.start).year() === startDate.year(),
                  );

                  return (
                    <td
                      key={`${room.id}-${day}`}
                      className={`border px-2 py-1 ${
                        booking
                          ? `${getColorForBooking(
                              bookings.indexOf(booking),
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
                            className="border-gray-200 absolute rounded-md border bg-black p-4 shadow-md translate-y-6 -translate-x-25"
                            style={{
                              top: popupRef.current?.offsetTop,
                              left: popupRef.current?.offsetLeft,
                              transform: "",
                            }}
                          >
                            <p className="md:text-sm text-xxs font-semibold">
                              Booking Details
                            </p>
                            <p className="md:text-sm text-xxs">
                              Ref No: {popupContent?.refNo}
                            </p>
                            <p className="md:text-sm text-xxs">
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








