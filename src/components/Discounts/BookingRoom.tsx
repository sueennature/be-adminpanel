"use client";
import React, { useEffect, useState } from "react";
import CreateGuestBooking from "./CreateGuestBooking";
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

  console.log(checkIN)
  console.log(checkOut)
  console.log('Room Type:', room_type);
  console.log('Room Type View:', room_type_view);
  console.log('Is Show:', isShow);
  console.log('Response Data:', responseDatas);
  console.log('Check-IN:', checkIN);
  console.log('Check-Out:', checkOut);
  console.log('Discount Code:', discountCode);
  const initialFormData: FormData = {
    rooms: [
      {
        room_id: 0,
        category: '',
        adults: 1,
        child: [0, 0], // Default to two children with age 0
        infants: [0, 0], // Default to two infants with age 0
        meal_plan: '',
        view: ''
      }
    ]
  };
  
  const [numRooms, setNumRooms] = useState<number>(0);
  const [adultsPerRoom, setAdultsPerRoom] = useState<number[]>([]);
  const [childrenPerRoom, setChildrenPerRoom] = useState<number[]>([]);
  const [childrenAgesPerRoom, setChildrenAgesPerRoom] = useState<number[][]>([],);
  const [taxes, setTaxes] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [totalOrigin, setTotalOrigin] = useState(0)
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
  
  const getrates = async() => {
    try{
      const requestBody ={
        "check_in": "2024-08-01T06:08:34.479Z",
        "check_out": "2024-08-02T06:08:34.479Z",
        "rooms": [
          {
            "room_id": 23,
            "adults": 2,
            "children": [5,7],
            "infants": [1],
            "meal_plan": "bread_breakfast"
          }
        ],
        "activities": [
          {
            "activity_id": 1
          }
        ],
        "taxes": [
          {
            "tax_id": 1
          }
        ],
        "discounts": [
          {
            "discount_id": 1
          }
        ],
        "discount_code": "SUMMER21"
      }
      const accessToken = Cookies.get("access_token");
      const response = await axios.post(`https://api.sueennature.com/rooms/get-rates`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });

     console.log("gettrace",response)
      console.log("gettrace",requestBody,{
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-key": process.env.X_API_KEY,
      } )
    }catch(err){
      console.log(err)
    }
  }

  function convertActivities(activities: any) {
    return activities.map((activity:any) => ({
        activity_id: activity?.id,
        activity_name: activity?.name
    }));
}

  const handelProceedToPay = async() => {
    try{
      const requestBody ={
        "check_in": checkIN,
        "check_out": checkOut,
        "booking_type": "internal",
        "payment_method": paymentMethod || null,
        "total_amount": 50000,
        "is_partial_payment": isChecked || null,
        "paid_amount": partialAmount,
        "discount_code": discountCode || null,
        "guest_info": {
          "first_name": guestInfo?.firstName,
          "last_name":guestInfo?.lastName,
          "email": guestInfo?.email,
          "telephone": guestInfo?.telephone,
          "address": guestInfo?.address,
          "nationality": guestInfo?.nationality,
          "profile_image": [],
          "identification_type": "string",
          "identification_no": "string",
          "identification_issue_date": "2024-07-26T06:08:34.480Z",
          "dob": "2024-07-26T06:08:34.480Z",
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
        "total_taxes": 0,
        "total_rooms_charge": 200,
        "total_activities_charge": 0,
        "total_discount_amount": 0,
      }
      const accessToken = Cookies.get("access_token");
      const response = await axios.post(`https://api.sueennature.com/bookings/internal`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });
      
    }catch(err){

    }
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

  type Room = {
    room_number: string;
    name: string;
    category: string;
    secondary_category: string;
    view: string;
    max_adults: number;
    max_childs: number;
    max_people: number;
    short_description: string;
    description: string;
    room_only: number;
    bread_breakfast: number;
    half_board: number;
    full_board: number;
    bathroom: string;
    size: string;
    beds: string;
    features: string;
    views: string;
    id: number;
  };

  function getFirstElements(arr:any, n:any) {
    return arr?.slice(0, n);
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

  const getTotalMealPlanCost = () => {
    const totalMealPlanCost = mealPlanCosts.reduce((acc, cost) => acc + cost, 0);
    const numberOfDays = responseDatas?.number_of_nights || 1; 
  
    return totalMealPlanCost * numberOfDays;
  };
  

  const applyDiscount = ({ baseCost, discountCode, checkIN, checkOut }: { baseCost: number; discountCode: string; checkIN: string; checkOut: string }) => {
    const discounts = responseDatas?.discounts || [];
    const discount = discounts.find((d: { discount_code: string; }) => d.discount_code === discountCode);
  
    if (discount) {
      const discountStartDate = new Date(discount.start_date);
      const discountEndDate = new Date(discount.end_date);
      const checkINDate = new Date(checkIN);
      const checkOutDate = new Date(checkOut);
  
      // Check if the booking period overlaps with the discount period
      const isValidPeriod = (checkINDate <= discountEndDate) && (checkOutDate >= discountStartDate);
  
      if (isValidPeriod) {
        // Calculate the number of days within the booking period
        const bookingStart = checkINDate > discountStartDate ? checkINDate : discountStartDate;
        const bookingEnd = checkOutDate < discountEndDate ? checkOutDate : discountEndDate;
        const daysBetween = Math.ceil((bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
        // Calculate the daily cost
        const totalBookingDays = Math.ceil((checkOutDate.getTime() - checkINDate.getTime()) / (1000 * 60 * 60 * 24));
        const dailyCost = baseCost / totalBookingDays;
  
        // Calculate the discount amount
        const discountAmount = dailyCost * daysBetween * (discount.percentage / 100);
  
        return discountAmount;
      }
    }
    return 0;
  };
  
  const calculateTotalCost = () => {
    const mealPlanCost = getTotalMealPlanCost();
    const activityCost = totalActivityPrice;
 
    let baseTotalCost = mealPlanCost + activityCost;
    setTotalOrigin(baseTotalCost)
    let totalDiscountAccumulated = 0; // Variable to accumulate total discount

    responseDatas?.rooms.forEach((room :any, index:any) => {
      const isNotSingleRoom = room.category !== "Single";
      const maxAdults = getMaxAdults(room.category);
      const hasMaxAdults = adultsPerRoom[index] === maxAdults;
      const hasAtLeastOneChild = childrenPerRoom[index] > 0;

      const mealPlan = mealPlans[index]; // Replace with the actual variable
      const isMealPlanEligible = mealPlan !== "room_only"; // Adjust this check as per your data

      if (isNotSingleRoom && hasMaxAdults && hasAtLeastOneChild && isMealPlanEligible) {
        const totalDaysT = responseDatas.number_of_nights;
        const roomCost = mealPlanCosts[index]; // Replace with the actual cost of the room
        const mealPlanDiscount = (mealPlanCosts[index] * 0.5); // 50% discount on meal plan cost
        const mealPlanDis = mealPlanDiscount * totalDaysT;
        totalDiscountAccumulated += mealPlanDis;
      }
    });

    // Calculate and set taxes
    const taxesList = responseDatas?.taxes || [];
    let totalTax = 0;
    taxesList.forEach((tax:any) => {
      const taxAmount = baseTotalCost * (tax.percentage / 100);
      totalTax += taxAmount;
    });

    const discountAmount = applyDiscount({
      baseCost: mealPlanCost,
      discountCode: discountCode,
      checkIN: checkIN,
      checkOut: checkOut
    });    // baseTotalCost -= discountAmount;
    totalDiscountAccumulated += discountAmount;
    // Adjust the final total cost
    baseTotalCost += totalTax;
    baseTotalCost -= totalDiscountAccumulated
    // Update state with the total discount, final total cost, and taxes
    setTotalDiscount(totalDiscountAccumulated);
    setTotalCost(baseTotalCost);
    setTaxes(taxesList);
    
  };
  useEffect(() => {
    calculateTotalCost();
  }, [responseDatas, adultsPerRoom, childrenPerRoom, mealPlans, totalActivityPrice, mealPlanCosts, checkIN, checkOut, discountCode]);
  
  useEffect(() => {
    const fetchBookings = async() =>{
      try{
        const accessToken = Cookies.get("access_token");
        const response = await axios.post(`${process.env.BE_URL}/bookings/?skip=0&limit=10`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "x-api-key": process.env.X_API_KEY,
          },
        });
      }catch(err){
        console.log(err)
      }
    }
    fetchBookings();
  }, []);

  const getMaxAdults = (roomType: string) => {
    switch (roomType) {
      case "Single":
        return 1;
      case "Double":
      case "Deluxe":
        return 2;
      case "Triple":
        return 3;
      case "Family":
        return 4;
      default:
        return 1;
    }
  };

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
                    <option value={`${room["room_only"]}|Room Only`}>Room Only</option>
                    <option value={`${room["bread_breakfast"]}|Bread & Breakfast`}>Bread & Breakfast</option>
                    <option value={`${room["half_board"]}|Half Board`}>Half Board</option>
                    <option value={`${room["full_board"]}|Full Board`}>Full Board</option>
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
            Rs {getTotalMealPlanCost().toLocaleString()}
          </div>
        </div>
        <div className="flex  w-full items-center justify-between p-3 lg:flex-row">
          <div className="text-[20px] text-black ">Total Activities</div>
          <div className="font-bold text-black">
            Rs {totalActivityPrice.toLocaleString()}
          </div>
        </div>
        {taxes.map((tax: any) => (
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
        ))}
        <div className="flex  w-full items-center justify-between p-3 lg:flex-row">
          <div className="text-[20px] text-orange-500">
            Discount & Special Rate
          </div>
          <div className=" font-bold text-orange-500">
            (-{totalDiscount?.toLocaleString()})
          </div>
        </div>
        <div className="mt-3  flex w-full items-center justify-between border-t-2 border-black p-3 lg:flex-row">
          <div className="text-[28px] font-bold text-black">Total</div>
          <div className="font-bold text-black">
            Rs{totalCost.toLocaleString()}
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
          </tr>
        </thead>
        <tbody>
          <tr className="dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-b bg-white">
            <td className="px-6 py-4">Test Check-in</td>
            <td className="px-6 py-4">Test Check-out</td>
            <td className="px-6 py-4">Test Booking Type</td>
            <td className="px-6 py-4">Test Total Amount</td>
            <td className="px-6 py-4">Test Guest Name</td>
            <td className="px-6 py-4">Test Rooms</td>
            <td className="px-6 py-4">Test Activities</td>
            <td className="px-6 py-4">Test Payment Method</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BookingRoom;
