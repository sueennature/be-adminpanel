"use client";
import React, { useEffect, useState } from "react";
import CardDataStats from "../CardDataStats";
import Card from "../dashboardCards/Card";
import { Calendar} from 'react-feather';
import CheckAvailability from '@/components/Discounts/CheckAvailability'
import Cookies from "js-cookie";
import axios from "axios";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
const ECommerce: React.FC = () => {
  const [dashboardDataDaly, setDashboardDataDaly] = useState<any>({});
  const [dashboardDataMonthly, setDashboardDataMonthly] = useState<any>({});
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs());
  const [dateStr, setDateStr] = React.useState<string>(selectedDate?.format('YYYY-MM-DD') || '');
  const [monthStr, setMonthStr] = React.useState<string>(selectedDate?.format('YYYY-MM') || '');
  

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      const formattedDate = newValue.format('YYYY-MM-DD');
      const formattedMonth = newValue.format('YYYY-MM');
      console.log("formattedMonthformattedMonthformattedMonth",formattedMonth)
      console.log(formattedDate); // You can store this value or perform other actions
      setSelectedDate(newValue);
      setDateStr(formattedDate)
      setMonthStr(formattedMonth)
    }
  };
  useEffect(() => {
    const fetchDashBoardData = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        const response = await axios.get(`${process.env.BE_URL}/dashboard/daily_report/${dateStr}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "x-api-key": process.env.X_API_KEY,
          },
        });

        setDashboardDataDaly(response?.data)
      } catch (err) {
        console.log(err)
      }
    }
    const fetchDashBoardDataMonthly = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        const response = await axios.get(`${process.env.BE_URL}/dashboard/monthly_report/${monthStr?.split("-")?.[0]}/${monthStr?.split("-")?.[1]}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "x-api-key": process.env.X_API_KEY,
          },
        });
        setDashboardDataMonthly(response?.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchDashBoardData()
    fetchDashBoardDataMonthly()
    const intervalId = setInterval(fetchDashBoardData, 3600000);
    return () => clearInterval(intervalId);
  }, [selectedDate])
  const chartData = {
    Booking_Status_Count: {
      Total_Bookings: 1,
      Completed: 0,
      Pending: 1,
      Failed: 0,
      Check_In_Count: 0,
      Check_Out_Count: 1
    },
    Guest_Count: {
      Total_Guests: 9,
      adults: 7,
      children: 2,
      infants: 0
    },
    Room_Availability: {
      Total_Available_Rooms: 24,
      Single: 7,
      Double: 5,
      Triple: 16,
      Deluxe: 2,
      Family: 16
    },
    Meal_Plan_Count: {
      breakfast: 0,
      lunch: 3,
      dinner: 3
    }
  };
  return (
    <>
      <CheckAvailability />
      {/* dashboard cards */}
      <h3 className="m-2 text-2xl font-bold text-black">
        Day Counts 
      </h3>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker 
          label="Search By Date"
          value={selectedDate}
          onChange={handleDateChange}
          format="YYYY-MM-DD"
        />
      </DemoContainer>
    </LocalizationProvider>
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-4 2xl:gap-7.5 mt-6">
      {Object.entries(dashboardDataDaly).map(([status, value] :any, key) => (
          <Card key={key} title={status}data={value || {}} > <Calendar /></Card>      
      ))}
      </div>
      
      <h3 className="m-2 text-2xl font-bold text-black">
        Monthly Counts
      </h3>
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-4 2xl:gap-7.5 mt-6">
        {Object.entries(dashboardDataMonthly).map(([status, value] :any, key) => (
          <Card key={key} title={status}data={value} > <Calendar /></Card>      
      ))}
      </div>
    </>
  );
};

export default ECommerce;
