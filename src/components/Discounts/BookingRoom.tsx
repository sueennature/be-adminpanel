"use client";
import React, { useEffect, useState } from "react";
import CreateGuestBooking from "./CreateGuestBooking";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import axios from "axios";
interface AgentInfo {
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
  telephone: string;
  address: string;
}
interface BookingRoomData {
  room_type: any;
  room_type_view: string;
  isShow: any;
  responseDatas :any;
  checkIN: any;
  checkOut : any;
  discountCode: any;
}
interface Room {
  room_id: number;
  category: string;
  adults: number;
  child: number[];
  infants: number[];
  meal_plan: string;
  view: string;
}

interface FormData {
  rooms: Room[];
}

const BookingRoom: React.FC<BookingRoomData> = ({
  room_type,
  room_type_view,
  isShow,
  responseDatas,
  checkIN,
  checkOut,
  discountCode
}) => {


  const [numRooms, setNumRooms] = useState<number>(0);
  const [adultsPerRoom, setAdultsPerRoom] = useState<number[]>([]);
  const [childrenPerRoom, setChildrenPerRoom] = useState<number[]>([]);
  const [childrenAgesPerRoom, setChildrenAgesPerRoom] = useState<number[][]>([],);
  const [taxes, setTaxes] = useState([]);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [mealPlans, setMealPlans] = useState<any>([]);
  const [mealPlanCosts, setMealPlanCosts] = useState(new Array(responseDatas?.rooms?.length).fill(0));
  const [infantsPerRoom, setInfantsPerRoom] = useState<number[]>([]);
  const [infantAgesPerRoom, setInfantAgesPerRoom] = useState<number[][]>([]);
  
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [totalActivityPrice, setTotalActivityPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [partialAmount, setPartialAmount] = useState<number>(0);
  const [rooms, setRooms] = useState<any>([]);
  const [requestRoom, setRequestRoom] = useState<any>([]);
  const [activities, setActivities] = useState<any>([]);
  const [bookings, setBookings] = useState<any>([]);
  const [rates, setRates] = useState<any>({});
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(5);
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [numRecords, setNumRecords] = React.useState<number>(0);

  const [agentInfo, setAgentInfo] = useState<AgentInfo>({
    firstName: '',
    lastName: '',
    email: '',
    nationality: '',
    telephone: '',
    address: ''
  });

  const [guestInfo, setGuestInfo] = useState<AgentInfo>({
    firstName: '',
    lastName: '',
    email: '',
    nationality: '',
    telephone: '',
    address: ''
  });



  console.log('responseDatas:', responseDatas);
  console.log('numRooms:', numRooms);
  console.log('adultsPerRoom:', adultsPerRoom);
  console.log('childrenPerRoom:', childrenPerRoom);
  console.log('childrenAgesPerRoom:', childrenAgesPerRoom);
  console.log('taxes:', taxes);
  console.log('totalDiscount:', totalDiscount);
  console.log('mealPlans:', mealPlans);
  console.log('infantsPerRoom:', infantsPerRoom);
  console.log('infantAgesPerRoom:', infantAgesPerRoom);
  console.log('isChecked:', isChecked);
  console.log('totalActivityPrice:', totalActivityPrice);
  console.log('paymentMethod:', paymentMethod);
  console.log('partialAmount:', partialAmount);
  console.log('rooms:', rooms);
  console.log('requestRoom:', requestRoom);
  console.log('activities:', activities);
  console.log('agentInfo:', agentInfo);
  console.log('guestInfo:', guestInfo);

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };


    const nextPage = () => {
    setCurrentPage((prev) => prev + itemsPerPage);
  };

  const prevPage = () => {
    setCurrentPage((prev) => prev - itemsPerPage);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAgentInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleChangeGuest = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGuestInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(event.target.value);
  };
  

  

  function convertActivities(activities: any) {
    return activities.map((activity:any) => ({
        activity_id: activity?.id,
        activity_name: activity?.name
    }));
}


  const handleSelectActivities = (activity: any) => {
    try {
      let temp = [...activities];
      let find = temp?.find((obj) => obj?.id === activity?.id);
      if (!find) {
        setActivities((prev: any) => [...prev, activity]);
      } else {
        setActivities((prev: any) => prev?.filter((obj: any) => obj?.id !== activity?.id));
      }
  
    } catch (err) {
      console.error(err);
    }
  };
  const handleUpdateMealPlan = (event:any, id:any) =>{
    try{
      const val = event.target.value
      const txt = val?.split("|")?.[1]
      const amount = val?.split("|")?.[0]
      setRequestRoom((prev:any) =>
        prev?.map((item:any) =>
          item?.room_id === id ? { ...item, meal_plan:txt, meal_plan_amount : parseInt(amount || 0) } : item
        )
      );
    }catch(err){
      console.log(err)
    }
  }

  const handleUpdateAdults = (event:any, id:any) =>{
    try{
      const val = event.target.value
      setRequestRoom((prev:any) =>
        prev?.map((item:any) =>
          item?.room_id === id ? { ...item, adults:parseInt(val || 0) } : item
        )
      );
    }catch(err){
      console.log(err)
    }
  }

  const handleUpdateChildren = (event:any, id:any) =>{
    try{
      const val = parseInt(event.target.value || 0)
      const arr = Array(val).fill(5);
      setRequestRoom((prev:any) =>
        prev?.map((item:any) =>
          item?.room_id === id ? { ...item, child:arr || [] } : item
        )
      );
    }catch(err){
      console.log(err)
    }
  }

  const handleUpdateInfants = (event:any, id:any) =>{
    try{
      const val = event.target.value
      setRequestRoom((prev:any) =>
        prev?.map((item:any) =>
          item?.room_id === id ? { ...item, infants:[parseInt(val || 0)] } : item
        )
      );
    }catch(err){
      console.log(err)
    }
  }

  
  const handleChildAgeChange = (
    roomIndex: number,
    childIndex: number,
    value: number,
  ) => {
    const updatedAges = [...childrenAgesPerRoom];
    updatedAges[roomIndex][childIndex] = value;
    setChildrenAgesPerRoom(updatedAges);
  };

  const handleInfantAgeChange = (
    roomIndex: number,
    infantIndex: number,
    value: number,
  ) => {
    const updatedAges = [...infantAgesPerRoom];
    updatedAges[roomIndex][infantIndex] = value;
    setInfantAgesPerRoom(updatedAges);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  function getFirstElements(arr:any, n:any) {
    return arr?.slice(0, n);
  }

  function timestampToDate(timestamp : Date) {
    // Create a new Date object from the timestamp
    const date = new Date(timestamp);

    // Extract the year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');

    // Format the date as YYYY-MM-DD
    return `${year}-${month}-${day}`;

  }
  const handleAddRoom = (event:any) =>{
    try{
      const selectedId = parseInt(event.target.value, 10);
      const selectedRoom = getFirstElements(responseDatas.rooms, selectedId)
      console.log("Selected room object:", selectedRoom);
      let arr:any = []
      selectedRoom?.map((val:any)=>{
        let t = {
          "room_id": val?.id,
          "category": val?.category,
          "view": val?.view,
          "adults": 0,
          "child": [
            0
          ],
          "infants": [
            0
          ],
          "meal_plan": ""
        }
        arr.push(t);
      })
      console.log("arr",arr)
      setRequestRoom(arr)
      setRooms(selectedRoom)
    }catch(err){
      console.log(err)
    }
  }

  const getrates = async() => {
    try{
      const requestBody ={
        "check_in": checkIN,
        "check_out": checkOut,
        "rooms": await requestRoom.map((room: any) => ({
          room_id: room.room_id,
          adults: room.adults,
          children: room.child,
          infants: room.infants,
          meal_plan: room.meal_plan
        })),
        "activities": await activities?.map((activity:any) => ({ activity_id: activity?.id })),
        "taxes": await responseDatas?.taxes?.map((tax:any) => ({ tax_id: tax?.id })),
        "discounts": await responseDatas?.discounts?.map((discount:any) => ({ discount_id: discount?.id })),
        //"discount_code": discountCode || null
        "discount_code": "SUMMER21"
      }
      console.log("getrates",requestBody)
      const accessToken =  await Cookies.get("access_token");
      const response = await axios.post(`${process.env.BE_URL}/rooms/get-rates/`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });
      setRates(response?.data || {})
     console.log("gettrace",response)
  
    }catch(err){
      console.log(err)
    }
  }
  
    const handelProceedToPay = async() => {
      try{
        const requestBody ={
          "check_in": checkIN,
          "check_out": checkOut,
          "booking_type": "internal",
          "payment_method": "walk-in guest",
          "total_amount": (parseFloat(rates?.total_activities_amount || 0) + parseFloat(rates?.total_amount || 0) + parseFloat(rates?.total_meal_plan_amount || 0) + parseFloat(rates?.total_rooms_amount || 0) + parseFloat(rates?.total_tax_amount || 0)) - (parseFloat(rates?.total_discount_amount || 0)),
          "is_partial_payment": isChecked || false,
          "paid_amount": partialAmount,
          "discount_code": discountCode || "",
          "guest_info": {
            "first_name": guestInfo?.firstName,
            "last_name":guestInfo?.lastName,
            "email": guestInfo?.email,
            "telephone": guestInfo?.telephone,
            "address": guestInfo?.address,
            "nationality": guestInfo?.nationality,
            "profile_image": [],
            "identification_type": "NIC",
            "identification_no": "1111111111",
            "identification_issue_date": "2024-08-03T08:30:00.000Z",
            "dob": "2024-08-03T08:30:00.000Z",
            "gender": "Male"
          },
          "rooms": requestRoom || [],
          "activities": convertActivities(activities || []) || [],
          "agent_info": {
            "first_name": agentInfo?.firstName || "",
            "last_name":agentInfo?.lastName || "",
            "email": agentInfo?.email || "",
            "telephone": agentInfo?.telephone || "",
            "address": agentInfo?.address || "",
            "nationality":agentInfo?.address || "",
          },
          "total_taxes": rates?.total_tax_amount,
          "total_rooms_charge": rates?.total_rooms_amount,
          "total_activities_charge": rates?.total_activities_amount,
          "total_discount_amount": rates?.total_discount_amount,
        }
        const accessToken = Cookies.get("access_token");
        const response = await axios.post(`${process.env.BE_URL}/bookings/internal`, requestBody, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "x-api-key": process.env.X_API_KEY,
          },
        });
        if(response?.status === 200){
          fetchBookings();
          toast.success(`Successfully Added!`);
        }else{
          toast.error("Something went wrong");
        }
      }catch(err){
  
      }
    }


    const fetchBookings = async() =>{
      try{
        const accessToken = Cookies.get("access_token");
        const response = await axios.get(`${process.env.BE_URL}/bookings/?skip=${currentPage}&limit=${itemsPerPage}`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "x-api-key": process.env.X_API_KEY,
          },
        });
        console.log("fetchBookings",`${process.env.BE_URL}/bookings/?skip=${currentPage}&limit=${itemsPerPage}`)
        console.log("response?.data",response)
        setBookings(response?.data?.bookings || [])
        setNumRecords(response?.data?.total_records)
      }catch(err){
        console.log(err)
      }
    }
  useEffect(() => {
    fetchBookings();
  }, [itemsPerPage, currentPage]);

  useEffect(() => {
    getrates()
  }, [partialAmount, activities, checkIN, checkOut, requestRoom ]);

  

  return (
    <div className="mx-auto w-full px-4">
      <div className="pb-6">
        <div className="mb-2 text-xl font-bold text-black">
          Selected Room Category : {room_type}
        </div>
        <div className="mb-6 text-xl font-bold text-black">
          {room_type_view}
        </div>
        {/* Meal Plan Info and Discount */}
        <div className="flex flex-col items-start justify-center gap-4 lg:flex-row">
          <div className=" mb-12 w-full rounded-md bg-slate-300 p-3 shadow-md shadow-black/50 lg:w-[50%]">
            <h4 className="ml-3 text-xl font-bold text-black">Special Rate</h4>
            {responseDatas?.discounts?.map((discount: any, index: any) => (
              <div
                key={index}
                className="flex w-full items-center justify-between p-3 lg:flex-row"
              >
                <div>
                  <label
                    htmlFor={`checkboxLabel${index}`}
                    className="flex cursor-pointer select-none items-center text-black"
                  >
                    <div className="relative"></div>
                    {discount?.name}{" "}
                    <span className="ml-2">
                      <strong>
                        ( {formatDate(discount?.start_date)}-{" "}
                        {formatDate(discount?.end_date)} )
                      </strong>{" "}
                    </span>
                  </label>
                </div>
                <div className="font-bold text-black">
                  {discount?.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Actiivities */}
        <div className="mb-12 mt-1 w-full rounded-md p-3 shadow-md shadow-black/50 lg:w-[50%] ">
          <h4 className="ml-3 text-xl font-bold text-black">
            Select Activities
          </h4>
          {responseDatas?.activities?.map((activity: any, index: any) => (
            <div
              key={index}
              className="flex w-full items-center justify-between p-3 lg:flex-row"
            >
              <div>
                <label
                  htmlFor={`checkboxLabel${index}`}
                  className="flex cursor-pointer select-none items-center text-black"
                >
                  {}
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={`checkboxLabel${index}`}
                      className="sr-only"
                      checked={!!activities?.find((obj:any) => obj?.id === activity?.id)}
                      onChange={() => handleSelectActivities(activity)}
                    />
                    <div
                      className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                        !!activities?.find((obj:any) => obj?.id === activity?.id)
                          ? "border-primary bg-gray dark:bg-transparent"
                          : ""
                      }`}
                    >
                      <span
                        className={`opacity-0 ${!!activities?.find((obj:any) => obj?.id === activity?.id) ? "!opacity-100" : ""}`}
                      >
                        <svg
                          width="11"
                          height="8"
                          viewBox="0 0 11 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                            fill="#3056D3"
                            stroke="#3056D3"
                            strokeWidth="0.4"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                  {activity?.name}
                </label>
              </div>
              <div className="font-bold text-black">
                {activity?.price?.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        <div className="mb-6.5 flex flex-col gap-6">
          <div className="w-full xl:w-1/2">
            <div>
              <label
                htmlFor="checkboxLabelOne"
                className="flex cursor-pointer select-none items-center"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    id="checkboxLabelOne"
                    className="sr-only"
                    onChange={() => {
                      setIsChecked(!isChecked);
                    }}
                  />
                  <div
                    className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                      isChecked && "border-primary bg-gray dark:bg-transparent"
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-sm ${isChecked && "bg-primary"}`}
                    ></span>
                  </div>
                </div>
                Partial Amount
              </label>
              {isChecked && (
                <input
                  type="text"
                  name="partial_amount"
                  required
                  placeholder="Partial Amount"
                  value={partialAmount}
                  style={{ marginTop: 20 }}
                  onChange={(e) => {
                    setPartialAmount(parseInt(e.target.value));
                  }}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              )}
            </div>
          </div>

          <div className="w-full xl:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black">
              Payment Method
            </label>
            <select
              name="category"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
            >
              <option value="">Select a payment method</option>
              <option value="online">Online </option>
              <option value="physical">Physical</option>
            </select>
          </div>
        </div>

        <div className="mb-4 mt-4 flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="w-full xl:w-1/5">
              <label
                htmlFor="roomNumber"
                className="mb-2 block text-xl font-medium text-black"
              >
                Rooms
              </label>
              <select
                id="roomNumber"
                required
                onChange={(e) => {
                  handleAddRoom(e);
                }}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              >
                <option value="">Choose a number of rooms</option>
                {responseDatas?.rooms?.map((val: any, index: any) => {
                  return (
                    <option key={index} value={index + 1}>
                      {index + 1}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <h3 className="text-xl font-medium text-black">Selected Rooms</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {rooms?.map((room: any, index: any) => (
                  <div
                    key={room.id}
                    className="bg-gray-100 flex h-[40px] w-12 items-center justify-center rounded border p-2"
                  >
                    {room.room_number}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className=" flex flex-col gap-6 lg:flex-row">
            {rooms?.map((room: any, index: any) => (
              <div key={room.id} className="w-full">
                <div className="mb-2 flex items-center">
                  <div className="bg-gray-100 mr-2 flex h-[40px] w-12 items-center justify-center rounded border p-2">
                    {room.room_number}
                  </div>

                  {/* Other components here */}
                </div>

                <div>
                  <label className="mb-2 block text-xl font-medium text-black">
                    Meal Plan per Room
                  </label>
                  <select
                    className="rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                    onChange={(e) => {
                      handleUpdateMealPlan(e, room.id);
                    }}
                  >
                    <option value={""}>Select Meal Plan</option>
                    <option value={`${room["room_only"]}|room_only`}>Room Only</option>
                    <option value={`${room["bread_breakfast"]}|bread_breakfast`}>Bread & Breakfast</option>
                    <option value={`${room["half_board"]}|half_board`}>Half Board</option>
                    <option value={`${room["full_board"]}|full_board`}>Full Board</option>
                  </select>
                  <div className="ml-2 text-black">
                    {mealPlanCosts[index] ? `RS ${mealPlanCosts[index]}` : ""}
                  </div>
                </div>
                <div>
                <label className="mb-2 block text-xl  font-medium text-black"> Adults per Room  </label>
                <select
                  onChange={(e) =>
                    handleUpdateAdults(e, room?.id)
                  }
                  className="rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option>0</option>
                  {Array?.from({ length: room?.max_adults || 0 }, (_, i) => i + 1)?.map((num)=>{
                    return <option>{num}</option>
                  })}
                  
                </select>
                </div>
                {room?.category != "Single" && <div>
                <label className="mb-2 block text-xl  font-medium text-black"> Children per Room  </label>
                <select
                  onChange={(e) =>
                    handleUpdateChildren(e, room?.id)
                  }
                  className="rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option>0</option>
                  {Array?.from({ length: room?.max_childs || 0 }, (_, i) => i + 1)?.map((num)=>{
                    return <option>{num}</option>
                  })}
                  
                </select>
                </div>}
                {room?.category != "Single" && <div>
                <label className="mb-2 block text-xl  font-medium text-black"> Infants per Room  </label>
                <select
                  onChange={(e) =>
                    handleUpdateInfants(e, room?.id)
                  }
                  className="rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option>0</option>
                  {Array?.from({ length: room?.max_childs || 0 }, (_, i) => i + 1)?.map((num)=>{
                    return <option>{num}</option>
                  })}
                  
                </select>
                </div>}
              </div>
            ))}
          </div>

          {/* 
    {selectedRooms > 0 && (
      <div className=" flex flex-col gap-6 lg:flex-row ">
          {responseDatas?.rooms.slice(0, selectedRooms).map((room :any, index:any) => (
              <div key={room.id} className="w-full ">
                <div className="mb-2 flex flex-col items-start">
                <label className="mb-2 block text-xl  font-medium text-black">
                Meal Plan per Room
                </label>
                  <select
                    className="rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                    onChange={(e) => {
                      handleMealPlanChange(index, e.target.value)
                      handleUpdateMealPlan(e.target.value)
                    }}
                  >
                    <option value="">Select Meal Plan</option>
                    <option value="room_only">Room Only</option>
                    <option value="bread_breakfast">Bread & Breakfast</option>
                    <option value="half_board">Half Board</option>
                    <option value="full_board">Full Board</option>
                  </select>
                  <div className="ml-2 text-black">
                    {mealPlanCosts[index] ? `RS ${mealPlanCosts[index]}` : ''}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )} */}
        </div>
      </div>
      {/* Adults, Children and Infants */}
      <div className="relative top-[-10px] mb-12 flex flex-col gap-6 lg:flex-row ">
        {numRooms > 0 &&
          [...Array(numRooms)].map((_, roomIndex) => (
            <div key={`room-${roomIndex}`} className="w-full lg:w-1/5">
         
      
             

              {childrenPerRoom[roomIndex] > 0 && (
                <div className="mt-4">
                  <label className="mb-2 mt-4 block text-xl  font-medium text-black">
                    Select Children Age
                  </label>
                  {[...Array(childrenPerRoom[roomIndex])].map(
                    (_, childIndex) => (
                      <select
                        key={`child-${roomIndex}-${childIndex}`}
                        value={childrenAgesPerRoom[roomIndex][childIndex] || ""}
                        onChange={(e) =>
                          handleChildAgeChange(
                            roomIndex,
                            childIndex,
                            parseInt(e.target.value, 10),
                          )
                        }
                        className="mb-4 w-full rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                      >
                        <option value="">Choose age</option>
                        <option value="3">3 - 10 years</option>
                      </select>
                    ),
                  )}
                </div>
              )}


              {infantsPerRoom[roomIndex] > 0 && (
                <div className="mt-4">
                  <label className="mb-2 mt-4 block text-xl  font-medium text-black">
                    Select Infants Age
                  </label>
                  {[...Array(infantsPerRoom[roomIndex])].map(
                    (_, infantIndex) => (
                      <select
                        key={`infant-${roomIndex}-${infantIndex}`}
                        value={infantAgesPerRoom[roomIndex][infantIndex]}
                        onChange={(e) =>
                          handleInfantAgeChange(
                            roomIndex,
                            infantIndex,
                            parseInt(e.target.value, 10),
                          )
                        }
                        className="mb-4 w-full rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                      >
                        <option value="">Choose age</option>
                        <option value="0">0</option>
                        {[...Array(2)].map((_, age) => (
                          <option key={age + 1} value={age + 1}>
                            {age + 1}
                          </option>
                        ))}
                      </select>
                    ),
                  )}
                </div>
              )}
            </div>
          ))}
      </div>

      <div className="w-full"></div>
      <div className="w-full">
        <div className="flex flex-col gap-9">
          <form>
            <div className="mb-4 text-2xl font-bold text-black">Guest Info</div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="Enter the First Name"
                  value={guestInfo.firstName}
                  onChange={handleChangeGuest}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="Enter the Last Name"
                  value={guestInfo.lastName}
                  onChange={handleChangeGuest}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter the email"
                  value={guestInfo.email}
                  onChange={handleChangeGuest}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black">
                  Nationality
                </label>
                <select
                  name="nationality"
                  required
                  value={guestInfo.nationality}
                  onChange={handleChangeGuest}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option value="">Select a nationality</option>
                  <option value="foreign">Foreign</option>
                  <option value="local">Local</option>
                </select>
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black">
                  Telephone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  required
                  placeholder="Enter the Telephone"
                  value={guestInfo.telephone}
                  onChange={handleChangeGuest}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-3 block text-xl font-medium text-black">
                Address
              </label>
              <textarea
                name="address"
                rows={6}
                required
                placeholder="Enter the Address"
                value={guestInfo.address}
                onChange={handleChangeGuest}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              ></textarea>
            </div>
            <div className="mb-4 text-2xl font-bold text-black">Agent Info</div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="Enter the First Name"
                  value={agentInfo.firstName}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="Enter the Last Name"
                  value={agentInfo.lastName}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter the email"
                  value={agentInfo.email}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black">
                  Nationality
                </label>
                <select
                  name="nationality"
                  required
                  value={agentInfo.nationality}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option value="">Select a nationality</option>
                  <option value="foreign">Foreign</option>
                  <option value="local">Local</option>
                </select>
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black">
                  Telephone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  required
                  placeholder="Enter the Telephone"
                  value={agentInfo.telephone}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-3 block text-xl font-medium text-black">
                Address
              </label>
              <textarea
                name="address"
                rows={6}
                required
                placeholder="Enter the Address"
                value={agentInfo.address}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              ></textarea>
            </div>
          </form>
        </div>
      </div>
      {/* Total Info */}
      <div className="mb-4 mt-4 ">
        <div className="mb-4 text-2xl font-bold text-black">Total Rate</div>
        <button
          onClick={() => {
            getrates();
          }}
          className="mt-4 h-12 w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 xl:w-1/5"
        >
          Get Rates
        </button>
        <div className="flex  w-full items-center justify-between p-3 lg:flex-row">
          <div className="text-[20px]  text-black">
            Total Rooms with Meal Plan
          </div>
          <div className="font-bold text-black">
            Rs {rates?.total_meal_plan_amount || 0}
          </div>
        </div>
        <div className="flex  w-full items-center justify-between p-3 lg:flex-row">
          <div className="text-[20px] text-black ">Total Activities Amount</div>
          <div className="font-bold text-black">
            Rs {rates?.total_activities_amount || 0}
          </div>
        </div>
        <div className="flex  w-full items-center justify-between p-3 lg:flex-row">
          <div className="text-[20px] text-black ">Total Rooms Amount</div>
          <div className="font-bold text-black">
            Rs {rates?.total_rooms_amount || 0}
          </div>
        </div>
        <div className="flex  w-full items-center justify-between p-3 lg:flex-row">
          <div className="text-[20px] text-black ">Total Tax Amount</div>
          <div className="font-bold text-black">
            Rs {rates?.total_tax_amount || 0}
          </div>
        </div>
        {/* {taxes.map((tax: any) => (
          <div key={tax.id}>
            <div className="flex  w-full items-center justify-between p-3 lg:flex-row">
              <div className="text-[20px] text-black ">
                {tax.name}{" "}
                <span className="ml-4 text-rose-400">({tax.percentage}%)</span>
              </div>
              <div className="font-bold text-black">
                Rs {(totalOrigin * (tax.percentage / 100))?.toLocaleString()}
              </div>
            </div>
          </div>
        ))} */}
        <div className="flex  w-full items-center justify-between p-3 lg:flex-row">
          <div className="text-[20px] text-orange-500">
            Discount & Special Rate
          </div>
          <div className=" font-bold text-orange-500">
            (-{rates?.total_discount_amount})
          </div>
        </div>
        <div className="mt-3  flex w-full items-center justify-between border-t-2 border-black p-3 lg:flex-row">
          <div className="text-[28px] font-bold text-black">Total</div>
          <div className="font-bold text-black">
            Rs {rates?.total_amount}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => isShow(false)}
          className="mt-4 h-12 w-full justify-center rounded bg-gray p-3 font-medium text-black hover:bg-opacity-90 xl:w-1/5"
        >
          Go Back
        </button>
        <button
          onClick={() => {
            handelProceedToPay();
          }}
          className="mt-4 h-12 w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 xl:w-1/5"
        >
          Proceed to Pay
        </button>
      </div>

      <table className="text-gray-500 dark:text-gray-400 w-full text-left text-sm">
        <thead className="text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-xs uppercase">
          <tr>
            <th scope="col" className="px-6 py-3">
              Check-in
            </th>
            <th scope="col" className="px-6 py-3">
              Check-out
            </th>
            <th scope="col" className="px-6 py-3">
              Booking Type
            </th>
            <th scope="col" className="px-6 py-3">
              Total Amount
            </th>
            <th scope="col" className="px-6 py-3">
              Guest Name
            </th>
            <th scope="col" className="px-6 py-3">
              Rooms
            </th>
            <th scope="col" className="px-6 py-3">
              Activities
            </th>
            <th scope="col" className="px-6 py-3">
              Payment Method
            </th>
            <th className="px-6 py-4">Receipt</th>
          </tr>
        </thead>
        <tbody>
        {bookings?.map((data:any)=>{
          return <tr className="dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-b bg-white">
          <td className="px-6 py-4">{timestampToDate(data?.check_in)}</td>
          <td className="px-6 py-4">{timestampToDate(data?.check_out)}</td>
          <td className="px-6 py-4">{data?.booking_type}</td>
          <td className="px-6 py-4">{(parseFloat(data?.total_amount || 0) + parseFloat(data?.total_activities_charge || 0) + parseFloat(data?.total_rooms_charge || 0) + parseFloat(data?.total_taxes || 0)) - (parseFloat(data?.total_discount_amount || 0)) }</td>
          <td className="px-6 py-4">{data?.guest_info?.first_name || ""} {data?.guest_info?.last_name || ""}</td>
          <td className="px-6 py-4">{data?.rooms?.map((room : any) => room?.room_id).join(', ')}</td>
          <td className="px-6 py-4">{data?.activities?.map((activity : any) => activity?.activity_name).join(', ')}</td>
          <td className="px-6 py-4">{data?.payment_method}</td>
          <td className="px-6 py-4"><a href={`https://api.sueennature.com/receipts/booking_receipt_${data?.id}.pdf`}>Download</a></td>
        </tr>
        })}
          
        </tbody>
      </table>
      <div className="mt-4 flex justify-between p-4">
                  <div className="flex items-center gap-4">
                    <select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="rounded-md border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span>items per page</span>
                  </div>
                  <div>
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 mr-2 cursor-pointer rounded-md px-3 py-1"
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextPage}
                      disabled={currentPage >= numRecords}
                      className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-pointer rounded-md px-3 py-1"
                    >
                      Next
                    </button>
                  </div>
                </div>
    </div>
  );
};

export default BookingRoom;
