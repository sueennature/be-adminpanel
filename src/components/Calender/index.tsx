"use client";
import React, { useState, useEffect } from "react";
import Timeline from "react-calendar-timeline";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import axios from "axios";
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";
import ReactTooltip from 'react-tooltip';



interface Booking {
  id: string;
  start: string;
  end: string;
  room: string;
  personName: string;
}

interface Room {
  id: string;
  room_type: string;
  view: string;
  status:boolean;
}

interface TimelineItem {
  id: string;
  group: string;
  title: string;
  start_time: Date;
  end_time: Date;
  booking_id: string; // Add booking_id
  guest_name: string; // Add guest_name
  room_number: string; // Add room_number
}

const Home: React.FC = () => {
  const [bookings, setBookings] = useState<TimelineItem[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [defaultTimeStart, setDefaultTimeStart] = useState(dayjs().startOf('month').toDate());
  const [defaultTimeEnd, setDefaultTimeEnd] = useState(dayjs().endOf('month').toDate());

  const fetchBookings = async () => {
    try {
      const accessToken = Cookies.get("access_token");
      const response = await axios.get(`${process.env.BE_URL}/calendar/data`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });

      console.log("Raw API Response:", response?.data);

      // Transform bookings
      const transformedBookings: TimelineItem[] = response?.data?.bookings?.map((data: any) => {
        const transformed = {
          id: data?.booking_id || 'default-id',
          start_time: moment(data?.check_in).toDate(),
          end_time: moment(data?.check_out).toDate(),
          group: data?.room_id || 'default-group',
          title: `ID:${data?.booking_id || "Untitled Booking"}`,
          booking_id: data?.booking_id,
          guest_name: data?.guest_name,
          room_number: data?.room_number,
        };

        // Check if start_time is before end_time
        if (transformed.start_time >= transformed.end_time) {
          console.error(`Invalid booking with ID ${transformed.id}: start_time is not before end_time.`);
        }

        console.log(`Transformed Booking for Room ID ${transformed.group}:`, transformed);
        return transformed;
      }) || [];

      // Remove duplicates by ID
      const uniqueBookings = Array.from(new Set(transformedBookings.map(b => b.id)))
        .map(id => transformedBookings.find(b => b.id === id)!);

      setRooms(response?.data?.rooms || []);
      setBookings(uniqueBookings);
    } catch (err) {
      console.log("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }, [bookings, rooms]);

  // Map rooms to the format expected by the Timeline component
  const groups = rooms.map(room => ({
    id: room.id,
    title: room.id,
    rightTitle: 'Room ID',
    type: room.room_type,
    view: room.view,
    status: room.status,
    stackItems: true,
   
  }));

  console.log("Groups:", groups);

  return (
    <div className="my-8 h-full bg-white p-4">
      
      <Timeline
        groups={groups}
        items={bookings}
        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
        canMove={true}
        canResize={true}
        sidebarWidth={200}
        traditionalZoom={true}
        lineHeight={40}
        minZoom={1000 * 60 * 60 } // One day in milliseconds
        maxZoom={1000 * 60 * 60 * 24 * 31} // Approximately one month
        timeSteps={{
          second: 0,
          minute: 30,
          hour: 1,
          day: 1,
          month: 1,
          year: 1
        }}
        
        groupRenderer={({ group }) => (
          <div className="group-header" style={{ display: 'flex', alignItems: 'left'}}>
            <div className="group-id" style={{ flex: 1, paddingLeft: '3px', fontSize: '10px' }}>
              {group.title} {/* Display Room ID */}
            </div>
            <div className="group-type" style={{ flex: 1, fontSize: '10px' ,textAlign:'left'}}>
              {group.type} {/* Display Room Type */}
            </div>
            <div className="group-view" style={{ flex: 1, fontSize: '10px',paddingRight:'3px' }}>
              {group.view} {/* Display Room View */}
            </div>
            
            
          </div>
        )}
      />
      </div>
  );
};

export default Home;
