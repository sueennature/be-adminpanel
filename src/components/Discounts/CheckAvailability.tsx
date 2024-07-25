"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import flatpickr from "flatpickr";
import BookingRoom from "./BookingRoom";
import Cookies from "js-cookie";

const CheckAvailability = () => {
  const [formData, setFormData] = useState({
    check_in: "",
    check_out: "",
    category: "",
    view: "",
    discount_code: "",
  });
  
  const startDate = useRef<flatpickr.Instance | null>(null);
  const endDate = useRef<flatpickr.Instance | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("")
  const [selectedCheckIn, setSelectedCheckIn] = React.useState("")
  const [selectedCheckOut, setSelectedCheckOut] = React.useState("")
  const [selectedDiscountCode, setSelectedDiscountCode] = React.useState("")
  const [reponseData, setResponseData] = useState<boolean>(false);

  useEffect(() => {
    flatpickr("#check_in", {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      prevArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg className="fill-current" width="7" height="11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      onChange: (selectedDates) => {
        const date = selectedDates[0];
        const dateStr = new Date(date.setHours(14, 0, 0, 0)).toISOString(); // Set time to 14:00
        setFormData((prevData) => ({
          ...prevData,
          check_in: dateStr,
        }));
      },
    });
  
    flatpickr("#check_out", {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      prevArrow:
        '<svg className="fill-current" width="7" height="11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg className="fill-current" width="7" height="11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      onChange: (selectedDates) => {
        const date = selectedDates[0];
        const dateStr = new Date(date.setHours(12, 0, 0, 0)).toISOString(); // Set time to 12:00
        setFormData((prevData) => ({
          ...prevData,
          check_out: dateStr,
        }));
      },
    });
  
    // Cleanup flatpickr instances on unmount
    return () => {
      if (startDate.current) {
        startDate.current.destroy();
      }
      if (endDate.current) {
        endDate.current.destroy();
      }
    };
  }, []);
  
  
 const handleBooking = async () => {
    try {
      const accessToken = Cookies.get("access_token");
  
      // Convert formData to query parameters
      const queryParams = new URLSearchParams(formData).toString();
  
      // Construct the URL with query parameters
      const url = `${process.env.BE_URL}/rooms/availability/?${queryParams}`;
  
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`, 
          "x-api-key": process.env.X_API_KEY,
        }
      });
  
      setSelectedRoom(formData.category)
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

// const handleBooking = async () => {
//   try {
//     const accessToken = Cookies.get("access_token");
//     console.log("Access Token:", accessToken);
//     console.log("Backend URL:", process.env.BE_URL);
//     console.log("Form Data:", formData);

//     const response = await axios.post(`${process.env.BE_URL}/rooms/availability`, formData, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${accessToken}`, 
//         "x-api-key": process.env.X_API_KEY,
//       }
//     });

//     console.log("Response Data:", response.data);
//     setShowBooking(true);
//   } catch (error) {
//     console.log("Error checking availability:", error.response || error.message);
//   }
// };

  // const handleBooking = async (e:any) => {
  //   e.preventDefault();
  //   console.log(formData);
  //   const response = await fetch("/api/checkroom", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(formData),
  //   });

  // console.log(response)
  // };
  const handleGoBack = () => {
    setShowBooking(false);
  };

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="m-2 text-2xl text-black">
        {showBooking ? "Book Your Room" : "Check the Room Availability"}
      </h3>
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <div className="p-6.5">
          {!showBooking && (
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/6">
                <label className="mb-3 block text-sm font-medium text-black">
                  Check In
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="check_in"
                    name="check_in"
                    value={formData.check_in}
                    onChange={handleChange}
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                    placeholder="mm/dd/yyyy"
                    required
                    data-class="flatpickr-right"
                  />
                  <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
                    <svg
                      width="18"
                      height="18"
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

              <div className="w-full xl:w-1/6">
                <label className="mb-3 block text-sm font-medium text-black">
                  Check Out
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="check_out"
                    name="check_out"
                    value={formData.check_out}
                    onChange={handleChange}
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                    placeholder="mm/dd/yyyy"
                    required
                    data-class="flatpickr-right"
                  />
                  <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
                    <svg
                      width="18"
                      height="18"
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

              <div className="w-full xl:w-1/6">
                <label className="mb-3 block text-sm font-medium text-black">
                  Room Type
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
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
                <label className="mb-3 block text-sm font-medium text-black">
                  Room View
                </label>
                <select
                  name="view"
                  value={formData.view}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
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
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div className="w-full xl:w-1/6">
                <button
                  type="button"
                  onClick={handleBooking}
                  className="flex w-full relative top-8 justify-center rounded bg-primary p-3 font-medium text-gray"
                >
                  Check Availability
                </button>
              </div>
            </div>
          )}

          {showBooking && (
            <BookingRoom isShow={handleGoBack} discountCode={selectedDiscountCode} room_type={selectedRoom} room_type_view={""} responseDatas={reponseData} checkIN={selectedCheckIn} checkOut={selectedCheckOut} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckAvailability;
