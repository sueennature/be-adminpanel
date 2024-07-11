'use client';
import eventsData from '../../components/Datatables/eventData.json'; // Import booking event JSON data
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, View, Views, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import React, { useCallback, useState, useEffect } from 'react';

interface Event {
  color: string;
  start: Date;
  end: Date;
  refNo: string;
  personName: string;
}

const localizer = dayjsLocalizer(dayjs);

const Home = () => {
  const [view, setView] = useState<View>(Views.MONTH);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Fetch or load events data from JSON file
    const fetchEventsData = async () => {
      try {
        // Assuming eventsData is directly imported JSON array
        const eventsWithColors: Event[] = eventsData.map((event: any) => ({
          ...event,
          start: new Date(event.start), // Ensure start date is a Date object
          end: new Date(event.end),     // Ensure end date is a Date object
          color: getRandomColor(),
        }));
        setEvents(eventsWithColors);
        console.log('Events from JSON:', eventsWithColors);
      } catch (error) {
        console.error('Error fetching events data:', error);
      }
    };

    fetchEventsData();
  }, []); // Empty dependency array ensures useEffect runs only once

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  const [date, setDate] = useState<Date>(new Date());
  
  const onNavigate = useCallback((newDate: Date) => {
    console.log('Navigating to new date:', newDate); // Debugging log
    setDate(newDate);
  }, []);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const EventComponent = ({ event }: { event: Event }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          backgroundColor: event.color,
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          marginRight: '5px',
        }}
      />
      <div>
        <div>Ref No: {event.refNo}</div>
        <div>Person: {event.personName}</div>
      </div>
    </div>
  );

  return (
    <Calendar
      date={date}
      onNavigate={onNavigate}
      localizer={localizer}
      events={events}
      view={view}
      defaultView={Views.MONTH}
      views={['month', 'week', 'day']}
      showMultiDayTimes
      style={{ height: 500 }}
      onView={handleOnChangeView}
      components={{
        event: EventComponent,
      }}
    />
  );
};

export default Home;


