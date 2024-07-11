"use client";
import React, { useState } from "react";

interface BookingRoomData {
  room_type: any;
  room_type_view: string;
}

const BookingRoom: React.FC<BookingRoomData> = ({
  room_type,
  room_type_view,
}) => {
  const [numRooms, setNumRooms] = useState<number>(0);
  const [adultsPerRoom, setAdultsPerRoom] = useState<number[]>([]);
  const [childrenPerRoom, setChildrenPerRoom] = useState<number[]>([]);
  const [childrenAgesPerRoom, setChildrenAgesPerRoom] = useState<number[][]>([]);
  const [infantsPerRoom, setInfantsPerRoom] = useState<number[]>([]);
  const [infantAgesPerRoom, setInfantAgesPerRoom] = useState<number[][]>([]);

  const handleRoomChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRooms = parseInt(event.target.value, 10);
    setNumRooms(selectedRooms);
    setAdultsPerRoom(new Array(selectedRooms).fill(1));
    setChildrenPerRoom(new Array(selectedRooms).fill(0));
    setChildrenAgesPerRoom(new Array(selectedRooms).fill([]));
    setInfantsPerRoom(new Array(selectedRooms).fill(0));
    setInfantAgesPerRoom(new Array(selectedRooms).fill([]));
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
      case "singleroom":
        return 1;
      case "doubleroom":
        return 2;
      case "tripleroom":
        return 3;
      case "familyroom":
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
      case "singleroom":
        return 0;
      case "doubleroom":
        return adultCount >= 1 ? 1 : 0;
      case "tripleroom":
        return adultCount >= 3 ? 1 : 2;
      case "familyroom":
        return adultCount >= 4 ? 1 : adultCount >= 3 ? 2 : 3;
      default:
        return 0;
    }
  };

  const roomTypeMapping: Record<string, string> = {
    singleroom: "Single Room",
    doubleroom: "Double Room",
    tripleroom: "Triple Room",
    familyroom: "Family Room",
  };

  return (
    <div className="w-full mx-auto px-4">
      <div className="pb-6">
        <div className="text-lg font-medium mb-2">Book your Room</div>
        <div className="text-xl font-bold mb-2">{roomTypeMapping[room_type]}</div>
        <div className="text-sm text-gray-500 mb-4">{room_type_view}</div>
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:w-1/5">
            <label htmlFor="roomNumber" className="block mb-2 text-sm font-medium text-black">
              Rooms
            </label>
            <select
              id="roomNumber"
              required
              onChange={handleRoomChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
            >
              <option value="">Choose a number of rooms</option>
              {[1, 2, 3, 4].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full lg:w-1/5">
            <label htmlFor="roomView" className="block mb-2 text-sm font-medium text-black">
              Room View
            </label>
            <select
              id="roomView"
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
            >
              <option value="">Choose a room view</option>
              <option value="gardenview">Garden View</option>
              <option value="poolview">Pool View</option>
              <option value="hillview">Hill View</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        {numRooms > 0 &&
          [...Array(numRooms)].map((_, roomIndex) => (
            <div key={`room-${roomIndex}`} className="w-full lg:w-1/5">
              <label htmlFor={`adults-${roomIndex}`} className="block mb-2 text-sm font-medium text-black">
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
                {Array.from(Array(getMaxAdults(room_type)).keys()).map((value) => (
                  <option key={value + 1} value={value + 1}>
                    {value + 1}
                  </option>
                ))}
              </select>
              <label htmlFor={`children-${roomIndex}`} className="block mt-4 mb-2 text-sm font-medium text-black">
                Children per Room
              </label>
              <select
                id={`children-${roomIndex}`}
                value={childrenPerRoom[roomIndex]}
                onChange={(e) =>
                  handleChildrenChange(roomIndex, parseInt(e.target.value, 10))
                }
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              >
                <option value="">Choose child count</option>
                {Array.from({ length: getMaxChildren(room_type, adultsPerRoom[roomIndex]) }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              {childrenPerRoom[roomIndex] > 0 && (
                <div className="mt-4">
                  {[...Array(childrenPerRoom[roomIndex])].map((_, childIndex) => (
                    <select
                      key={`child-${roomIndex}-${childIndex}`}
                      value={childrenAgesPerRoom[roomIndex][childIndex] || ""}
                      onChange={(e) =>
                        handleChildAgeChange(roomIndex, childIndex, parseInt(e.target.value, 10))
                      }
                      className="w-full mb-4 rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                    >
                      <option value="">Choose age</option>
                      <option value="3">3 - 6 years</option>
                      <option value="6">6 - 10 years</option>
                    </select>
                  ))}
                </div>
              )}
              <label htmlFor={`infants-${roomIndex}`} className="block mt-4 mb-2 text-sm font-medium text-black">
                Infants per Room
              </label>
              <select
                id={`infants-${roomIndex}`}
                value={infantsPerRoom[roomIndex]}
                onChange={(e) =>
                  handleInfantChange(roomIndex, parseInt(e.target.value, 10))
                }
                className="w-full m rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              >
                <option value="">Choose infant count</option>
                {Array.from({ length: 4 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              {infantsPerRoom[roomIndex] > 0 && (
                <div className="mt-4">
                  {[...Array(infantsPerRoom[roomIndex])].map((_, infantIndex) => (
                    <select
                      key={`infant-${roomIndex}-${infantIndex}`}
                      value={infantAgesPerRoom[roomIndex][infantIndex]}
                      onChange={(e) =>
                        handleInfantAgeChange(roomIndex, infantIndex, parseInt(e.target.value, 10))
                      }
                      className="w-full mb-4 rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                    >
                      <option value="">Choose age</option>
                      <option value="0">0</option>
                      {[...Array(4)].map((_, age) => (
                        <option key={age + 1} value={age + 1}>
                          {age + 1}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default BookingRoom;
