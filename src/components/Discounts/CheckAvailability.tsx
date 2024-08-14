"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import flatpickr from "flatpickr";
import BookingRoom from "./BookingRoom";
import Cookies from "js-cookie";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';

const CheckAvailability = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("")
  const [selectedCheckIn, setSelectedCheckIn] = React.useState("")
  const [selectedCheckOut, setSelectedCheckOut] = React.useState("")
  const [selectedDiscountCode, setSelectedDiscountCode] = React.useState("")
  const [reponseData, setResponseData] = useState<boolean>(false);

  const [chekIn, setChekIn] = React.useState<Dayjs | null>(dayjs());
  const [chekOut, setChekOut] = React.useState<Dayjs | null>(dayjs());
  const [formData, setFormData] = useState({
    check_in: chekIn ? chekIn.toISOString() : "",
    check_out: chekOut ? chekOut.toISOString() : "",
    categories: "",
    views: "",
    discount_code: "",
  });
  console.log("formDataformDataformData",formData)

  

  
 const handleBooking = async () => {
    try {
      const accessToken = Cookies.get("access_token");
      const queryParams = new URLSearchParams(formData).toString();
      const url = `${process.env.BE_URL}/rooms/availability/?${queryParams}`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`, 
          "x-api-key": process.env.X_API_KEY,
        }
      });
  
      setSelectedRoom(formData.categories)
      setSelectedCheckIn(formData.check_in)
      setSelectedCheckOut(formData.check_out)
      setSelectedDiscountCode(formData.discount_code)
      setResponseData(response.data)
      console.log(response.data);
      setShowBooking(true);
    } catch (error) {
      console.log("Error checking availability:", error);
    }
  };

  const handleGoBack = () => {
    setShowBooking(false);
  };

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    console.log("name, value",name, value)
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="m-2 text-2xl font-bold text-black">
        {showBooking ? "Book Your Room" : "Check the Room Availability"}
      </h3>
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <div className="p-6.5">
       
            <div className="mb-6.5 flex flex-col gap-2 xl:flex-row">
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Check In
                </label>
                <div className="relative">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                    <DateTimePicker
                        
                      label="Check In"
                      value={chekIn}
                      onChange={(newValue) => setChekIn(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                  
                  <div className="pointer-events-none absolute inset-0 left-auto right-2 flex items-center">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.0002 12.8249C8.83145 12.8249 8.69082 12.7687 8.5502 12.6562L2.08145 6.2999C1.82832 6.04678 1.82832 5.65303 2.08145 5.3999C2.33457 5.14678 2.72832 5.14678 2.98145 5.3999L9.0002 11.278L15.0189 5.34365C15.2721 5.09053 15.6658 5.09053 15.9189 5.34365C16.1721 5.59678 16.1721 5.99053 15.9189 6.24365L9.45019 12.5999C9.30957 12.7405 9.16895 12.8249 9.0002 12.8249Z"
                        fill="#64748B"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Check Out
                </label>
                <div className="relative">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                    <DateTimePicker
                      label="Check Out"
                      value={chekOut}
                      onChange={(newValue) => setChekOut(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                  <div className="pointer-events-none absolute inset-0 left-auto right-2 flex items-center">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.0002 12.8249C8.83145 12.8249 8.69082 12.7687 8.5502 12.6562L2.08145 6.2999C1.82832 6.04678 1.82832 5.65303 2.08145 5.3999C2.33457 5.14678 2.72832 5.14678 2.98145 5.3999L9.0002 11.278L15.0189 5.34365C15.2721 5.09053 15.6658 5.09053 15.9189 5.34365C16.1721 5.59678 16.1721 5.99053 15.9189 6.24365L9.45019 12.5999C9.30957 12.7405 9.16895 12.8249 9.0002 12.8249Z"
                        fill="#64748B"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-sm font-medium text-black">
                  Room Type
                </label>
                <select
                  name="categories"
                  value={formData.categories}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 text-xs py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  required
                >
                  <option value="">Choose a room type</option>
                  <option value="Single">Single </option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Double">Double</option>
                  <option value="Family">Family</option>
                  <option value="Triple">Triple</option>
                </select>
              </div>

              <div className="w-full xl:w-1/6">
                <label className="mb-3 mt- block text-sm font-medium text-black">
                  Room View
                </label>
                <select
                  name="views"
                  value={formData.views}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 text-xs py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  required
                >
                  <option value="">Choose a room view</option>
                  <option value="LAKE">LAKE</option>
                  <option value="MOUNTAIN">MOUNTAIN</option>
          
                </select>
              </div>

              <div className="w-full xl:w-1/6">
                <label className="mb-3 block text-sm font-medium text-black">
                  Discount Code
                </label>
                <input
                  type="text"
                  name="discount_code"
                  value={formData.discount_code}
                  onChange={handleChange}
                  placeholder="Enter code"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 text-xs py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div className="w-full xl:w-1/6">
                <button
                  type="button"
                  onClick={handleBooking}
                  className="flex w-full relative text-nowrap top-8 justify-center rounded bg-primary p-3 text-xs font-medium text-gray"
                >
                  Check Availability
                </button>
              </div>
            </div>
         

          {showBooking && (
            <BookingRoom isShow={handleGoBack} discountCode={selectedDiscountCode} room_type={selectedRoom} room_type_view={""} responseDatas={reponseData} checkIN={selectedCheckIn} checkOut={selectedCheckOut} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckAvailability;
