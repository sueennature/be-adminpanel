"use client";
import React, { useEffect } from "react";
import usersData from "../../../components/Datatables/usersTable.json";
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
import useAuth from "@/hooks/useAuth";
import { useAuthRedirect } from "@/utils/checkToken";

interface userData {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_superadmin: string;
  role: string;
}

const ViewAllUsers = () => {
  const [guests, setGuests] = React.useState<any[]>([]);
  const [nameFilter, setNameFilter] = React.useState<string>("");
  const [idFilter, setIdFilter] = React.useState<string>("");
  const [guestSelection, setGuestSelection] = React.useState<number[]>([]);
  const [numRecords, setNumRecords] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);
  const [loading, setLoading] = React.useState<boolean>(true);

  const router = useRouter();
  useAuthRedirect();

  useEffect(() => {
    const fetchUsers = async () => {
   
      try {
        const accessToken = Cookies.get("access_token");

         // Adjust the skip value for zero-based indexing
         const skip = currentPage  * itemsPerPage;
        

        const response = await axios.get(`${process.env.BE_URL}/users/?skip=${skip}&limit=${itemsPerPage}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "x-api-key": process.env.X_API_KEY,
          }
        });
        console.log(response.data);
        setGuests(response.data);
        setNumRecords(response?.data?.total_records ) // Assuming API returns total records count
        console.log("Total Records:", response?.data?.length);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };

    fetchUsers();
  }, [itemsPerPage, currentPage]);

   // Filter guests based on nameFilter and idFilter
   const filteredGuests = guests.filter(
    (guest) =>
      guest.username.toLowerCase().includes(nameFilter.toLowerCase()) &&
      String(guest.id).toLowerCase().includes(idFilter.toLowerCase())
  );

  // Debugging log for filtered guests
  console.log("filteredGuests:", filteredGuests);

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem =0;
  const currentItems = filteredGuests.slice(indexOfFirstItem, indexOfLastItem);
  console.log("current page :",currentPage);
  console.log("itemsPerPage :",itemsPerPage);
  console.log("indexOfLastItem :",indexOfLastItem);
  console.log("indexOfFirstItem :",indexOfFirstItem);
  console.log("currentItems :",currentItems);

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const nextPage = () => {
    setCurrentPage((prev) => prev + 1); // Move to the next page
};

const prevPage = () => {
  setCurrentPage((prev) => Math.max(prev - 1, 0)); // Move to the previous page but ensure it doesn't go below 1
};

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allGuestIds = currentItems.map((guest) => guest.id);
      setGuestSelection(allGuestIds);
    } else {
      setGuestSelection([]);
    }
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    roomId: number,
  ) => {
    if (e.target.checked) {
      setGuestSelection((prevSelected) => [...prevSelected, roomId]);
    } else {
      setGuestSelection((prevSelected) =>
        prevSelected.filter((id) => id !== roomId),
      );
    }
  };

  const handleEditPush = (roomData: any) => {
    router.push(`/users/update?userID=${roomData.id}`);
  };

  const handleViewPush = (roomData: any) => {
    router.push(`/users/view/view?userID=${roomData.id}`);
  };

  const handleDelete = async (userId: number) => {
    const accessToken = Cookies.get("access_token");

    try {
      await axios.delete(`${process.env.BE_URL}/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });
      setGuests((prevGuests) =>
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

  const csvData = filteredGuests.map(
    ({ id, username, email, role, is_active, is_superadmin }) => ({
      id,
      username,
      email,
      role,
      is_active,
      is_superadmin,
    }),
  );

  return (
    <div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          {guests.length > 0 && (
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search by Name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* <input
               type='text'
               placeholder='Search by ID'
               value={idFilter}
               onChange={(e) => setIdFilter(e.target.value)}
               className='px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
           /> */}
            </div>
          )}
          <div className="cursor-pointer text-blue-400">
            <Link href="/users/create">
              <Plus />
            </Link>
          </div>
        </div>
        {!loading ? (
          <div>
            {guests.length >= 0 ? (
              <div>
                <div className="bg-white ">
                  <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="text-gray-500 dark:text-gray-400 w-full text-left text-sm rtl:text-right">
                      <thead className="text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-xs uppercase">
                        <tr>
                         <th scope="col" className="p-4">
                            <div className="flex items-center">
                              <input
                                id="checkbox-all-search"
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={
                                  guestSelection.length === currentItems.length
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
                            Username
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Role
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Active
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Super Admin
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems?.map((user) => (
                          <tr
                            key={user.id}
                            className="dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-b bg-white text-black"
                          >
                            <td className="w-4 p-4">
                             <div className="flex items-center">
                                <input
                                  id={`checkbox-table-search-${user.id}`}
                                  type="checkbox"
                                  checked={guestSelection.includes(user.id)}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, user.id)
                                  }
                                  className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                                />
                                <label
                                  htmlFor={`checkbox-table-search-${user.id}`}
                                  className="sr-only"
                                >
                                  checkbox
                                </label>
                              </div> 
                            </td> 
                            <td className="px-6 py-4">{user.id}</td>
                            <td className="px-6 py-4">{user.username}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">
                              {user.role === "admin"
                                ? "Admin"
                                : user.role === "guest"
                                  ? "Guest"
                                  : "Channel Manager"}
                            </td>
                            <td className="px-6 py-4 text-black">
                              {user.is_active ? "Active" : "Inactive"}
                            </td>
                            <td className="px-6 py-4 text-black">
                              {user.is_superadmin ? "Yes" : "No"}
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4 ">
                                <button
                                  onClick={() => handleEditPush(user)}
                                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                >
                                  <Edit />
                                </button>
                                <button
                                  onClick={() => handleViewPush(user)}
                                  className="dark:text-red-500 font-medium text-green-600 hover:underline"
                                >
                                  <Eye />
                                </button>
                                <button
                                  className="font-medium text-rose-600  hover:underline"
                                  onClick={() => confirmDelete(user.id)}
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
                        disabled={currentPage === 0}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 mr-2 cursor-pointer rounded-md px-3 py-1"
                      >
                        Previous
                      </button>
                      <button
                        onClick={nextPage}
                        disabled={currentPage * itemsPerPage >= numRecords}
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
                    filename={"Guests.csv"}
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
    </div>
  );
};

export default ViewAllUsers;
