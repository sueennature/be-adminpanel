"use client";
import React from "react";
import roomData from "../../components/Datatables/roomsData.json";
import Image from "next/image";
import { Edit, Trash, Eye, Plus } from "react-feather";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CSVLink } from "react-csv";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import NoData from "@/components/NoData";
import Loader from "@/components/common/Loader";
import { useUserContext } from "@/hooks/useUserContext";

interface RoomData {
  id: number;
  room_number: string;
  category: string;
  max_adults: number;
  max_childs: number;
  max_people: number;
  room_only: number;
  bread_breakfast: number;
  half_board: number;
  full_board: number;
  description: string;
  short_description: string;
  view: string;
  secondary_category: string;
  views: string;
  secondary_max_adults: number;
  secondary_max_childs: number;
  secondary_max_people: number;
  secondary_short_description: string;
  secondary_description: string;
  secondary_room_only: number;
  secondary_bread_breakfast: number;
  secondary_half_board: number;
  secondary_full_board: number;
  secondary_bathroom: string;
  secondary_size: string;
  secondary_beds: string;
  secondary_features: string;
  features: string[];
  beds: string;
  size: string;
  bathroom: string;
  images: string[];
  action: string;
}

const RoomTable = () => {
  const [rooms, setRooms] = React.useState<RoomData[]>([]);
  const [nameFilter, setNameFilter] = React.useState<string>("");
  const [roomsSelection, setRoomsSelection] = React.useState<number[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { groupFour, groupTwo } = useUserContext();
  const router = useRouter();
  const BE_URL = process.env.BE_URL;

  const [idFilter, setIdFilter] = React.useState<string>("");

  // React.useEffect(() => {
  //     setRooms(roomData);
  // }, []);
  React.useEffect(() => {
    const fetchRooms = async () => {
      try {
        const accessToken = Cookies.get("access_token");

        const response = await axios.get(`${BE_URL}/rooms/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "x-api-key": process.env.X_API_KEY,
          },
        });
        console.log(response.data);
        setLoading(false);
        setRooms(response.data);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };

    fetchRooms();
  }, []);
  const filteredRooms = rooms.filter(
    (room) =>
      room.category.toLowerCase().includes(nameFilter.toLowerCase()) &&
      String(room.id).toLowerCase().includes(idFilter.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);
  {
    console.log("currentItems", currentItems);
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allRoomIds = currentItems.map((room) => room.id);
      setRoomsSelection(allRoomIds);
    } else {
      setRoomsSelection([]);
    }
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    roomId: number,
  ) => {
    if (e.target.checked) {
      setRoomsSelection((prevSelected) => [...prevSelected, roomId]);
    } else {
      setRoomsSelection((prevSelected) =>
        prevSelected.filter((id) => id !== roomId),
      );
    }
  };

  const handleEditPush = (roomData: any) => {
    router.push(`/rooms/update/update?roomID=${roomData.id}`);
  };

  const handleViewPush = (roomData: any) => {
    router.push(`/rooms/view/view?roomID=${roomData.id}`);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const nextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const formatImageUrl = (url: string) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `/${url}`;
  };
  const handleDelete = async (userId: number) => {
    const accessToken = Cookies.get("access_token");

    try {
      await axios.delete(`${process.env.BE_URL}/rooms/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });
      setRooms((prevGuests) =>
        prevGuests.filter((guest) => guest.id !== userId),
      );
      toast.success("Room Deleted Successfully");
    } catch (err) {
      console.error(err);
      toast.error(
        "There was an error deleting the room. Please try again later",
      );
    }
  };

  const confirmDelete = (userId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(userId);
      }
    });
  };

  const csvData = filteredRooms.map(
    ({
      id,
      room_number,
      max_adults,
      max_childs,
      max_people,
      description,
      short_description,
      features,
      beds,
      size,
      bathroom,
      category,
      room_only,
      bread_breakfast,
      half_board,
      view,
      full_board,
      views,
      secondary_category,
      secondary_max_adults,
      secondary_max_childs,
      secondary_max_people,
      secondary_short_description,
      secondary_description,
      secondary_room_only,
      secondary_bread_breakfast,
      secondary_half_board,
      secondary_full_board,
      secondary_bathroom,
      secondary_size,
      secondary_beds,
      secondary_features,
    }) => ({
      id,
      room_number,
      max_adults,
      max_childs,
      max_people,
      description,
      short_description,
      category,
      room_only,
      bread_breakfast,
      half_board,
      full_board,
      features,
      beds,
      view,
      size,
      bathroom,
      views,
      secondary_category,
      secondary_max_adults,
      secondary_max_childs,
      secondary_max_people,
      secondary_short_description,
      secondary_description,
      secondary_room_only,
      secondary_bread_breakfast,
      secondary_half_board,
      secondary_full_board,
      secondary_bathroom,
      secondary_size,
      secondary_beds,
      secondary_features,
    }),
  );
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        {rooms.length > 0 && groupFour && (
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by Name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="cursor-pointer text-blue-400">
          {groupFour && (
            <Link href="/rooms/createRoom">
              <Plus />
            </Link>
          )}
        </div>
      </div>
      {!loading ? (
        <div>
          {currentItems.length > 0 ? (
            <div>
              <div className="bg-white">
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                  <table className=" text-gray-500 dark:text-gray-400 able-fixed w-full text-left text-sm rtl:text-right">
                    <thead className="text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-xs uppercase">
                      <tr>
                        <th scope="col" className="p-4">
                          <div className="flex items-center">
                            <input
                              id="checkbox-all-search"
                              type="checkbox"
                              onChange={handleSelectAll}
                              checked={
                                roomsSelection.length === currentItems.length
                              }
                              className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                            />
                            <label
                              htmlFor="checkbox-all-search"
                              className="sr-only"
                            >
                              checkbox
                            </label>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                          id
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Max Adults
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Max Childs
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Max People
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Short Description
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Features
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Beds
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Size
                        </th>
                        <th scope="col" className="px-6 py-3">
                          View
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Room Only
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Bread and Breakfast
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Half Board
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Full Board
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Bathrooms
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Views
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Second Category
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Secondary Max Adults
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Secondary Max Childs
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Secondary Max People
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Secondary Description
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Secondary Short Description
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Secondary Features
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Secondary Beds
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Secondary Size
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Secondary Bathrooms
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Secondary Room Only
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Secondary Bread and Breakfast
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Secondary Half Board
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Secondary Full Board
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Images
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems?.map((room) => (
                        <tr
                          key={room?.id}
                          className="dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-b bg-white text-black"
                        >
                          <td className="w-4 p-4">
                            <div className="flex items-center">
                              <input
                                id={`checkbox-table-search-${room?.id}`}
                                type="checkbox"
                                checked={roomsSelection.includes(room?.id)}
                                onChange={(e) =>
                                  handleCheckboxChange(e, room?.id)
                                }
                                className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                              />
                              <label
                                htmlFor={`checkbox-table-search-${room?.id}`}
                                className="sr-only"
                              >
                                checkbox
                              </label>
                            </div>
                          </td>
                          <td className="px-6 py-4">{room?.id}</td>
                          <td className="px-6 py-4">{room?.room_number}</td>
                          <td className="px-6 py-4">{room?.category}</td>
                          <td className="px-6 py-4">{room?.max_adults}</td>
                          <td className="px-6 py-4">{room?.max_childs}</td>
                          <td className="px-6 py-4">{room?.max_people}</td>
                          <td className="px-6 py-4">{room?.description}</td>
                          <td className="px-6 py-4">
                            {room?.short_description}
                          </td>
                          <td className="px-6 py-4">{room?.features}</td>
                          <td className="px-6 py-4">{room?.beds}</td>
                          <td className="px-6 py-4">{room?.size}</td>
                          <td className="px-6 py-4">{room?.view}</td>
                          <td className="px-6 py-4">
                            {room?.room_only.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            {room?.bread_breakfast.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            {room?.half_board.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            {room?.full_board.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">{room?.bathroom}</td>
                          <td className="px-6 py-4">{room?.views}</td>
                          <td className="px-6 py-4">
                            {room?.secondary_category}
                          </td>
                          <td className="px-6 py-4">
                            {room?.secondary_max_adults}
                          </td>
                          <td className="px-6 py-4">
                            {room?.secondary_max_childs}
                          </td>
                          <td className="px-6 py-4">
                            {room?.secondary_max_people}
                          </td>
                          <td className="px-6 py-4">
                            {room?.secondary_description
                              ? room.secondary_description
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {room?.secondary_short_description
                              ? room.secondary_short_description
                              : " N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {room?.secondary_features
                              ? room.secondary_features
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {room?.secondary_beds ? room.secondary_beds : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {room?.secondary_size ? room.secondary_size : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {room?.secondary_bathroom
                              ? room.secondary_bathroom
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {room?.secondary_room_only
                              ? room.secondary_room_only.toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {room?.secondary_bread_breakfast
                              ? room.secondary_bread_breakfast.toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {room?.secondary_half_board
                              ? room.secondary_half_board.toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {room?.secondary_full_board
                              ? room.secondary_full_board.toLocaleString()
                              : "N/A"}
                          </td>

                          <td className="min-w-[200px] overflow-x-auto px-6 py-4">
                            <div className="flex items-center gap-2">
                              {room?.images?.map((image, index) => (
                                <div
                                  key={index}
                                  className="h-20 w-20 flex-shrink-0 overflow-hidden"
                                >
                                  <Image
                                    src={
                                      image.startsWith("data:")
                                        ? image
                                        : `${process.env.BE_URL}/${image}`
                                    }
                                    alt={room?.room_number}
                                    width={80}
                                    height={80}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4 ">
                              {groupFour && (
                                <button
                                  onClick={() => handleEditPush(room)}
                                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                >
                                  <Edit />
                                </button>
                              )}
                              <button
                                onClick={() => handleViewPush(room)}
                                className="dark:text-red-500 font-medium text-green-600 hover:underline"
                              >
                                <Eye />
                              </button>
                              {groupTwo && (
                                <button
                                  className="font-medium text-rose-600  hover:underline"
                                  onClick={() => confirmDelete(room?.id)}
                                >
                                  <Trash />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-between p-4">
                  <div className="flex items-center gap-4">
                    <select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="rounded-md border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={30}>50</option>
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
                      disabled={indexOfLastItem >= filteredRooms.length}
                      className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-pointer rounded-md px-3 py-1"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex w-full justify-end ">
                <CSVLink
                  data={csvData}
                  filename={"Rooms.csv"}
                  className="justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  Export as CSV
                </CSVLink>
              </div>
            </div>
          ) : (
            <NoData />
          )}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default RoomTable;
