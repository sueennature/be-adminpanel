"use client";
import React, { useEffect, useState } from "react";
import CardDataStats from "../CardDataStats";
import Card from "../dashboardCards/Card";
import { Calendar} from 'react-feather';
import CheckAvailability from '@/components/Discounts/CheckAvailability'
import Cookies from "js-cookie";
import axios from "axios";
const ECommerce: React.FC = () => {
  const [dashboardDataDaly, setDashboardDataDaly] = useState<any>({});
  const [dashboardDataMonthly, setDashboardDataMonthly] = useState<any>({});

  useEffect(() => {
    const fetchDashBoardData = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        const response = await axios.get(`${process.env.BE_URL}/dashboard/daily_report/`, {
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
        const response = await axios.get(`${process.env.BE_URL}/dashboard/monthly_report/`, {
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
  }, [])
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
