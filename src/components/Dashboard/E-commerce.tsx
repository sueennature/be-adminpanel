"use client";
import dynamic from "next/dynamic";
import React ,{useEffect, useState} from "react";
import CardDataStats from "../CardDataStats";
import { Calendar, ArrowLeftCircle, ArrowRightCircle } from 'react-feather';
import DatePicker from "../Datepicker";
import ReservationChart from "../BarChart";
import AvailableRoomsProgressBar from "../AvailableRoomsProgressBar";
import SoldRoomsProgressBar from "../SoldRoomsProgressBar";
import CheckAvailability from '@/components/Discounts/CheckAvailability'

import Cookies from "js-cookie";
import axios from "axios";


const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});


const totalRooms = 26; // Replace with your actual total room count
const ECommerce: React.FC = () => {


 
  const [totalbookings, settotalbookings] = React.useState<any>({});
  const [totalrooms, settotalrooms] = React.useState<any>({});
  const [checkin, setcheckin] = React.useState<any>({});
  const [checkout, setcheckout] = React.useState<any>({});
  const [availableroomtoday, setavailableroomtoday] = React.useState<any>({});

  const fetchTotalTookings = async() => {
    try{
      const accessToken = Cookies.get("access_token");
      const response = await axios.get(`${process.env.BE_URL}/dashboard/total_bookings`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });
      
     // console.log("response?.data",response)
      console.log("fetchTotalTookings",response?.data?.Booking_Count )
      settotalbookings(response?.data?.Booking_Count )
    }catch(err){
      console.log(err)
    }
  }
  const fetchTotalTotalRooms = async() => {
    try{
      const accessToken = Cookies.get("access_token");
      const response = await axios.get(`${process.env.BE_URL}/dashboard/total_rooms`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });
      
     // console.log("response?.data",response)
      console.log("fetchTotalTotalRooms",response )
      settotalrooms(response?.data?.Rooms_Count)
    }catch(err){
      console.log(err)
    }
  }
  const fetchTotalCheckIn = async() => {
    try{
      const accessToken = Cookies.get("access_token");
      const response = await axios.get(`${process.env.BE_URL}/dashboard/check_in`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });
      
     // console.log("response?.data",response)
      console.log("fetchTotalCheckIn",response )
      setcheckin(response?.data?.Number_of_Checkin)
    }catch(err){
      console.log(err)
    }
  }

  const fetchTotalCheckOut = async() => {
    try{
      const accessToken = Cookies.get("access_token");
      const response = await axios.get(`${process.env.BE_URL}/dashboard/check_out`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });
      
     // console.log("response?.data",response)
      console.log("fetchTotalCheckOut",response?.data )
      setcheckout(response?.data?.Number_of_Checkout)
    }catch(err){
      console.log(err)
    }
  }

  const fetchTotalAvailableRoomToday = async() => {
    try{
      const accessToken = Cookies.get("access_token");
      const response = await axios.get(`${process.env.BE_URL}/dashboard/available_room_today`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });
      
     // console.log("response?.data",response)
      console.log("fetchTotalAvailableRoomToday",response )
      setavailableroomtoday(response?.data?.Available_rooms)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    fetchTotalTookings()
    fetchTotalCheckOut()
    fetchTotalCheckIn()
    fetchTotalTotalRooms()
    fetchTotalAvailableRoomToday()
  },[])
  return (
    <>
      <CheckAvailability />

      {/* dashboard cards */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-4 2xl:gap-7.5 mt-6">
        <CardDataStats title={"Total Bookings"} total={String(totalbookings || 0)} rate={""}  >
          <Calendar />
        </CardDataStats>
        <CardDataStats title="Check Out" total={String(checkout || 0)} rate={""}  >
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12.5 7c0-1.11.89-2 2-2H18c1.1 0 2 .9 2 2v2.16c-1.16.41-2 1.51-2 2.81V14h-5.5zM6 11.96V14h5.5V7c0-1.11-.89-2-2-2H6c-1.1 0-2 .9-2 2v2.15c1.16.41 2 1.52 2 2.81m14.66-1.93c-.98.16-1.66 1.09-1.66 2.09V15H5v-3a2 2 0 1 0-4 0v5c0 1.1.9 2 2 2v2h2v-2h14v2h2v-2c1.1 0 2-.9 2-2v-5c0-1.21-1.09-2.18-2.34-1.97" /></svg>
        </CardDataStats>
        <CardDataStats title="Check In" total={String(checkin || 0)} rate={""}  >
          <ArrowRightCircle />
        </CardDataStats>
        <CardDataStats title="Available Rooms"total={String(availableroomtoday || 0)} rate={""}  >
          <ArrowLeftCircle />
        </CardDataStats>
        <CardDataStats title="Rooms Count"total={String(totalRooms || 0)} rate={""}  >
          <ArrowLeftCircle />
        </CardDataStats>
      </div>

      {/* <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">

        <DatePicker />
        <div className="grid grid-cols-1 xl:grid-rows-2 gap-4 md:gap-6 2xl:gap-6">
          <ReservationChart />
          <div className="row-span-4 flex lg:flex-row flex-col justify-between gap-2">
            <div className="rounded-md border-none w-full bg-blue-950 p-6 shadow-default xl:items-center xl:flex">
              <AvailableRoomsProgressBar totalRooms={totalRooms} />
            </div>
            <div className="rounded-md w-full border-none bg-blue-950 p-6 shadow-default xl:items-center xl:flex">
              <SoldRoomsProgressBar totalRooms={totalRooms} />

            </div>

          </div>
        </div>

    
      </div> */}
    </>
  );
};

export default ECommerce;
