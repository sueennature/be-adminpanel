"use client";
import React, { useState } from "react";
import axios from "axios";
import BookingRoom from "./BookingRoom";
import Cookies from "js-cookie";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { toast } from "react-toastify";
import RoomList from "./RoomList";
import CircularProgress from '@mui/material/CircularProgress';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import { useUserContext } from "@/hooks/useUserContext";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Single","Deluxe","Double","Family","Triple"
];

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const CheckAvailability = () => {
  const theme = useTheme();
  const today = dayjs();
  const tomorrow = dayjs().add(1, 'day');
  const [showBooking, setShowBooking] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("")
  const [selectedCheckIn, setSelectedCheckIn] = React.useState("")
  const [selectedCheckOut, setSelectedCheckOut] = React.useState("")
  const [selectedDiscountCode, setSelectedDiscountCode] = React.useState("")
  const [reponseData, setResponseData] = useState<any>();
  const [chekIn, setChekIn] = useState<Dayjs | null>(today); // Set today's date as default
  const [chekOut, setChekOut] = useState<Dayjs | null>(tomorrow); // Set tomorrow's date as default
  const [discountCode, setDiscountCode] = React.useState("");
  const [categories, setCategories] = React.useState("");
  const [views, setViews] = React.useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [personName, setPersonName] = React.useState<string[]>([]);
  const { groupFour } = useUserContext();
  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };


 const handleBooking = async () => {
    try {
      setIsLoading(true)
      const accessToken = Cookies.get("access_token");
      const queryParams = new URLSearchParams();
      personName?.forEach((category:any) => {
        queryParams.append('categories', category);
      });
      const queryString = queryParams.toString();
      const url = `${process.env.BE_URL}/rooms/availability/?check_in=${chekIn ? chekIn.toISOString() : ""}&check_out=${chekOut ? chekOut.toISOString() : ""}&views=${views}&discount_code=${discountCode}&${queryString}`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`, 
          "x-api-key": process.env.X_API_KEY,
        }
      });
      if(response?.status === 200){
        setSelectedRoom(categories)
        setSelectedCheckIn(chekIn?.toISOString() || "")
        setSelectedCheckOut(chekOut?.toISOString() || "")
        setSelectedDiscountCode(discountCode)
        setResponseData(response.data)
        setShowBooking(true);
        
      }else if(response?.status === 204){
        toast.error(`No available rooms found for the specified criteria`);
      }else{
        toast.error(`Internal server error`);
      }
      setIsLoading(false)
    } catch (error) {
      console.log("Error checking availability:", error);
    }
  };

  const handleGoBack = () => {
    setShowBooking(false);
  };

  return (
    <>
      {groupFour && (

    <div className="flex flex-col gap-2">
      <h3 className="m-2 text-2xl font-bold text-black">
        {showBooking ? "Book Your Room" : "Check the Room Availability"}
      </h3>
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <div className="p-6.5">
       
            <div className="mb-6.5 flex flex-col gap-2 xl:flex-row">
              <div className="w-full xl:w-1/4">
                <label className="mb-1 block text-sm font-medium text-black">
                  Check In
                </label>
                <div className="relative">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer 
                    sx={{
                      overflow: 'hidden', // Prevent any overflow in the container
                    }} 
                    components={['DateTimePicker', 'DateTimePicker']}>
                    <DateTimePicker
                      sx={{
                        '& .MuiInputBase-root': {
                          height: '40px', // Adjust height
                          width:'220px',
                          minHeight: 'unset', // Remove minimum height restriction
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '1rem', // Adjust icon size if needed
                        },
                      }}
                     
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
                <label className="mb-1 block text-sm font-medium text-black">
                  Check Out
                </label>
                <div className="relative">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer sx={{
                      overflow: 'hidden', // Prevent any overflow in the container
                    }} 
                    components={['DateTimePicker', 'DateTimePicker']}>
                    <DateTimePicker
                       sx={{
                        width: '200px', // Adjust width
                        '& .MuiInputBase-root': {
                          height: '40px', // Adjust height
                          width:'220px',
                          minHeight: 'unset', // Remove minimum height restriction
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '1rem', // Adjust icon size if needed
                        },
                      }}
                     
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
                {/* <select
                  name="categories"
                  value={categories}
                  onChange={(e)=>setCategories(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 text-xs py-3 text-black outline-none transition focus:border-primary active:border-primary"
                  required
                >
                  <option value="">Choose a room type</option>
                  <option value="Single">Single </option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Double">Double</option>
                  <option value="Family">Family</option>
                  <option value="Triple">Triple</option>
                </select> */}
                        <Select
                          labelId="demo-multiple-name-label"
                          id="demo-multiple-name"
                          multiple
                          value={personName}
                          onChange={handleChange}
                          input={<OutlinedInput label="Name" />}
                          MenuProps={MenuProps}
                          style={{width:150, height:40}}
                        >
                          {names.map((name:any) => (
                            <MenuItem
                              key={name}
                              value={name}
                              style={getStyles(name, personName, theme)}
                            >
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
              </div>

              <div className="w-full xl:w-1/6">
                <label className="mb-3 mt- block text-sm font-medium text-black">
                  Room View
                </label>
                <select
                  name="views"
                  value={views}
                  onChange={(e)=>setViews(e.target.value)}
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
                  value={discountCode}
                  onChange={(e)=>setDiscountCode(e.target.value)}
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
                   {isLoading ? <CircularProgress style={{color:"white", height:20, width:20}}/> : <svg className="h-5 w-5 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="4"  stroke-linecap="round"  stroke-linejoin="round">  <circle cx="11" cy="11" r="8" />  <line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>}
                </button>
              </div>
            </div>
         
          <RoomList rooms={reponseData?.rooms || []}/>
          {showBooking && (
            <BookingRoom isShow={handleGoBack} discountCode={selectedDiscountCode} room_type={selectedRoom} room_type_view={""} responseDatas={reponseData} checkIN={selectedCheckIn} checkOut={selectedCheckOut} />
          )}
        </div>
      </div>
    </div>
      )}
      </>
  );
};

export default CheckAvailability;
