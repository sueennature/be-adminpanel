"use client";
import React, { useEffect, useState } from 'react';
import { timestampToDate } from "../../utils/util"
import Cookies from "js-cookie";
import axios from "axios";
import { Edit, Trash, Eye, Plus } from "react-feather";
import BookingEdit from './BookingEdit';
import BookingShow from './BookingShow';
import ConfirmAlertDialog from '../common/Notifications/ConfirmMessage';
type HelloWorldProps = {
    
};

const BookingTable: React.FC<HelloWorldProps> = () => {
    const [bookings, setBookings] = useState<any>([]);
    const [numRecords, setNumRecords] = React.useState<number>(0);
    const [currentPage, setCurrentPage] = React.useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = React.useState<number>(5);
    const [open, setOpen] = React.useState(false);
    const [openView, setOpenView] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState();

    const [openDelete, setOpenDelete] = React.useState(false);


    const [bookingData, setBookingData] = React.useState({});

    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    const handleClickOpenView = () => {
        setOpenView(true);
      };
      const handleCloseView = () => {
        setOpenView(false);
      };

      const handleClickOpenDelete = () => {
        setOpenDelete(true);
      };
      const handleCloseDelete = () => {
        setOpenDelete(false);
      };

    const nextPage = () => {
        setCurrentPage((prev) => prev + itemsPerPage);
    };

    const prevPage = () => {
        setCurrentPage((prev) => prev - itemsPerPage);
    };

    const handleItemsPerPageChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(0);
    };

    const handleDelete = async (id:any) => {
        try{
            const accessToken = Cookies.get("access_token");
            const response = await axios.delete(`${process.env.BE_URL}/bookings/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    "x-api-key": process.env.X_API_KEY,
                },
            });
            console.log("AUTH:::", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    "x-api-key": process.env.X_API_KEY,
                }})
            console.log("URL::::", `${process.env.BE_URL}/bookings/${id}`)
            console.log("handleDelete response?.data", response)
            
            await fetchBookings()
            handleCloseDelete()
        }catch(err){
            handleCloseDelete()
            console.log(err)
        }
    }

    const fetchBookingById = async (id:any) => {
        try{
            await handleClickOpenView()
            const accessToken = Cookies.get("access_token");
            const response = await axios.get(`${process.env.BE_URL}/bookings/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    "x-api-key": process.env.X_API_KEY,
                },
            });
            if(response?.status === 200){
                setBookingData(response?.data)
            }else{
                console.log("first")
            }
        }catch(err){
            console.log(err)
        }
    }

    const fetchBookings = async () => {
        try {
            const accessToken = Cookies.get("access_token");
            const response = await axios.get(`${process.env.BE_URL}/bookings/?skip=${currentPage}&limit=${itemsPerPage}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    "x-api-key": process.env.X_API_KEY,
                },
            });
            console.log("fetchBookings", `${process.env.BE_URL}/bookings/?skip=${currentPage}&limit=${itemsPerPage}`)
            console.log("response?.data", response)
            setBookings(response?.data?.bookings || [])
            setNumRecords(response?.data?.total_records)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        fetchBookings()
    }, [itemsPerPage, currentPage])
    return <div>
        <table className="text-gray-500 dark:text-gray-400 w-full text-left text-sm">
            <thead className="text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-xs uppercase">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Booking ID
                    </th>
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
                    <th className="px-6 py-4">Receipt</th>
                    <th scope="col" className="px-6 py-3">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody>
                {bookings?.map((data: any) => {
                    return <tr className="dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-b bg-white">
                        <td className="px-6 py-4">{data?.id}</td>
                        <td className="px-6 py-4">{timestampToDate(data?.check_in)}</td>
                        <td className="px-6 py-4">{timestampToDate(data?.check_out)}</td>
                        <td className="px-6 py-4">{data?.booking_type}</td>
                        <td className="px-6 py-4">{parseFloat(data?.total_amount || 0)}</td>
                        <td className="px-6 py-4">{data?.guest_info?.first_name || ""} {data?.guest_info?.last_name || ""}</td>
                        <td className="px-6 py-4">{data?.rooms?.map((room: any) => room?.room_number).join(', ')}</td>
                        <td className="px-6 py-4">{data?.activities?.map((activity: any) => activity?.activity_name).join(', ')}</td>
                        <td className="px-6 py-4">{data?.payment_method}</td>
                        <td className="px-6 py-4"><a href={`https://api.sueennature.com/receipts/booking_receipt_${data?.id}.pdf`}>Download</a></td>
                        <td><div className="flex items-center gap-4 ">
                              {/* <button
                                //onClick={() => handleEditPush(room)}
                                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                              >
                                <Edit onClick={handleClickOpen}/>
                              </button> */}
                              <button
                                onClick={() => fetchBookingById(data?.id)}
                                className="dark:text-red-500 font-medium text-green-600 hover:underline"
                              >
                                <Eye />
                              </button>
                              <button
                                className="font-medium text-rose-600  hover:underline"
                                onClick={() => {
                                    handleClickOpenDelete()
                                    setSelectedItem(data)
                                }}
                              >
                                <Trash />
                              </button>
                            </div></td>
                    </tr>
                })}

            </tbody>
        </table>
        
        <div className="mt-4 flex justify-between p-4">
            <div className="flex items-center gap-4">
                <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="rounded-md border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
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
                    disabled={currentPage >= numRecords}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-pointer rounded-md px-3 py-1"
                >
                    Next
                </button>
            </div>
            <BookingEdit handleClose={handleClose} open={open} />
            <BookingShow handleClose={handleCloseView} open={openView} data={bookingData || {}}/>
            <ConfirmAlertDialog handleClose={handleCloseDelete} handleDelete={handleDelete} open={openDelete} data={selectedItem}/>
        </div>
        
    </div>;
};

export default BookingTable;







