// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import NoData from "@/components/NoData";
// import Loader from "@/components/common/Loader";
// import { useRouter } from "next/navigation"
// import Cookies from "js-cookie";

// interface BookingData {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   image: string;
// }

// const BookingTable = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = React.useState<boolean>(true);
//   const [nameFilter, setNameFilter] = React.useState<string>("");
//   const [bookingsSelection, setBookingsSelection] = React.useState<number[]>([]);
//   const [currentPage, setCurrentPage] = React.useState<number>(1);
//   const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);
//   const router = useRouter();


//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const accessToken = Cookies.get("access_token");
//         const response = await axios.get(`${process.env.BE_URL}/bookings`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//             "x-api-key": process.env.X_API_KEY,
//           },
//         });

//         // Check if response data is an array
       
        
//         setBookings(response.data); 
//         console.log(response.data);  
//         setLoading(false);
//       } catch (err) {
//         setLoading(false);
//         console.log(err);
//       }
//     };

//     fetchBookings();
//   }, []);

//   const [idFilter, setIdFilter] = React.useState<string>("");

//   //  // Ensure activities is an array before using .filter
//   //  const filteredActivities = Array.isArray(bookings) ? bookings.filter(
//   //   (booking) =>
//   //     booking.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
//   //     String(booking.id).toLowerCase().includes(idFilter.toLowerCase())
//   // ) : [];

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = bookings.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );

//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) {
//       const allBookings = currentItems.map((booking) => booking.id);
//       setBookingsSelection(allBookings);
//     } else {
//       setBookingsSelection([]);
//     }
//   };

//   const handleCheckboxChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     bookingId: number
//   ) => {
//     if (e.target.checked) {
//       setBookingsSelection((prevSelected) => [...prevSelected, bookingId]);
//     } else {
//       setBookingsSelection((prevSelected) =>
//         prevSelected.filter((id) => id !== bookingId)
//       );
//     }
//   };
//   const handleItemsPerPageChange = (
//     e: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const nextPage = () => {
//     setCurrentPage((prev) => prev + 1);
//   };

//   const prevPage = () => {
//     setCurrentPage((prev) => prev - 1);
//   };

//   return (
//     <div>
//       <h3 className="m-2 text-2xl text-black mt-8 font-bold">All Bookings</h3>
//       {!loading ? (
//         <div>
//           {currentItems.length >0 ? (
            
//           <div className="bg-white">
//           <div className="overflow-x-auto shadow-md sm:rounded-lg">
//       <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-8">
//         <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//           <tr>
//           <th scope="col" className="p-4">
//                             <div className="flex items-center">
//                               <input
//                                 id="checkbox-all-search"
//                                 type="checkbox"
//                                 onChange={handleSelectAll}
//                                 checked={
//                                   bookingsSelection.length ===
//                                   currentItems.length
//                                 }
//                                 className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
//                               />
//                               <label
//                                 htmlFor="checkbox-all-search"
//                                 className="sr-only"
//                               >
//                                 checkbox
//                               </label>
//                             </div>
//                           </th>
//                           <th scope="col" className="px-6 py-3">
//                             id
//                           </th>
//             <th scope="col" className="px-6 py-3">Check-in</th>
//             <th scope="col" className="px-6 py-3">Check-out</th>
//             <th scope="col" className="px-6 py-3">Booking Type</th>
//             <th scope="col" className="px-6 py-3">Total Amount</th>
//             <th scope="col" className="px-6 py-3">Guest Name</th>
//             <th scope="col" className="px-6 py-3">Rooms</th>
//             <th scope="col" className="px-6 py-3">Activities</th>
//             <th scope="col" className="px-6 py-3">Payment Method</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentItems.map((booking) => (
//             <tr key={booking.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
//               <td className="w-4 p-4">
//                               <div className="flex items-center">
//                                 <input
//                                   id={`checkbox-table-search-${booking.id}`}
//                                   type="checkbox"
//                                   checked={bookingsSelection.includes(
//                                     booking.id
//                                   )}
//                                   onChange={(e) =>
//                                     handleCheckboxChange(e, booking.id)
//                                   }
//                                   className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
//                                 />
//                                 <label
//                                   htmlFor={`checkbox-table-search-${booking.id}`}
//                                   className="sr-only"
//                                 >
//                                   checkbox
//                                 </label>
//                               </div>
//                             </td>
//                             <td className="px-6 py-4">{booking.id}</td>
//               <td className="px-6 py-4" style={{ minWidth: "200px" }}>{booking.check_in}</td>
//               <td className="px-6 py-4">{booking.check_out}</td>
//               <td className="px-6 py-4">{booking.booking_type}</td>
//               <td className="px-6 py-4">{booking.total_amount}</td>
//               <td className="px-6 py-4">{`${booking.guest_info.first_name} ${booking.guest_info.last_name}`}</td>
//               <td className="px-6 py-4">
//                 {booking.rooms.map((room) => (
//                   <div key={room.room_id}>{room.category}</div>
//                 ))}
//               </td>
//               <td className="px-6 py-4">
//                 {booking.activities.map((activity) => (
//                   <div key={activity.activity_id}>{activity.activity_name}</div>
//                 ))}
//               </td>
//               <td className="px-6 py-4">{booking.payment_method}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       </div>
//       <div className="mt-4 flex justify-between p-4">
//                     <div className="flex items-center gap-4">
//                       <select
//                         value={itemsPerPage}
//                         onChange={handleItemsPerPageChange}
//                         className="rounded-md border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value={10}>10</option>
//                         <option value={20}>20</option>
//                         <option value={30}>30</option>
//                       </select>
//                       <span>items per page</span>
//                     </div>
//                     <div>
//                       <button
//                         onClick={prevPage}
//                         disabled={currentPage === 1}
//                         className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 mr-2 cursor-pointer rounded-md px-3 py-1"
//                       >
//                         Previous
//                       </button>
//                       <button
//                         onClick={nextPage}
//                         disabled={indexOfLastItem >= bookings.length}
//                         className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-pointer rounded-md px-3 py-1"
//                       >
//                         Next
//                       </button>
//                     </div>
//                   </div>
//           </div>
//             ) : (
//               <NoData />
//             )}
//         </div>
//         ) : (
//           <Loader />
//         )}
//     </div>
//   );
// };

// export default BookingTable;

