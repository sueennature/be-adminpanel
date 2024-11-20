"use client";
import React, { useState, useEffect } from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";
import Cookies from "js-cookie";
import axios from "axios";
import { useUserContext } from "@/hooks/useUserContext";

const CustomTimeLineNew = () => {
  const [groups, setGroups] = useState([]);
  const [items, setItems] = useState([]);
  const [key, setKey] = useState(0); 
  const { groupFour } = useUserContext();

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

      const { rooms = [], bookings = [] } = response?.data || {};

      const transformedGroups = rooms.map((room) => ({
        id: room.room_number,
        title: `${room.room_number}-${room.room_type}`,
        rightTitle: `${room.view}-${room.secondary_category}`,
        bgColor: "#76d4e2",
      }));

      setGroups(transformedGroups);

      const transformedItems = bookings.map((booking) => ({
        id: `${booking.booking_id}-${booking.room_id}`,
        group: booking.room_number,
        title: `${booking.guest_name} | Check-in: ${moment(booking.check_in).format("YYYY-MM-DD HH:mm")} | Check-out: ${moment(booking.check_out).format("YYYY-MM-DD HH:mm")}`,
        start_time: moment(booking.check_in),
        end_time: moment(booking.check_out),
      }));

      setItems(transformedItems);

      setKey((prevKey) => prevKey + 1);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      {groupFour && (
        <Timeline
          key={key}
          groups={groups}
          items={items}
          defaultTimeStart={moment().add(-12, "hour")}
          defaultTimeEnd={moment().add(12, "hour")}
        />
      )}
    </>
  );
};

export default CustomTimeLineNew;
