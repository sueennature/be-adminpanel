"use client";
import React, { useEffect, useState, useRef } from "react";
import { countries } from "../../utils/contries";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import axios from "axios";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRouter } from "next/navigation";
import { BE_URL, X_API_KEY, FRONT_URL } from '@/config/config'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { banks } from "../../utils/banks"
import Button from '@mui/material/Button';

import AutoCompleateSeachBox from "../bookings/AutoCompleateSeachBox";
import AutoCompleateAgentSearch from "../bookings/AutoCompleateAgentSearch";
import zIndex from "@mui/material/styles/zIndex";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
interface AgentInfo {
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
  telephone: string;
  address: string;
}

interface GestInfo {
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
  telephone: string;
  address: string;
  identificationType: string;

  identificationNo: string;
  gender: string;

}

interface BookingRoomData {
  room_type: any;
  room_type_view: string;
  isShow: any;
  responseDatas: any;
  checkIN: any;
  checkOut: any;
  discountCode: any;
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



  interface Room {
    room_id: string;
    additional_services?: any[];
  }

  const router = useRouter();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [partialAmount, setPartialAmount] = useState<number>(0);
  const [requestRoom, setRequestRoom] = useState<any>([]);
  const [activities, setActivities] = useState<any>([]);
  const [notes, setNotes] = useState<any>("");
  const [paymentNotes, setPaymentNotes] = useState<any>("");
  const [selectedDiscounts, setSelectedDiscounts] = useState<number[]>([]);
  const [selectedTaxes, setSelectedTaxes] = useState<number[]>([]);
  const [rates, setRates] = useState<any>({});
  const [bank, setBank] = useState<string>("");
  const [cardType, setCardType] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [refNumber, setRefNumber] = useState<string>("");

  const [dob, setDob] = React.useState<any>({
    date: null,
    dateStr: ''
  });
  const [issueDate, setIssueDate] = useState<any>({
    date: null,
    dateStr: ''
  });
  const [additionalServicesByRoom, setAdditionalServicesByRoom] = useState<{ [key: string]: any[] }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState({});

  const [agentInfo, setAgentInfo] = useState<AgentInfo>({
    firstName: '',
    lastName: '',
    email: '',
    nationality: 'Sri Lanka',
    telephone: '',
    address: ''
  });

  const [guestInfo, setGuestInfo] = useState<GestInfo>({
    firstName: '',
    lastName: '',
    email: '',
    nationality: 'Sri Lanka',
    telephone: '',
    address: '',
    identificationType: '',

    identificationNo: '',
    gender: '',

  });

  

  const clearGuestInfo = () => {
    setGuestInfo({
      firstName: '',
      lastName: '',
      email: '',
      nationality: 'Sri Lanka',
      telephone: '',
      address: '',
      identificationType: '',
  
      identificationNo: '',
      gender: '',
  
    });
  };

  const clearAgentInfo = () => {
    setAgentInfo({
      firstName: '',
      lastName: '',
      email: '',
      nationality: 'Sri Lanka',
      telephone: '',
      address: ''
    });
  };

  const updateGuestInfo = (updatedInfo: GestInfo) => {
    setGuestInfo(updatedInfo);
  };

  const updateAgentInfo = (updatedInfo: AgentInfo) => {
    setAgentInfo(updatedInfo);
  };

  const handleDobChange = (newValue: any) => {
    const formattedDate = newValue ? newValue.toISOString() : '';
    setDob({
      date: newValue,
      dateStr: formattedDate
    });
  };
  const handleIssueChange = (newValue: any) => {
    const formattedDate = newValue ? newValue.toISOString() : '';
    setIssueDate({
      date: newValue,
      dateStr: formattedDate
    });
  };


