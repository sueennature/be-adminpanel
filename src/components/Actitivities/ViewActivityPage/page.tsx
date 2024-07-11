'use client'
import React from 'react';
import activityData from '../../../components/Datatables/activityData.json';
import Image from 'next/image';
import { Edit, Trash, Eye, Plus } from 'react-feather';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CSVLink } from 'react-csv';

interface ActivityData {
    id: number;
    name: string;
    description: string;
    amount: number;
    image: string;
    
}

const ViewActivity = () => {
    const [activities, setActivities] = React.useState<ActivityData[]>([]);
    const [nameFilter, setNameFilter] = React.useState<string>('');
    const [activitiesSelection, setActivitiesSelection] = React.useState<number[]>([]);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);
    const router = useRouter();
    const [idFilter, setIdFilter] = React.useState<string>('');

    React.useEffect(() => {
        setActivities(activityData);
    }, []);

    const filteredActivities = activities.filter(activity =>
        activity.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        String(activity.id).toLowerCase().includes(idFilter.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredActivities.slice(indexOfFirstItem, indexOfLastItem);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allActivityds = currentItems.map((activity) => activity.id);
            setActivitiesSelection(allActivityds);
        } else {
            setActivitiesSelection([]);
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, roomId: number) => {
        if (e.target.checked) {
            setActivitiesSelection((prevSelected) => [...prevSelected, roomId]);
        } else {
            setActivitiesSelection((prevSelected) => prevSelected.filter((id) => id !== roomId));
        }
    };

    const handleEditPush = (roomData: any) => {
        router.push(`/activity/update/${roomData.id}`);
    };

    const handleViewPush = (roomData: any) => {
        router.push(`/activity/view/${roomData.id}`);
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
    const csvData = filteredActivities.map(({ id,name,description, amount}) => ({
        id,
        name,
        description,
        amount,
        
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
                    <Link href="/activity/createActivity">
                        <Plus />
                    </Link>
                </div>
            </div>
        
            <div className="bg-white">
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
                                            checked={activitiesSelection.length === currentItems.length}
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
                                    Activity Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Image
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                              
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((activity) => (
                                <tr
                                    key={activity.id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-black"
                                >
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input
                                                id={`checkbox-table-search-${activity.id}`}
                                                type="checkbox"
                                                checked={activitiesSelection.includes(activity.id)}
                                                onChange={(e) => handleCheckboxChange(e, activity.id)}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                            <label htmlFor={`checkbox-table-search-${activity.id}`} className="sr-only">
                                                checkbox
                                            </label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{activity.id}</td>
                                    <td className="px-6 py-4">{activity.name}</td>
                                    <td className="px-6 py-4" style={{ minWidth: '200px' }}>{activity.description}</td>
                                    <td className="px-6 py-4" style={{ minWidth: '200px' }}>LKR {(activity.amount).toLocaleString()}</td>
                                    <td className="px-6 py-4" style={{ minWidth: '200px' }}>
                                            <Image src={activity.image} alt={activity.image} width={50} height={50} />                            
                                            </td>                                    
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4 ">
                                    <button onClick={()=>handleEditPush(activity)}  className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        <Edit />
                                    </button>
                                    <button onClick={()=>handleViewPush(activity)} className="font-medium text-green-600 dark:text-red-500 hover:underline">
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
                        disabled={indexOfLastItem >= filteredActivities.length}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md cursor-pointer"
                    >
                        Next
                    </button>
                  </div>
                </div>
            </div>
            <div className='flex justify-end w-full mt-7 '>
                <CSVLink data={csvData} filename={"Activities.csv"} className="justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                    Export as CSV
                </CSVLink>
            </div>
        </div>
    );
};

export default ViewActivity;
