'use client'
import React from 'react';
import usersData from '../../../components/Datatables/usersTable.json';
import Image from 'next/image';
import { Edit, Trash, Eye, Plus } from 'react-feather';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CSVLink } from 'react-csv';


interface userData {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
    is_superadmin:string;
    role: string;

}


const ViewAllUsers = () => {

    const [guests, setGuests] = React.useState<any[]>([]);
    const [nameFilter, setNameFilter] = React.useState<string>('');
    const [idFilter, setIdFilter] = React.useState<string>('');
    const [guestSelection, setGuestSelection] = React.useState<number[]>([]);;
    const [currentPage ,setCurrentPage] = React.useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);


    const router = useRouter();

    React.useEffect(() => {
        setGuests(usersData);
    }, []);

    const filteredGuests= guests.filter(guest =>
        guest.username.toLowerCase().includes(nameFilter.toLowerCase()) &&
        String(guest.id).toLowerCase().includes(idFilter.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredGuests.slice(indexOfFirstItem, indexOfLastItem);

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>)=>{
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    
    const nextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const prevPage = () => {
        setCurrentPage((prev) => prev - 1);
    };

    const handleSelectAll = (e:React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.checked){
            const allGuestIds = currentItems.map(guest => guest.id);
            setGuestSelection(allGuestIds)
        }else{
            setGuestSelection([]);
        }
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, roomId: number) => {
        if (e.target.checked) {
            setGuestSelection(prevSelected => [...prevSelected, roomId]);
        } else {
            setGuestSelection(prevSelected => prevSelected.filter(id => id !== roomId));
        }
    };


    const handleEditPush =(roomData: any)=>{
        router.push(`/users/update/${roomData.id}`)
    }

    const handleViewPush =(roomData: any)=>{
        router.push(`/users/view/${roomData.id}`)
    }
    const csvData = filteredGuests.map(({ id, username, email, role, is_active, is_superadmin,  }) => ({
        id, 
        username, 
        email, 
        role, 
        is_active, 
        is_superadmin,
    }));
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
            <Link href='/users/create'>
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
                                    checked={guestSelection.length === currentItems.length}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label htmlFor="checkbox-all-search" className="sr-only">
                                    checkbox
                                </label>
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">id</th>
                        <th scope="col" className="px-6 py-3">Username</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Role</th>
                        <th scope="col" className="px-6 py-3">Active</th>
                        <th scope="col" className="px-6 py-3">Super Admin</th>
                        <th scope="col" className="px-6 py-3">Action</th>

                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((user) => (
                        <tr
                            key={user.id}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-black"
                        >
                            <td className="w-4 p-4">
                                <div className="flex items-center">
                                    <input
                                        id={`checkbox-table-search-${user.id}`}
                                        type="checkbox"
                                        checked={guestSelection.includes(user.id)}
                                        onChange={(e) => handleCheckboxChange(e, user.id)}
                                    
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor={`checkbox-table-search-${user.id}`} className="sr-only">
                                        checkbox
                                    </label>
                                </div>
                            </td>
                            <td className="px-6 py-4">{user.id}</td>
                            <td className="px-6 py-4">{user.username}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">{user.role  === "admin" ? "Admin" :user.role  === "guest" ? "Guest" : "Channel Manager" }</td>
                            <td className="px-6 py-4 text-black">{user.is_active ? "Active" : "Inactive"}</td>
                            <td className="px-6 py-4 text-black">{user.is_superadmin ? "Yes" : "No"}</td>

                            
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4 ">
                                    <button onClick={()=>handleEditPush(user)}  className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        <Edit />
                                    </button>
                                    <button onClick={()=>handleViewPush(user)} className="font-medium text-green-600 dark:text-red-500 hover:underline">
                                    <Eye /> 
                                    </button>
                                    <a href="#" className="font-medium text-rose-600  hover:underline">
                                      <Trash />
                                    </a>
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
                        disabled={indexOfLastItem >= filteredGuests.length}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md cursor-pointer"
                    >
                        Next
                    </button>
                  </div>
                </div>
        </div>
        <div className='flex justify-end w-full mt-7 '>
                <CSVLink data={csvData} filename={"Guests.csv"} className="justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                    Export as CSV
                </CSVLink>
            </div>
    </div>
   
  )
}

export default ViewAllUsers