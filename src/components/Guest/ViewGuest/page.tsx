"use client";
import React, { useEffect } from "react";
import guestData from "../../../components/Datatables/guestsData.json";
import Image from "next/image";
import { Edit, Trash, Eye, Plus } from "react-feather";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CSVLink } from "react-csv";
import axios from "axios";
import { toast } from "react-toastify";
import NoData from "@/components/NoData";
import Loader from "@/components/common/Loader";
import Cookies from "js-cookie";
import { format } from "date-fns";
import useAuth from "@/hooks/useAuth";
import Swal from "sweetalert2";
import { useUserContext } from "@/hooks/useUserContext";

interface GuestData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
  address: string;
  nationality: string;
  identification_type: string;
  identification_no: string;
  identification_issue_date: string;
  dob: string;
  gender: string;
  created_at: string;
  profile_image: any;
}

const ViewGuest = () => {
  const [guests, setGuests] = React.useState<GuestData[]>([]);
  const [nameFilter, setNameFilter] = React.useState<string>("");
  const [idFilter, setIdFilter] = React.useState<string>("");
  const [guestSelection, setGuestSelection] = React.useState<number[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { groupFour, groupThree } = useUserContext();

  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        const limit = 100; // Number of items per page
        let skip = 0; // Initial offset

        const response = await axios.get(`${process.env.BE_URL}/guests/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "x-api-key": process.env.X_API_KEY,
          },
          params: {
            skip,
            limit,
          },
        });
        console.log(response.data);
        setGuests(response.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

  const filteredGuests = guests.filter(
    (guest) =>
      guest.first_name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      String(guest.id).toLowerCase().includes(idFilter.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGuests.slice(indexOfFirstItem, indexOfLastItem);

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

  const handleDelete = async (activityId: number) => {
    const accessToken = Cookies.get("access_token");

    try {
      await axios.delete(`${process.env.BE_URL}/guests/${activityId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });
      setGuests((prevActivity) =>
        prevActivity.filter((activity) => activity.id !== activityId),
      );
      toast.success("Guest is Deleted Successfully");
    } catch (err) {
      console.error(err);
      toast.error(
        "There was an error deleting the Activity. Please try again later",
      );
    }
  };

  const confirmDelete = (activityId: number) => {
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
        handleDelete(activityId);
      }
    });
  };
  const handleEditPush = (roomData: any) => {
    router.push(`/guest/update/update?guestID=${roomData.id}`);
  };

  const handleViewPush = (roomData: any) => {
    router.push(`/guest/view/view?guestID=${roomData.id}`);
  };
  const csvData = filteredGuests.map(
    ({
      id,
      first_name,
      last_name,
      email,
      telephone,
      address,
      nationality,
      identification_type,
      identification_no,
      identification_issue_date,
      dob,
      gender,
      created_at,
    }) => ({
      id,
      first_name,
      last_name,
      email,
      telephone,
      address,
      nationality,
      identification_type,
      identification_no,
      identification_issue_date,
      dob,
      gender,
      created_at,
    }),
  );
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      {groupFour && (
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
              <Link href="/guest/create">
                <Plus />
              </Link>
            </div>
          </div>
          {!loading ? (
            <div>
              {currentItems.length > 0 ? (
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
                                    guestSelection.length ===
                                    currentItems.length
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
                              Id
                            </th>
                            <th scope="col" className="px-6 py-3">
                              First Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Last Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Telephone
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Address
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Nationality
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Identification Type
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Identification No
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Identification Issue Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                              DOB
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Gender
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Created At
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Profile Image
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((guest) => (
                            <tr
                              key={guest.id}
                              className="dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-b bg-white text-black"
                            >
                              <td className="w-4 p-4">
                                <div className="flex items-center">
                                  <input
                                    id={`checkbox-table-search-${guest.id}`}
                                    type="checkbox"
                                    checked={guestSelection.includes(guest.id)}
                                    onChange={(e) =>
                                      handleCheckboxChange(e, guest.id)
                                    }
                                    className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                                  />
                                  <label
                                    htmlFor={`checkbox-table-search-${guest.id}`}
                                    className="sr-only"
                                  >
                                    checkbox
                                  </label>
                                </div>
                              </td>
                              <td className="px-6 py-4">{guest.id}</td>
                              <td className="px-6 py-4">{guest.first_name}</td>
                              <td className="px-6 py-4">{guest.last_name}</td>
                              <td className="px-6 py-4">{guest.email}</td>
                              <td className="px-6 py-4">{guest.telephone}</td>
                              <td className="px-6 py-4">{guest.address}</td>
                              <td className="px-6 py-4">{guest.nationality}</td>
                              <td className="px-6 py-4">
                                {guest.identification_type}
                              </td>
                              <td className="px-6 py-4">
                                {guest.identification_no}
                              </td>
                              <td className="px-6 py-4">
                                {formatDate(guest.identification_issue_date)}
                              </td>
                              <td className="px-6 py-4">
                                {formatDate(guest.dob)}
                              </td>
                              <td className="px-6 py-4">{guest.gender}</td>
                              <td className="px-6 py-4">
                                {formatDate(guest.created_at)}
                              </td>
                              <td className="min-w-[200px] overflow-x-auto px-6 py-4">
                                <div className="flex items-center gap-2">
                                  {guest.profile_image.map(
                                    (image: any, index: any) => (
                                      <div
                                        key={index}
                                        className="h-20 w-20 flex-shrink-0 overflow-hidden"
                                      >
                                        <Image
                                          src={`${process.env.BE_URL}/${image}`} // Ensure the URL is correct
                                          alt={guest.first_name}
                                          width={80}
                                          height={80}
                                          className="h-full w-full object-cover"
                                        />
                                      </div>
                                    ),
                                  )}
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4 ">
                                  <button
                                    onClick={() => handleEditPush(guest)}
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                  >
                                    <Edit />
                                  </button>
                                  <button
                                    onClick={() => handleViewPush(guest)}
                                    className="dark:text-red-500 font-medium text-green-600 hover:underline"
                                  >
                                    <Eye />
                                  </button>
                                  {groupThree && (
                                    <a
                                      href="#"
                                      className="font-medium text-rose-600 hover:underline"
                                      onClick={() => confirmDelete(guest.id)}
                                    >
                                      <Trash />
                                    </a>
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
                          disabled={indexOfLastItem >= filteredGuests.length}
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
      )}
    </div>
  );
};

export default ViewGuest;
