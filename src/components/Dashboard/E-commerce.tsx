"use client";
import dynamic from "next/dynamic";
import React from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
import { Calendar, Clock, Plus, ArrowLeftCircle, ArrowRightCircle  } from 'react-feather';
import DatePicker from "../Datepicker";
import ReservationChart from "../BarChart";
import AvailableRoomsProgressBar from "../AvailableRoomsProgressBar";
import SoldRoomsProgressBar from "../SoldRoomsProgressBar";
import CheckAvailability from '@/components/Discounts/CheckAvailability'



const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});
const totalRooms = 26; // Replace with your actual total room count
const ECommerce: React.FC = () => {
  return (
    <>
    <CheckAvailability/>

       {/* dashboard cards */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-4 2xl:gap-7.5 mt-6">
        <CardDataStats title="New Bookings" total="500" rate={""}  >
         <Calendar/>
        </CardDataStats>
        <CardDataStats title="New Rooms" total="500" rate={""}  >
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12.5 7c0-1.11.89-2 2-2H18c1.1 0 2 .9 2 2v2.16c-1.16.41-2 1.51-2 2.81V14h-5.5zM6 11.96V14h5.5V7c0-1.11-.89-2-2-2H6c-1.1 0-2 .9-2 2v2.15c1.16.41 2 1.52 2 2.81m14.66-1.93c-.98.16-1.66 1.09-1.66 2.09V15H5v-3a2 2 0 1 0-4 0v5c0 1.1.9 2 2 2v2h2v-2h14v2h2v-2c1.1 0 2-.9 2-2v-5c0-1.21-1.09-2.18-2.34-1.97"/></svg>
        </CardDataStats>
        <CardDataStats title="Check In" total="500" rate={""}  >
         <ArrowRightCircle/>
        </CardDataStats>
        <CardDataStats title="Check Out" total="500" rate={""}  >
         <ArrowLeftCircle/>
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          
      <DatePicker/> 
      <div className="grid grid-cols-1 xl:grid-rows-2 gap-4 md:gap-6 2xl:gap-6">
      <ReservationChart/>
      <div className="row-span-4 flex lg:flex-row flex-col justify-between gap-2">
        <div className="rounded-md border-none w-full bg-blue-950 p-6 shadow-default xl:items-center xl:flex">
                <AvailableRoomsProgressBar totalRooms={totalRooms}/>
        </div>
        <div className="rounded-md w-full border-none bg-blue-950 p-6 shadow-default xl:items-center xl:flex">
               <SoldRoomsProgressBar totalRooms={totalRooms}/>
          
        </div>

      </div>
      </div>
      
        {/* <ChartTwo />
        
        <MapOne /> */}
        {/* <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard /> */}
      </div>
    </>
  );
};

export default ECommerce;
