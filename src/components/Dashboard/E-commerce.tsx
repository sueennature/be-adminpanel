"use client";
import React, { useEffect, useState } from "react";
import CardDataStats from "../CardDataStats";
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

        console.log("fetchDashBoardData", response)
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
        console.log("setDashboardDataMonthly", response)
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
  return (
    <>
      <CheckAvailability />
      {/* dashboard cards */}
      <h3 className="m-2 text-2xl font-bold text-black">
        Day Counts
      </h3>
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-4 2xl:gap-7.5 mt-6">
        <CardDataStats title={"Total Available Rooms"} total={String(dashboardDataDaly?.Total_Available_Rooms || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
        <CardDataStats title={"Total Bookings"} total={String(dashboardDataDaly?.Total_Guests || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
        <CardDataStats title={"Total Guests"} total={String(dashboardDataDaly?.Total_Guests || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>

        {/* Booking_Status_Count */}
        <CardDataStats title={"Completed Bookings"} total={String(dashboardDataDaly?.Booking_Status_Count?.completed || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
        <CardDataStats title={"failed Bookings"} total={String(dashboardDataDaly?.Booking_Status_Count?.failed || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
        <CardDataStats title={"pending Bookings"} total={String(dashboardDataDaly?.Booking_Status_Count?.pending || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>

        {/* Guest_Count */}
        <CardDataStats title={"adults"} total={String(dashboardDataDaly?.Guest_Count?.adults || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
        <CardDataStats title={"children"} total={String(dashboardDataDaly?.Guest_Count?.children || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
        <CardDataStats title={"infants"} total={String(dashboardDataDaly?.Guest_Count?.infants || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>

        {/* Meal_Plan_Count */}
        <CardDataStats title={"breakfast"} total={String(dashboardDataDaly?.Meal_Plan_Count?.breakfast || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
        <CardDataStats title={"dinner"} total={String(dashboardDataDaly?.Meal_Plan_Count?.dinner || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
        <CardDataStats title={"lunch"} total={String(dashboardDataDaly?.Meal_Plan_Count?.lunch || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>

        {/* Room_Availability */}
        <CardDataStats title={"Deluxe"} total={String(dashboardDataDaly?.Room_Availability?.Deluxe || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
        <CardDataStats title={"Double"} total={String(dashboardDataDaly?.Room_Availability?.Double || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
        <CardDataStats title={"Family"} total={String(dashboardDataDaly?.Room_Availability?.Family || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
        <CardDataStats title={"Single"} total={String(dashboardDataDaly?.Room_Availability?.Single || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
        <CardDataStats title={"Triple"} total={String(dashboardDataDaly?.Room_Availability?.Triple || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>

      </div>
      <h3 className="m-2 text-2xl font-bold text-black">
        Monthly Counts
      </h3>
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-4 2xl:gap-7.5 mt-6">
        <CardDataStats title={"Total Bookings"} total={String(dashboardDataMonthly?.Monthly_Total_Bookings || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
        <CardDataStats title={"Out Of Service Rooms"} total={String(dashboardDataMonthly?.Out_Of_Service_Rooms || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
        <CardDataStats title={"Total Rooms"} total={String(dashboardDataMonthly?.Total_Rooms || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>

        {/* Monthly_Booking_Status_Count */}
        <CardDataStats title={"Completed"} total={String(dashboardDataMonthly?.Monthly_Booking_Status_Count?.completed || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
        <CardDataStats title={"failed"} total={String(dashboardDataMonthly?.Monthly_Booking_Status_Count?.failed || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
        <CardDataStats title={"pending"} total={String(dashboardDataMonthly?.Monthly_Booking_Status_Count?.pending || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
      </div>

    </>
  );
};

export default ECommerce;
