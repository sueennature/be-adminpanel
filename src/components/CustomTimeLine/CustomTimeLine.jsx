"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import Timeline from "react-calendar-timeline";
import InfoLabel from "./InfoLabel";
import Cookies from "js-cookie";
import "react-calendar-timeline/lib/Timeline.css";

const keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end",
  groupLabelKey: "title",
};

const initialItems = [
  {
    id: "1",
    group: "1",
    title:
      "calculating the circuit won't do anything, we need to bypass the open-source JSON hard drive!",
    start: 1729190000000,
    end: 1729214295090,
  },
  {
    id: "2",
    group: "2",
    title:
      "backing up the bandwidth won't do anything, we need to transmit the virtual SSL monitor!",
    start: 1729190000000,
    end: 1729208312819,
  },
  {
    id: "3",
    group: "3",
    title:
      "Try to navigate the PNG interface, maybe it will input the virtual transmitter!",
    start: 1729190000000,
    end: 1729211826557,
  },
  {
    id: "4",
    group: "4",
    title: "We need to parse the solid state CLI driver!",
    start: 1729190000000,
    end: 1729204223325,
  },
  {
    id: "5",
    group: "5",
    title:
      "If we bypass the matrix, we can get to the CSS sensor through the multi-byte UDP hard drive!",
    start: 1729190000000,
    end: 1729213295010,
  },
  {
    id: "6",
    group: "6",
    title:
      "Use the redundant JBOD capacitor, then you can synthesize the primary bandwidth!",
    start: 1729190000000,
    end: 1729213156466,
  },
];

const CustomTimeLine = () => {
  const [groups, setGroups] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [items, setItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(undefined);
  const defaultTimeStart = moment(rooms[0]?.bookings[0]?.check_in)
    .subtract(12, "hours")
    .toDate();
  const defaultTimeEnd = moment(rooms[0]?.bookings[0]?.check_out)
    .add(12, "hours")
    .toDate();

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
        start: moment(booking.check_in).valueOf(), 
        end: moment(booking.check_out).valueOf(), 
      }));

      

      setItems(transformedItems);

      setBookings(bookings);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const group = groups[newGroupOrder];
    setItems(
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              start: dragTime,
              end: dragTime + (item.end - item.start),
              group: group.id,
            }
          : item,
      ),
    );
    setDraggedItem(undefined);
    console.log("Moved", itemId, dragTime, newGroupOrder);
  };

  const handleItemResize = (itemId, time, edge) => {
    setItems(
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              start: edge === "left" ? time : item.start,
              end: edge === "left" ? item.end : time,
            }
          : item,
      ),
    );
    setDraggedItem(undefined);
    console.log("Resized", itemId, time, edge);
  };

  const handleItemDrag = ({ eventType, itemId, time, edge, newGroupOrder }) => {
    let item = draggedItem ? draggedItem.item : undefined;
    if (!item) {
      item = items.find((i) => i.id === itemId);
    }
    setDraggedItem({ item: item, group: groups[newGroupOrder], time });
  };

  useEffect(() => {}, [items, groups]);

  return (
    <React.Fragment>
      <Timeline
        groups={groups}
        items={items}
        keys={keys}
        fullUpdate
        itemTouchSendsClick={false}
        stackItems
        itemHeightRatio={0.75}
        canMove={true}
        canResize={"both"}
        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        onItemDrag={handleItemDrag}
        timeSteps={{ day: 1, hour: 1, minute: 15, second: 0 }}
      />
    </React.Fragment>
  );
};

export default CustomTimeLine;