  const validate = () => {
    let tempErrors: any = {};

    if (!guestInfo.firstName) tempErrors.firstName = "Guest First Name is required!";
    if (!guestInfo.lastName) tempErrors.lastName = "Guest Last Name is required!";

    // Simple email validation
    if (!guestInfo.email) {
      tempErrors.email = "Guest Email is required!";
    } else if (!/\S+@\S+\.\S+/.test(guestInfo.email)) {
      tempErrors.email = "Guest Email is invalid!";
    }

    if (!guestInfo.nationality) tempErrors.nationality = "Guest Nationality is required!";
    if (!guestInfo.telephone) {
      tempErrors.telephone = "Guest Telephone is required!";
    } else if (!/^\d{10,15}$/.test(guestInfo.telephone)) {
      tempErrors.telephone = "Guest Telephone must be between 10 and 15 digits!";
    }

    if (!guestInfo.address) tempErrors.address = "Guest Address is required!";
    if (!guestInfo.identificationType) tempErrors.identificationType = "Guest Identification Type is required!";
    if (!dob?.dateStr) tempErrors.dob = "Guest Date of Birth is required!";
    if (!guestInfo.identificationNo) tempErrors.identificationNo = "Guest Identification No. is required!";
    if (!guestInfo.gender) tempErrors.gender = "Guest Gender is required!";
    if (!issueDate.dateStr) tempErrors.issueDate = "Guest Issue Date is required!";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const renderErrorMessages = () => {
    return Object.values(errors).map((error: any, index: any) => (
      <p key={index} style={{ color: 'red', fontWeight: 800, textAlign: "right" }}>{error}</p>
    ));
  };

  const handleCheckboxChangeTax = (taxId: number) => {
    setSelectedTaxes((prevSelected) => {
      if (prevSelected.includes(taxId)) {
        return prevSelected.filter((id) => id !== taxId);
      } else {
        return [...prevSelected, taxId];
      }
    });
  };

  const handleCheckboxChangeDiscount = (discountId: number) => {
    setSelectedDiscounts((prevSelected) => {
      if (prevSelected.includes(discountId)) {
        return prevSelected.filter((id) => id !== discountId);
      } else {
        return [...prevSelected, discountId];
      }
    });
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
    setBank("")
    setCardType("")
    setCardNumber("")
    setRefNumber("")
  };

  function convertActivities(activities: any) {
    return activities.map((activity: any) => ({
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

  const handleUpdateMealPlan = (event: any, id: any) => {
    try {
      const val = event.target.value

      setRequestRoom((prev: any) =>
        prev?.map((item: any) =>
          item?.room_id === id ? { ...item, meal_plan: val } : item
        )
      );
    } catch (err) {
      console.log(err)
    }
  }
  const handleUpdateStartWithMeal = (event: any, id: any) => {
    try {
      const val = event.target.value

      setRequestRoom((prev: any) =>
        prev?.map((item: any) =>
          item?.room_id === id ? { ...item, starting_meals_with: val } : item
        )
      );
    } catch (err) {
      console.log(err)
    }
  }
  function getCategoryById(id:any) {
    const room = responseDatas?.rooms.find((r:any) => r.id === id);
    if (room) {
        return {
            category: room.category,
            secondary_category: room.secondary_category
        };
    } else {
        return null; 
    }
}

  const handleUpdateCatogory = (event: any, id: any) => {
    try {
      const val = event.target.value
      if(val == "Single"){
        setRequestRoom((prev: any) =>
          prev?.map((item: any) =>
            item?.room_id === id ? { ...item, children: [] } : item
          )
        );
        setRequestRoom((prev: any) =>
          prev?.map((item: any) =>
            item?.room_id === id ? { ...item, children: [] } : item
          )
        );
        setRequestRoom((prev: any) =>
          prev?.map((item: any) =>
            item?.room_id === id ? { ...item, infants: [] } : item
          )
        );
        setRequestRoom((prev: any) =>
          prev?.map((item: any) =>
            item?.room_id === id ? { ...item, infants: [] } : item
          )
        );
        setRequestRoom((prev: any) =>
          prev?.map((item: any) =>
            item?.room_id === id ? { ...item, adults: 1 } : item
          )
        );
      }
      setRequestRoom((prev: any) =>
        prev?.map((item: any) =>
          item?.room_id === id ? { ...item, category: val } : item
        )
      );
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdateAdults = (event: any, id: any) => {
    try {
      const val = event.target.value
      setRequestRoom((prev: any) =>
        prev?.map((item: any) =>
          item?.room_id === id ? { ...item, adults: parseInt(val || 0) } : item
        )
      );
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdateChildren = (event: any, id: any) => {
    try {
      const val = parseInt(event.target.value || 0)
      console.log("valvalvalvalvalvalvalvalvalval",val)
      const arr = Array(val).fill(3);
      setRequestRoom((prev: any) =>
        prev?.map((item: any) =>
          item?.room_id === id ? { ...item, children: arr || [] } : item
        )
      );
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdateChildrenAges = (event: any, id: any, index: any) => {
    try {
      let ageArr = requestRoom?.find((r: any) => r.room_id == id)?.children
      ageArr[index] = parseInt(event.target.value);
      setRequestRoom((prev: any) =>
        prev?.map((item: any) =>
          item?.room_id === id ? { ...item, children: ageArr || [] } : item
        )
      );
    } catch (err) {
      console.log(err)
    }
  }
  const handleUpdateInfants = (event: any, id: any) => {
    try {
      const val = parseInt(event.target.value || 0)
      const arr = Array(val).fill(1);
      setRequestRoom((prev: any) =>
        prev?.map((item: any) =>
          item?.room_id === id ? { ...item, infants: arr || [] } : item
        )
      );
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdateInfantsAges = (event: any, id: any, index: any) => {
    try {
      let ageArr = requestRoom?.find((r: any) => r.room_id == id)?.infants
      ageArr[index] = parseInt(event.target.value);
      setRequestRoom((prev: any) =>
        prev?.map((item: any) =>
          item?.room_id === id ? { ...item, infants: ageArr || [] } : item
        )
      );
    } catch (err) {
      console.log(err)
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleClear = () => {
    try {
      setIsChecked(false);
      setPaymentMethod('');
      setPartialAmount(0);
      setRequestRoom([]);
      setActivities([]);
      setNotes("");
      setSelectedDiscounts([]);
      setSelectedTaxes([]);
      setRates({});
      setDob("");
      setIssueDate("");
      setAdditionalServicesByRoom({});
      //setMofifyDiscount(false);
      //setMofifyTaxes(false);
      setAgentInfo({
        firstName: '',
        lastName: '',
        email: '',
        nationality: '',
        telephone: '',
        address: ''
      })

      setGuestInfo({
        firstName: '',
        lastName: '',
        email: '',
        nationality: '',
        telephone: '',
        address: '',
        identificationType: '',

        identificationNo: '',
        gender: '',
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleAddAdditionalServise = (room_id: any, event: any, value: any[]) => {
    let arr: any[] = value?.map((val: any) => ({
      "additional_service_id": val?.id,
      "additional_service_name": val?.name,
      "additional_service_price": val?.price,
    }));

    setAdditionalServicesByRoom(prev => ({
      ...prev,
      [room_id]: arr,
    }));
  };

  const handleAddRoom = (event: any, value: any[]) => {
    let arr: any = []

    value?.map((val: any) => {

      let temp = {
        "room_id": val?.id,
        "room_number": val?.room_number,
        "category": val?.category,
        "secondary_category": val?.secondary_category,
        "view": val?.view,
        "adults": 1,
        "children": [],
        "infants": [],
        "meal_plan": "room_only",
        "max_adults": val?.max_adults,
        "max_childs": val?.max_childs,
        "additional_services": additionalServicesByRoom?.[val?.id] || []
      }
      arr.push(temp);
    })
    setRequestRoom(arr)
  }


  const getrates = async () => {
    try {
      const selectedDiscountsArray = selectedDiscounts?.map((id) => ({ discount_id: id }));
      const selectedTaxesArray = selectedTaxes.map((id) => ({ tax_id: id }));
      const requestBody = {
        "check_in": checkIN,
        "check_out": checkOut,
        "rooms": await requestRoom.map((room: any) => {
          console.log("roomroomroomroomroomroomroom",room)
          return ({
            room_id: room.room_id,
            adults: room.adults,
            children: room.children || [],
            infants: room.infants,
            meal_plan: room.meal_plan,
            category: room?.category,
            additional_services: additionalServicesByRoom?.[room?.room_id]?.map(service => service.additional_service_id) || []
          })
        }),
        "activities": await activities?.map((activity: any) => ({ activity_id: activity?.id })),
        "taxes": selectedTaxesArray,
        "discounts": await selectedDiscountsArray?.filter(item => item.discount_id !== null),
        "discount_code": discountCode || "",
      }

      const accessToken = await Cookies.get("access_token");
      const response = await axios.post(`${process.env.BE_URL}/rooms/get-rates/`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });
      setRates(response?.data || {})
    } catch (err) {
      console.log(err)
    }
  }



  const handelProceedToPay = async () => {
    try {
      if (validate()) {
        setIsLoading(true)
        let rooms: Room[] = [];
        await requestRoom.map((room: any) => (
          rooms.push({ ...room, additional_services: additionalServicesByRoom?.[room?.room_id] || [] })
        ))
        const requestBody = {
          "check_in": checkIN,
          "check_out": checkOut,
          "booking_type": "internal",
          "payment_method": "walk-in guest",
          "total_amount": parseFloat(rates?.total_amount || 0),
          "is_partial_payment": isChecked || false,
          "paid_amount": partialAmount || 0,
          "balance_amount": parseFloat(rates?.total_amount || 0) - partialAmount,
          "discount_code": discountCode || "",
          "payment_note": paymentNotes,
          "guest_info": {
            "first_name": guestInfo?.firstName,
            "last_name": guestInfo?.lastName,
            "email": guestInfo?.email,
            "telephone": guestInfo?.telephone,
            "address": guestInfo?.address,
            "nationality": guestInfo?.nationality,
            "profile_image": [],
            "identification_type": guestInfo?.identificationType,
            "identification_no": guestInfo?.identificationNo,
            "identification_issue_date": issueDate?.dateStr,
            "dob": dob?.dateStr,
            "gender": guestInfo?.gender,
          },
          "rooms": rooms || [],
          "activities": convertActivities(activities || []) || [],
          "agent_info": {
            "first_name": agentInfo?.firstName || "",
            "last_name": agentInfo?.lastName || "",
            "email": agentInfo?.email || "",
            "telephone": agentInfo?.telephone || "",
            "address": agentInfo?.address || "",
            "nationality": agentInfo?.address || "",
          },
          "total_taxes": rates?.total_tax_amount,
          "total_rooms_charge": rates?.total_rooms_amount,
          "total_meal_plan_amount": rates?.total_meal_plan_amount,
          "total_activities_charge": rates?.total_activities_amount,
          "total_discount_amount": rates?.total_discount_amount,
          "booking_note": notes,
          "total_additional_services_amount": rates?.total_additional_services_amount
        }
        console.log("payload", requestBody)
        const accessToken = Cookies.get("access_token");
        const response = await axios.post(`${process.env.BE_URL}/bookings/internal`, requestBody, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "x-api-key": process.env.X_API_KEY,
          },
        });
        if (response?.status === 200) {
          toast.success(`Successfully Added!`);
          setAgentInfo({
            firstName: '',
            lastName: '',
            email: '',
            nationality: '',
            telephone: '',
            address: ''
          })
          setGuestInfo({
            firstName: '',
            lastName: '',
            email: '',
            nationality: '',
            telephone: '',
            address: '',
            identificationType: '',
            identificationNo: '',
            gender: ''
          })
          router.push(`/calendar`);
          setIsLoading(false)
        } else {
          toast.error("Something went wrong");
        }
      }
    } catch (err) {
      console.log(errors)
    }
  }

  useEffect(() => {
    getrates()
  }, [
    additionalServicesByRoom,
    partialAmount,
    activities,
    checkIN,
    checkOut,
    requestRoom,
    selectedDiscounts,
    selectedTaxes
  ]);



  return (
    <div className="mx-auto w-full px-4">
      <div className="pb-6">

        <div className="mb-6 text-xl font-bold text-black">
          {room_type_view}
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
              <Stack spacing={3} sx={{ width: 500 }}>
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={responseDatas?.rooms || []}
                  getOptionLabel={(option: any) => option?.room_number}
                  onChange={handleAddRoom}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Rooms"
                      placeholder="Select Rooms"
                    />
                  )}
                />
              </Stack>
            </div>
          </div>
        </div>
        <TableContainer component={Paper} sx={{ marginBottom: 5 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Room Number</TableCell>
                <TableCell>Room category</TableCell>
                <TableCell>Meal Plan per Room</TableCell>
                <TableCell>Start With</TableCell>
                <TableCell>Additional services</TableCell>
                <TableCell>Adults per Room</TableCell>
                <TableCell>Children per Room</TableCell>
                <TableCell>Select Age </TableCell>
                <TableCell>Infants per Room</TableCell>
                <TableCell>Select Age </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requestRoom?.map((room: any, index: any) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell >
                    {room?.room_number}
                  </TableCell>
                  <TableCell >
                    <select
                      className="rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                      onChange={(e) => {
                        handleUpdateCatogory(e, room?.room_id);
                      }}
                    >
                      <option value={""}>Select Category</option>
                      {<option value={`${getCategoryById(room?.room_id)?.category}`}>{getCategoryById(room?.room_id)?.category}</option>}
                      {<option value={`${getCategoryById(room?.room_id)?.secondary_category}`}>{getCategoryById(room?.room_id)?.secondary_category}</option>}
                    </select>
                  </TableCell>
                  <TableCell >
                    <select
                      className="rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                      onChange={(e) => {
                        handleUpdateMealPlan(e, room?.room_id);
                      }}
                    >

                      <option value={`room_only`}>Room Only</option>
                      <option value={`bread_breakfast`}>Bread & Breakfast</option>
                      <option value={`half_board`}>Half Board</option>
                      <option value={`full_board`}>Full Board</option>
                    </select>
                  </TableCell>
                  <TableCell >
                    {(requestRoom?.find((r: any) => r.room_id == room?.room_id)?.meal_plan == "half_board" || requestRoom?.find((r: any) => r.room_id == room?.room_id)?.meal_plan == "full_board") &&
                      <div>

                        <select
                          className="rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                          onChange={(e) => {
                            handleUpdateStartWithMeal(e, room?.room_id);
                          }}
                        >
                          <option value={""}>Select the meal</option>
                          <option value={`breakfast`}>breakfast</option>
                          <option value={`lunch`}>lunch</option>
                          <option value={`dinner`}>dinner</option>
                        </select>

                      </div>
                    }</TableCell>
                  <TableCell >
                    <Autocomplete
                      style={{ width: 200 }}
                      multiple
                      id="tags-outlined"
                      options={responseDatas?.additional_services || []}
                      getOptionLabel={(option: any) => option?.name}
                      filterSelectedOptions
                      onChange={(event, value) => handleAddAdditionalServise(room?.room_id, event, value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Additional services"
                          placeholder="Additional services "

                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <select
                      onChange={(e) => handleUpdateAdults(e, room?.room_id)}
                      className="rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                    >

                      {room?.category !== "Single"
                        ? Array.from({ length: room?.max_adults || 0 }, (_, i) => i + 1).map((num) => (
                          <option key={num}>{num}</option>
                        ))
                        : <option>1</option>}
                    </select>
                  </TableCell>
                  <TableCell>
                    {<div>
                      <select
                        onChange={(e) =>
                          handleUpdateChildren(e, room?.room_id)
                        }
                        className="rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                      >
                        <option>0</option>
                        {room?.category != "Single" ? Array?.from({ length: room?.max_childs || 0 }, (_, i) => i + 1)?.map((num, index) => {
                          return <option key={index}>{num}</option>
                        }) : <option>1</option>}

                      </select>
                    </div>}



                  </TableCell>
                  <TableCell>
                    {requestRoom?.find((r: any) => r.room_id == room?.room_id)?.children?.map((val: any, key: any) => {
                      return <select key={key}
                        onChange={(e) =>
                          handleUpdateChildrenAges(e, room?.room_id, key)
                        }
                        className="rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                      >
                        {Array.from({ length: 16 }, (_, i) => i + 3)?.map((option, key) => {
                          return <option key={key} value={option}>
                            {option}
                          </option>
                        })}
                      </select>
                    })}
                  </TableCell>
                  <TableCell>
                    {<div>
                      <select
                        onChange={(e) =>
                          handleUpdateInfants(e, room?.room_id)
                        }
                        className="rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                      >
                        <option>0</option>
                        {room?.category != "Single" ? Array?.from({ length: room?.max_childs || 0 }, (_, i) => i + 1)?.map((num, index) => {
                          return <option key={index}>{num}</option>
                        }) : <option>1</option>}

                      </select>
                    </div>}
                  </TableCell>
                  <TableCell>
                    {requestRoom?.find((r: any) => r.room_id == room?.room_id)?.infants?.map((val: any, key: any) => {
                      return <select key={key}
                        onChange={(e) =>
                          handleUpdateInfantsAges(e, room?.room_id, key)
                        }
                        className="rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                      >
                        {Array.from({ length: 2 }, (_, i) => i + 1)?.map((option, key) => {
                          return <option key={key} value={option}>
                            {option}
                          </option>
                        })}
                      </select>
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="flex flex-col items-start justify-center gap-4 lg:flex-row">
          <div className=" mb-12 w-full rounded-md bg-slate-300 p-3 shadow-md shadow-black/50 lg:w-[50%]">
            <h4 className="ml-3 text-xl font-bold text-black">Discounts</h4>
            {responseDatas?.discounts?.map((discount: any, index: any) => (
              <div
                key={index}
                className="flex w-full items-center justify-between p-3 lg:flex-row"
              >
                <Checkbox
                  // disabled={!mofifyDiscount}
                  checked={selectedDiscounts.includes(discount.id)}
                  onChange={() => handleCheckboxChangeDiscount(discount.id)}
                  {...label}
                />
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
        <div className="flex flex-wrap justify-between">
          <div className="mb-12 mt-1 w-full rounded-md p-3 shadow-md shadow-black/50 lg:w-[48%]">
            <h4 className="ml-3 text-xl font-bold text-black">Select Activities</h4>
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
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={`checkboxLabel${index}`}
                        className="sr-only"
                        checked={!!activities?.find((obj: any) => obj?.id === activity?.id)}
                        onChange={() => handleSelectActivities(activity)}
                      />
                      <div
                        className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${!!activities?.find((obj: any) => obj?.id === activity?.id)
                          ? "border-primary bg-gray dark:bg-transparent"
                          : ""
                          }`}
                      >
                        <span
                          className={`opacity-0 ${!!activities?.find((obj: any) => obj?.id === activity?.id) ? "!opacity-100" : ""
                            }`}
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
                <div className="font-bold text-black">{activity?.price?.toLocaleString()}</div>
              </div>
            ))}
          </div>


          <div className="mb-12 mt-1 w-full rounded-md p-3 shadow-md shadow-black/50 lg:w-[48%]">
            <h4 className="ml-3 text-xl font-bold text-black">Taxes </h4>
            <div className="flex w-full items-center justify-between p-3 lg:flex-row">
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {responseDatas?.taxes?.map((data: any, key: any) => {
                  const labelId = `checkbox-list-label-${key}`;
                  return (
                    <ListItem key={key}>
                      <ListItemIcon>
                        <Checkbox
                          checked={selectedTaxes.includes(data.id)}
                          onChange={() => handleCheckboxChangeTax(data.id)}
                          {...label} />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={`${data.name} - ${data?.percentage}%` || ""} />
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full"></div>
      <div className="w-full">
        <div className="flex flex-col gap-9">
          <form>
            <div className="mb-4 text-2xl font-bold text-black">Guest Info</div>
            <div className="mb-4" style={{ display: 'flex', alignItems: 'center' }}>
              <AutoCompleateSeachBox updateGuestInfo={updateGuestInfo} />
              <Button onClick={clearGuestInfo} variant="contained" style={{ padding:16, marginLeft:'8px' }}>clear</Button>
            </div>
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

                  {countries?.map((country, key) => {
                    return <option key={key} value={country?.value}>{country?.label}</option>
                  })}
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
            {/* second */}
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black">
                  Dob
                </label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      label="Date of Birth"
                      value={dob?.date}
                      onChange={handleDobChange}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>


              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black">
                  Identification Type
                </label>
                <select
                  name="identificationType"
                  required
                  value={guestInfo.identificationType}
                  onChange={handleChangeGuest}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option value="">Select Identification Type</option>
                  <option value="nic">National Identity Card (NIC)</option>
                  <option value="Passport">Passport</option>
                  <option value="driving_license">Driving License</option>
                </select>
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black">
                  Issue Date
                </label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      label="Date of Birth"
                      value={issueDate?.date}
                      onChange={handleIssueChange}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black">
                  Identification No
                </label>
                <input
                  type="text"
                  name="identificationNo"
                  required
                  placeholder="Identification No"
                  value={guestInfo.identificationNo}
                  onChange={handleChangeGuest}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black">
                  Gender
                </label>
                <select
                  name="gender"
                  required
                  value={guestInfo.gender}
                  onChange={handleChangeGuest}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
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
            <div className="mb-4" style={{ display: 'flex', alignItems: 'center' }}>
              <AutoCompleateAgentSearch updateAgentInfo={updateAgentInfo} />
              <Button onClick={clearAgentInfo} variant="contained" style={{ padding:16, marginLeft:'8px' }}>clear</Button>
            </div>
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
                  {countries?.map((country, key) => {
                    return <option key={key} value={country?.value}>{country?.label}</option>
                  })}

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
            <div className="mb-6">
              <label className="mb-3 block text-xl font-medium text-black">
                Notes
              </label>
              <textarea
                name="note"
                rows={6}
                required
                placeholder="Notes"
                value={notes}
                onChange={(e) => { setNotes(e.target.value) }}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              ></textarea>
            </div>

          </form>
        </div>
      </div>
      {/* Total Info */}
      <div className="mb-4 mt-4 ">
        <div className="mb-4 text-2xl font-bold text-black">Total Rate</div>
        <div className="mb-6.5 flex flex-col gap-6">
          <div className="w-full xl:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black">
              Payment Method
            </label>
            <select
              style={{ width: 220 }}
              name="category"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
            >
              <option value="">Select a payment method</option>
              <option value="card_payment">Card payment</option>
              <option value="cash_payment">Cash payment</option>
            </select>
          </div>
        </div>


        {paymentMethod === "card_payment" && (
          <div className="mb-6.5 flex flex-wrap gap-6">
            <div className="w-full xl:w-auto">
              <select
                style={{ width: 220 }}
                name="bank"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                required
                className="rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              >
                <option value="">Select your bank</option>
                {banks?.map((val, key) => (
                  <option key={key} value={val?.values}>
                    {val?.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full xl:w-auto">
              <select
                style={{ width: 220 }}
                name="card"
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                required
                className="rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              >
                <option value="">Select your card type</option>
                <option value={"visa"}>{"Visa"}</option>
                <option value={"master "}>{"Master"}</option>
              </select>
            </div>
            <div className="w-full xl:w-auto">
              <input
                type="text"
                name="card_number"
                maxLength={4}
                required
                placeholder="Last 4 digits of the card number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="w-full xl:w-auto">
              <input
                type="text"
                name="reference_number"
                required
                placeholder="Reference Number"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                className="rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
          </div>
        )}

        {/* <button
          onClick={() => {
            getrates();
          }}
          className="mt-4 h-12 w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 xl:w-1/5"
        >
          Get Rates
        </button> */}
        <div className="w-full xl:w-1/2 mt-5 ml-4">
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
                    setPartialAmount(0)
                  }}
                />
                <div
                  className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${isChecked && "border-primary bg-gray dark:bg-transparent"
                    }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-sm ${isChecked && "bg-primary"}`}
                  ></span>
                </div>
              </div>
              Partial / Paid Amount
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
                  setPartialAmount(parseInt(e.target.value || '0', 10));
                }}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
            )}
          </div>
        </div>
        <div className="flex  w-full items-center justify-between p-3 lg:flex-row">
          <div className="text-[20px] text-black ">Total Rooms Amount</div>
          <div className="font-bold text-black">
            Rs {rates?.total_rooms_amount?.toFixed(2)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}
          </div>
        </div>
        <div className="flex  w-full items-center justify-between p-3 lg:flex-row">
          <div className="text-[20px]  text-black">
            Total Meal Plan Amount
          </div>
          <div className="font-bold text-black">
            Rs {rates?.total_meal_plan_amount?.toFixed(2)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}
          </div>
        </div>
        <div className="flex  w-full items-center justify-between p-3 lg:flex-row">
          <div className="text-[20px] text-black ">Total Additional Services Amount</div>
          <div className="font-bold text-black">
            Rs {rates?.total_additional_services_amount?.toFixed(2)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}
          </div>
        </div>
        <div className="flex  w-full items-center justify-between p-3 lg:flex-row">
          <div className="text-[20px] text-black ">Total Activities Amount</div>
          <div className="font-bold text-black">
            Rs {rates?.total_activities_amount?.toFixed(2)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}
          </div>
        </div>
        <div className="flex  w-full items-center justify-between p-3 lg:flex-row">
          <div className="text-[20px] text-black ">Total Tax Amount</div>
          <div className="font-bold text-black">
            Rs {rates?.total_tax_amount?.toFixed(2)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}
          </div>
        </div>
        <div className="flex  w-full items-center justify-between p-3 lg:flex-row">
          <div className="text-[20px] text-orange-500">
            Discount & Special Rate
          </div>
          <div className=" font-bold text-orange-500">
            (-{rates?.total_discount_amount?.toFixed(2)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})
          </div>
        </div>

        <div className="mt-3  flex w-full items-center justify-between border-t-2 border-black p-3 lg:flex-row">
          <div className="text-[28px] font-bold text-black">Total Amount</div>
          <div className="font-bold text-black">
            Rs {rates?.total_amount?.toFixed(2)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        </div>
        <div className="flex  w-full items-center justify-between p-3 lg:flex-row">
          <div className="text-[20px] text-black ">Partial Paid Amount</div>
          <div className="font-bold text-black">
            Rs {partialAmount?.toFixed(2)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        </div>

        <div className="flex  w-full items-center justify-between p-3 lg:flex-row">
          <div className="text-[20px] text-black ">Blance Amount</div>
          <div className="font-bold text-black">
            Rs {(rates?.total_amount - partialAmount || 0)?.toFixed(2)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        </div>
      </div>
      {renderErrorMessages()}
      <div className="mb-6">

        <textarea
          name="note"
          rows={6}
          required
          placeholder="Notes"
          value={paymentNotes}
          onChange={(e) => { setPaymentNotes(e.target.value) }}
          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
        ></textarea>
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
            handleClear()
          }}
          className="mt-4 h-12 w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 xl:w-1/5"
        >
          Reset Form
        </button>
        <button
          onClick={() => {
            handelProceedToPay();
          }}
          className="mt-4 h-12 w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 xl:w-1/5"
        >


          Submit booking {isLoading && <CircularProgress style={{ color: "white", height: 20, width: 20, marginLeft: 10 }} />}
        </button>
      </div>
    </div>
  );
};

export default BookingRoom;
