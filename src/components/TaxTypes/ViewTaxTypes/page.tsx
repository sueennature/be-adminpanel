'use client'
import React, { useEffect } from 'react';
import taxData from '../../../components/Datatables/taxData.json'
import Image from 'next/image';
import { Edit, Trash, Eye, Plus } from 'react-feather';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CSVLink } from 'react-csv';
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import NoData from "@/components/NoData";
import Loader from "@/components/common/Loader";
import useAuth from '@/hooks/useAuth';
import checkToken from '@/utils/checkToken';


interface taxData {
    id: number;
    name: number;
    description: string;
    percentage: number;
    tax_type:string;
    
}

const ViewTaxTypes = () => {



    const [discounts, setDiscounts] = React.useState<any[]>([]);
    const [nameFilter, setNameFilter] = React.useState<string>('');
    const [discountsSelection, setDiscountsSelection] = React.useState<number[]>([]);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);
    const router = useRouter();
    const [idFilter, setIdFilter] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(true);

    
    React.useEffect(()=>{
        const token = Cookies.get('access_token');
        if(!token){
            return router.push('/')
        }
    },[router])

    
    const filteredDiscounts = discounts.filter(activity =>
        activity.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        String(activity.id).toLowerCase().includes(idFilter.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDiscounts.slice(indexOfFirstItem, indexOfLastItem);


    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allDiscountids = currentItems.map((activity) => activity.id);
            setDiscountsSelection(allDiscountids);
        } else {
            setDiscountsSelection([]);
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, roomId: number) => {
        if (e.target.checked) {
            setDiscountsSelection((prevSelected) => [...prevSelected, roomId]);
        } else {
            setDiscountsSelection((prevSelected) => prevSelected.filter((id) => id !== roomId));
        }
    };

    const handleEditPush = (roomData: any) => {
        router.push(`/taxtypes/update/update?taxID=${roomData.id}`);

    };

    const handleViewPush = (roomData: any) => {
        router.push(`/taxtypes/view/view?taxID=${roomData.id}`);
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
    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const accessToken = Cookies.get("access_token");
    
            const response = await axios.get(`${process.env.BE_URL}/taxes`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            });
            console.log(response.data);
            setDiscounts(response.data);
            setLoading(false);
          } catch (err) {
            setLoading(false);
            console.log(err);
          }
        };
        
        fetchUsers();
      }, []);
      const handleDelete = async (userId: number) => {
        const accessToken = Cookies.get("access_token");
    
        try {
          await axios.delete(`${process.env.BE_URL}/taxes/${userId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              "x-api-key": process.env.X_API_KEY,
            },
          });
          setDiscounts((prevGuests) =>
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
    const csvData = filteredDiscounts.map(({ id,name,description,percentage,tax_type}) => ({
        id,
        name,
        description,
        tax_type,
        percentage,
        
    }));
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
             {discounts.length > 0 && (
                   <div className="flex items-center gap-4">
                   <input
                       type="text"
                       placeholder="Search by Name"
                       value={nameFilter

                       }
                       onChange={(e) => setNameFilter(e.target.value)}
                       className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   />
               </div>
             )}
                <div className="text-blue-400 cursor-pointer">
                    <Link href="/taxtypes/createtaxtype">
                        <Plus />
                    </Link>
                </div>
            </div>
            {!loading ? (
                   <div>        
                 {currentItems.length > 0 ? (
                     <div>
       
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
                                                     checked={discountsSelection.length === currentItems.length}
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
                                             Description
                                         </th>
                                       
                                         <th scope="col" className="px-6 py-3">
                                             Percentage
                                         </th>
                                         <th scope="col" className="px-6 py-3">
                                             Tax Type
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
                                                         checked={discountsSelection.includes(activity.id)}
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
                                             <td className="px-6 py-4" style={{ minWidth: '200px' }}> {activity.percentage}%</td>
                                             <td className="px-6 py-4" style={{ minWidth: '200px' }}> {activity.tax_type}</td>
         
         
                                     <td className="px-6 py-4">
                                         <div className="flex items-center gap-4 ">
                                             <button onClick={()=>handleEditPush(activity)}  className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                 <Edit />
                                             </button>
                                             <button onClick={()=>handleViewPush(activity)} className="font-medium text-green-600 dark:text-red-500 hover:underline">
                                             <Eye /> 
                                             </button>
                                             <button  onClick={() => confirmDelete(activity.id)}className="font-medium text-rose-600  hover:underline">
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
                                 disabled={indexOfLastItem >= filteredDiscounts.length}
                                 className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md cursor-pointer"
                             >
                                 Next
                             </button>
                           </div>
                         </div>
                     </div>
                     <div className='flex justify-end w-full mt-7 '>
                         <CSVLink data={csvData} filename={"Taxtypes.csv"} className="justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                             Export as CSV
                         </CSVLink>
                     </div>
                     </div>
                 ) : (<NoData/>)} 
               </div>
       
            ) : (<Loader/>)}
     
        </div>
    );
};

export default ViewTaxTypes;
