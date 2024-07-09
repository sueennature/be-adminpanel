'use client'
import React from 'react';
import roomData from '../../components/Datatables/roomsData.json';
import Image from 'next/image';
import { Edit, Trash, Eye, Plus } from 'react-feather';
import Link from 'next/link';


interface RoomData {
    id: number;
    name: string;
    noOfRoom: number;
    maxAdults: number;
    maxChilds: number;
    description: string;
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
    const [idFilter, setIdFilter] = React.useState<string>('');
    const [roomsSelection, setRoomsSelection] = React.useState<number[]>([]);;

    React.useEffect(() => {
        setRooms(roomData);
    }, []);

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        String(room.id).toLowerCase().includes(idFilter.toLowerCase())
    );

    const handleSelectAll = (e:React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.checked){
            const allRoomIds = filteredRooms.map(room => room.id);
            setRoomsSelection(allRoomIds)
        }else{
            setRoomsSelection([]);
        }
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, roomId: number) => {
        if (e.target.checked) {
            setRoomsSelection(prevSelected => [...prevSelected, roomId]);
        } else {
            setRoomsSelection(prevSelected => prevSelected.filter(id => id !== roomId));
        }
    };
  return (
    <div>
    <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-4'>
            <input
                type='text'
                placeholder='Search by Name'
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className='px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {/* <input
                type='text'
                placeholder='Search by ID'
                value={idFilter}
                onChange={(e) => setIdFilter(e.target.value)}
                className='px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            /> */}
        </div>
        <div className='text-blue-400 cursor-pointer'>
            <Link href='/rooms/createRoom'>
                <Plus />
            </Link>
        </div>
    </div>
         <div className='bg-white '>
              <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                                <input
                                    id="checkbox-all-search"
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={roomsSelection.length === filteredRooms.length}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label htmlFor="checkbox-all-search" className="sr-only">
                                    checkbox
                                </label>
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">id</th>
                        <th scope="col" className="px-6 py-3">Name
                        </th>
                        <th scope="col" className="px-6 py-3">No of Room</th>
                        <th scope="col" className="px-6 py-3">Max Adults</th>
                        <th scope="col" className="px-6 py-3"> Max Childs</th>
                        <th scope="col" className="px-6 py-3">Description</th>
                        <th scope="col" className="px-6 py-3">Features</th>
                        <th scope="col" className="px-6 py-3">Beds</th>
                        <th scope="col" className="px-6 py-3">Size</th>
                        <th scope="col" className="px-6 py-3">Bathrooms</th>
                        <th scope="col" className="px-6 py-3">Images</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRooms.map((room) => (
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
                            <td className="px-6 py-4">{room.noOfRoom}</td>
                            <td className="px-6 py-4">{room.maxAdults}</td>
                            <td className="px-6 py-4">{room.maxChilds}</td>
                            <td className="px-6 py-4">{room.description}</td>
                            <td className="px-6 py-4">{room.features.join(', ')}</td>
                            <td className="px-6 py-4">{room.beds}</td>
                            <td className="px-6 py-4">{room.size}</td>
                            <td className="px-6 py-4">{room.bathroom}</td>
                            <td className="px-6 py-4" style={{ minWidth: '200px' }}>
                                <div className="flex items-center gap-2">
                                    {room.images.map((image, index) => (
                                        <div key={index} className="flex-shrink-0">
                                            <Image src={image} alt={room.name} width={50} height={50} />
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4 ">
                                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        <Edit />
                                    </a>
                                    <a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline">
                                        <Trash />
                                    </a>
                                    <a href="#" className="font-medium text-green-600 dark:text-green-500 hover:underline">
                                        <Eye />
                                    </a>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    </div>
   
  )
}

export default RoomTable