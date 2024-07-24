"use client";
import React, { useEffect, useState } from "react";
import CreateGuestBooking from "./CreateGuestBooking";

interface BookingRoomData {
  room_type: any;
  room_type_view: string;
  isShow: any;
  responseDatas :any;
}

const BookingRoom: React.FC<BookingRoomData> = ({
  room_type,
  room_type_view,
  isShow,
  responseDatas
}) => {
  console.log("RES",responseDatas)

  useEffect(()=>{

  },[responseDatas])
  const [numRooms, setNumRooms] = useState<number>(0);
  const [adultsPerRoom, setAdultsPerRoom] = useState<number[]>([]);
  const [childrenPerRoom, setChildrenPerRoom] = useState<number[]>([]);
  const [childrenAgesPerRoom, setChildrenAgesPerRoom] = useState<number[][]>(
    [],
  );
  const [roomCounts, setRoomCounts] = useState<number[]>([]);
  const [mealPlan, setMealPlan] = useState('');

  const [infantsPerRoom, setInfantsPerRoom] = useState<number[]>([]);
  const [infantAgesPerRoom, setInfantAgesPerRoom] = useState<number[][]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});

  const handleCheckboxChange = (index: number) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  const numberOfRooms = responseDatas.rooms.length;
  const [selectedRooms, setSelectedRooms] = useState(0);

  
  const handleRoomChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRooms = parseInt(event.target.value, 10);
    const roomCount = Number(event.target.value);
    setSelectedRooms(roomCount);

    if (isNaN(selectedRooms) || selectedRooms === 0) {
      setNumRooms(0);
      setAdultsPerRoom([]);
      setChildrenPerRoom([]);
      setChildrenAgesPerRoom([]);
      setInfantsPerRoom([]);
      setInfantAgesPerRoom([]);
      setMealPlan('');

      return;
    }

    setNumRooms(selectedRooms);
    setAdultsPerRoom(new Array(selectedRooms).fill(1));
    setChildrenPerRoom(new Array(selectedRooms).fill(0));
    setChildrenAgesPerRoom(new Array(selectedRooms).fill([]));
    setInfantsPerRoom(new Array(selectedRooms).fill(0));
    setInfantAgesPerRoom(new Array(selectedRooms).fill([]));
  };

  const handleMealPlanChange = (event:any) => {
    setMealPlan(event.target.value);
  };

  const getMealPlanPrice = (room :any, mealPlan:any) => {
    switch (mealPlan) {
      case 'room_only':
        return room.room_only;
      case 'bread_breakfast':
        return room.bread_breakfast;
      case 'half_board':
        return room.half_board;
      case 'full_board':
        return room.full_board;
      default:
        return 0;
    }
  };

  const handleAdultChange = (roomIndex: number, value: number) => {
    const updatedAdults = [...adultsPerRoom];
    updatedAdults[roomIndex] = value;
    setAdultsPerRoom(updatedAdults);

    const updatedChildren = [...childrenPerRoom];
    updatedChildren[roomIndex] = Math.min(
      updatedChildren[roomIndex],
      getMaxChildren(room_type, value),
    );
    setChildrenPerRoom(updatedChildren);

    const updatedAges = [...childrenAgesPerRoom];
    updatedAges[roomIndex] = updatedAges[roomIndex] || [];
    updatedAges[roomIndex] = updatedAges[roomIndex].slice(
      0,
      updatedChildren[roomIndex],
    );
    setChildrenAgesPerRoom(updatedAges);
  };

  const getMaxAdults = (roomType: string) => {
    switch (roomType) {
      case "Single":
        return 1;
      case "Double":
        return 2;
      case "Triple":
        return 3;
      case "Family":
        return 4;
      default:
        return 1;
    }
  };

  const handleChildrenChange = (roomIndex: number, value: number) => {
    const updatedChildren = [...childrenPerRoom];
    updatedChildren[roomIndex] = value;
    setChildrenPerRoom(updatedChildren);

    const updatedAges = [...childrenAgesPerRoom];
    updatedAges[roomIndex] = new Array(value)
      .fill(0)
      .map((_, index) => updatedAges[roomIndex]?.[index] || 3);
    setChildrenAgesPerRoom(updatedAges);
  };

  const handleInfantChange = (roomIndex: number, value: number) => {
    const updatedInfants = [...infantsPerRoom];
    updatedInfants[roomIndex] = value;
    setInfantsPerRoom(updatedInfants);

    const updatedAges = [...infantAgesPerRoom];
    updatedAges[roomIndex] = new Array(value)
      .fill(0)
      .map((_, index) => updatedAges[roomIndex]?.[index] || 0);
    setInfantAgesPerRoom(updatedAges);
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

  const getMaxChildren = (roomType: string, adultCount: number) => {
    switch (roomType) {
      case "Single":
        return 0;
      case "Double":
        return adultCount >= 1 ? 1 : 0;
      case "Triple":
        return adultCount >= 3 ? 1 : 2;
      case "Family":
        return adultCount >= 4 ? 1 : adultCount >= 3 ? 2 : 3;
      default:
        return 0;
    }
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

            <ol className="w-full list-decimal p-3 pl-6">
              <li className="mb-3 flex items-center justify-between lg:flex-row">
                <div className="font-bold text-black">
                  Description (24th Jun 2024 - 24th July 2024)
                </div>
                <div className="font-bold text-black">50%</div>
              </li>
              <li className="mb-3 flex items-center justify-between lg:flex-row">
                <div className="font-bold text-black">
                  Discount (24th Jun 2024 - 24th July 2024)
                </div>
                <div className="font-bold text-black">50%</div>
              </li>
            </ol>
          </div>
        </div>
        {/* Actiivities */}
    <div className="mb-12 mt-1 w-full rounded-md p-3 shadow-md shadow-black/50 lg:w-[50%] ">
    <h4 className="ml-3 text-xl font-bold text-black">
      Select Activities
    </h4>
    {responseDatas?.activities?.map((activity : any ,index: any) => (
        <div key={index} className="flex w-full items-center justify-between p-3 lg:flex-row">
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
                  checked={!!checkedItems[index]}
                  onChange={() => handleCheckboxChange(index)}
                />
                <div
                  className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                    checkedItems[index] ? "border-primary bg-gray dark:bg-transparent" : ""
                  }`}
                >
                  <span
                    className={`opacity-0 ${checkedItems[index] ? "!opacity-100" : ""}`}
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
          <div className="font-bold text-black">{(activity?.price)?.toLocaleString()}</div>
        </div>
      ))}

  </div>
  
    
        <div className="mb-4 mt-4 flex flex-col gap-4 lg:flex-row">
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
      onChange={handleRoomChange}
      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
    >
      <option value="">Choose a number of rooms</option>
      {responseDatas?.rooms?.map((_: any, index : any) => (
        <option key={index} value={index + 1}>
          {index + 1}
        </option>
      ))}
    </select>
  </div>
      {selectedRooms > 0 && (
            <div>
              <h3 className="text-xl font-medium text-black">Selected Rooms</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {responseDatas?.rooms.slice(0, selectedRooms).map((room : any, index : any) => (
                  <div
                    key={room.id}
                    className="w-12 h-[40px] border rounded p-2 flex items-center justify-center bg-gray-100"
                  >
                    {room.room_number}
                  </div>
                ))}
              </div>
            </div>
          )}
          

{selectedRooms > 0 && (
        <div className="mb-4 mt-4">
          <label htmlFor="mealPlan" className="mb-2 block text-xl font-medium text-black">
            Meal Plan
          </label>
          <select
            id="mealPlan"
            value={mealPlan}
            onChange={handleMealPlanChange}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
          >
            <option value="">Select a meal plan</option>
            <option value="room_only">Room Only</option>
            <option value="bread_breakfast">Bed and Breakfast</option>
            <option value="half_board">Half Board</option>
            <option value="full_board">Full Board</option>
          </select>
        </div>
      )}

      {selectedRooms > 0 && mealPlan && (
        <div>
          <h3 className="text-xl font-medium text-black">Prices for Selected Meal Plan</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {responseDatas?.rooms.slice(0, selectedRooms).map((room :any) => (
              <div
                key={room.id}
                className="w-full md:w-1/3 lg:w-1/4 border rounded p-2 flex flex-col items-start bg-gray-100"
              >
                <span className="text-lg font-medium">{room.room_number}</span>
                <span className="text-sm">Price: ${getMealPlanPrice(room, mealPlan)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
  </div>

      </div>
      {/* Adults, Children and Infants */}
      <div className="mb-12 flex flex-col gap-6 lg:flex-row">
        {numRooms > 0 &&
          [...Array(numRooms)].map((_, roomIndex) => (
            <div key={`room-${roomIndex}`} className="w-full lg:w-1/5">
              <label
                htmlFor={`adults-${roomIndex}`}
                className="mb-2 block text-xl  font-medium text-black"
              >
                Adults per Room
              </label>
              <select
                id={`adults-${roomIndex}`}
                value={adultsPerRoom[roomIndex]}
                onChange={(e) =>
                  handleAdultChange(roomIndex, parseInt(e.target.value, 10))
                }
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              >
                {Array.from(Array(getMaxAdults(room_type)).keys()).map(
                  (value) => (
                    <option key={value + 1} value={value + 1}>
                      {value + 1}
                    </option>
                  ),
                )}
              </select>
              {room_type !== "Single" && (
                <>
                  <label
                    htmlFor={`children-${roomIndex}`}
                    className="mb-2 mt-4 block text-xl font-medium text-black"
                  >
                    Children per Room
                  </label>
                  <select
                    id={`children-${roomIndex}`}
                    value={childrenPerRoom[roomIndex]}
                    onChange={(e) =>
                      handleChildrenChange(
                        roomIndex,
                        parseInt(e.target.value, 10),
                      )
                    }
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                  >
                    <option value="">Choose child count</option>
                    {Array.from(
                      {
                        length: getMaxChildren(
                          room_type,
                          adultsPerRoom[roomIndex],
                        ),
                      },
                      (_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1}
                        </option>
                      ),
                    )}
                  </select>
                </>
              )}

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

              {room_type !== "singleroom" && (
                <>
                  <label
                    htmlFor={`infants-${roomIndex}`}
                    className="mb-2 mt-4 block text-xl  font-medium text-black"
                  >
                    Infants per Room
                  </label>
                  <select
                    id={`infants-${roomIndex}`}
                    value={infantsPerRoom[roomIndex]}
                    onChange={(e) =>
                      handleInfantChange(
                        roomIndex,
                        parseInt(e.target.value, 10),
                      )
                    }
                    className="m w-full rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                  >
                    <option value="">Choose infant count</option>
                    {Array.from({ length: 4 }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </>
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

      <div className="w-full">
        <CreateGuestBooking />
      </div>

      {/* Total Info */}
          <div className="mb-4 mt-4 ">
          <div className="mb-4 text-2xl font-bold text-black">
                Total Rate
            </div>
          <div className="flex  w-full lg:flex-row items-center justify-between p-3">
          <div className="text-black  text-[20px]">Total Rooms with Meal Plan</div>
          <div className="text-black font-bold">50,000</div>
        </div>
        <div className="flex  w-full lg:flex-row items-center justify-between p-3">
          <div className="text-black text-[20px] ">Total Activities</div>
          <div className="text-black font-bold">50,000</div>
        </div>
        <div className="flex  w-full lg:flex-row items-center justify-between p-3">
          <div className="text-orange-500 text-[20px]">Discount & Special Rate</div>
          <div className=" font-bold text-orange-500">(-80,000)</div>
        </div>
        <div className="flex  w-full lg:flex-row items-center justify-between p-3 border-t-2 border-black mt-3">
          <div className="text-black font-bold text-[28px]">Total</div>
          <div className="text-black font-bold">50,000</div>
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
          onClick={() => {}}
          className="mt-4 h-12 w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 xl:w-1/5"
        >
          Proceed to Pay
        </button>
      </div>
    </div>
  );
};

export default BookingRoom;
