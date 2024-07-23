'use client'
import React from 'react';
import roomData from '../../components/Datatables/roomsData.json';
import Image from 'next/image';
import { Edit, Trash, Eye, Plus } from 'react-feather';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CSVLink } from 'react-csv';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import NoData from "@/components/NoData";
import Loader from "@/components/common/Loader";

interface RoomData {
    id: number;
    name: string;
    category: string,
    max_adults: number;
    max_childs: number;
    max_people:number;
    room_only: number,
    bread_breakfast: number,
    half_board:number,
    full_board: number,
    description: string;
    secondary_category:string;
    features: string[];
    beds: string;
    size: string;
    bathroom: string;
    images: string[];
    action: string;
}

const RoomTable = () => {
    const [rooms, setRooms] = React.useState<RoomData[]>([]);
    const [nameFilter, setNameFilter] = React.useState<string>('');
    const [roomsSelection, setRoomsSelection] = React.useState<number[]>([]);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);
    const [loading, setLoading] = React.useState<boolean>(true);

    const router = useRouter();
 
    const [idFilter, setIdFilter] = React.useState<string>('');

    // React.useEffect(() => {
    //     setRooms(roomData);
    // }, []);
    React.useEffect(() => {
        const fetchUsers= async () => {
          try {
            const accessToken = Cookies.get('access_token'); 
           
            const response = await axios.get('https://api.sueennature.com/rooms', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'x-api-key': process.env.X_API_KEY, 
                },
            });
            console.log(response.data);
            setRooms(response.data)
          } catch (err) {
            console.log(err);
          }
        };
    
        fetchUsers();
      }, []);
    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        String(room.id).toLowerCase().includes(idFilter.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allRoomIds = currentItems.map((room) => room.id);
            setRoomsSelection(allRoomIds);
        } else {
            setRoomsSelection([]);
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, roomId: number) => {
        if (e.target.checked) {
            setRoomsSelection((prevSelected) => [...prevSelected, roomId]);
        } else {
            setRoomsSelection((prevSelected) => prevSelected.filter((id) => id !== roomId));
        }
    };

    const handleEditPush = (roomData: any) => {
        router.push(`/rooms/update/${roomData.id}`);
    };

    const handleViewPush = (roomData: any) => {
        router.push(`/rooms/view/${roomData.id}`);
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        if (url.startsWith('http://') || url.startsWith('https://')) {
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
          toast.success("User Deleted Successfully");
        } catch (err) {
          console.error(err);
          toast.error(
            "There was an error deleting the user. Please try again later",
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
    
    const csvData = filteredRooms.map(({ id, name,  max_adults, max_childs,max_people,description, features, beds, size, bathroom,category, secondary_category,room_only, bread_breakfast,half_board,full_board }) => ({
        id,
        name,
        max_adults,
        max_childs,
        max_people,
        description,
        category, 
        secondary_category,
        room_only, 
        bread_breakfast,
        half_board,
        full_board,
        features,
        beds,
        size,
        bathroom,
    }));
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search by Name"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="text-blue-400 cursor-pointer">
                    <Link href="/rooms/createRoom">
                        <Plus />
                    </Link>
                </div>
            </div>
        
            <div className="bg-white">
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <table className=" text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 able-fixed w-full" >
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input
                                            id="checkbox-all-search"
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={roomsSelection.length === currentItems.length}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label htmlFor="checkbox-all-search" className="sr-only">
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
                                    Features
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Beds
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Size
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
                                    Second Category
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Bathrooms
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
                            {currentItems.map((room) => (
                                <tr
                                    key={room.id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-black"
                                >
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input
                                                id={`checkbox-table-search-${room.id}`}
                                                type="checkbox"
                                                checked={roomsSelection.includes(room.id)}
                                                onChange={(e) => handleCheckboxChange(e, room.id)}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                            <label htmlFor={`checkbox-table-search-${room.id}`} className="sr-only">
                                                checkbox
                                            </label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{room.id}</td>
                                    <td className="px-6 py-4">{room.name}</td>
                                    <td className="px-6 py-4">{room.category}</td>
                                    <td className="px-6 py-4">{room.max_adults}</td>
                                    <td className="px-6 py-4">{room.max_childs}</td>
                                    <td className="px-6 py-4">{room.max_people}</td>
                                    <td className="px-6 py-4">{room.description}</td>
                                    <td className="px-6 py-4">{room.features}</td>
                                    <td className="px-6 py-4">{room.beds}</td>
                                    <td className="px-6 py-4">{room.size}</td>
                                    <td className="px-6 py-4">{(room.room_only).toLocaleString()}</td>
                                    <td className="px-6 py-4">{(room.bread_breakfast).toLocaleString()}</td>
                                    <td className="px-6 py-4">{(room.half_board).toLocaleString()}</td>
                                    <td className="px-6 py-4">{(room.full_board).toLocaleString()}</td>
                                    <td className="px-6 py-4">{room.secondary_category}</td>
                                    <td className="px-6 py-4">{room.bathroom}</td>
                                    <td className="px-6 py-4 overflow-x-auto min-w-[200px]">
                                        <div className="flex items-center gap-2">
                                            {room.images.map((image, index) => (
                                                <div key={index} className="flex-shrink-0 w-20 h-20 overflow-hidden">
                                                    <Image 
                                                        src={image} 
                                                        alt={room.name} 
                                                        width={80} 
                                                        height={80} 
                                                        className="object-cover w-full h-full" 
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </td>


                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4 ">
                                    <button onClick={()=>handleEditPush(room)}  className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        <Edit />
                                    </button>
                                    <button onClick={()=>handleViewPush(room)} className="font-medium text-green-600 dark:text-red-500 hover:underline">
                                    <Eye /> 
                                    </button>
                                    <button
                                  className="font-medium text-rose-600  hover:underline"
                                  onClick={() => confirmDelete(room.id)}
                                >
                                  <Trash />
                                </button>
                                </div>
                            </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between mt-4 p-4">
                <div className="flex items-center gap-4">
                <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="px-3 py-1 mr-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md cursor-pointer"
                    >
                        Previous
                    </button>
                    <button
                        onClick={nextPage}
                        disabled={indexOfLastItem >= filteredRooms.length}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md cursor-pointer"
                    >
                        Next
                    </button>
                  </div>
                </div>
            </div>
            <div className='flex justify-end w-full mt-7 '>
                <CSVLink data={csvData} filename={"Rooms.csv"} className="justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                    Export as CSV
                </CSVLink>
            </div>
        </div>
    );
};

export default RoomTable;
