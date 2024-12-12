"use client";
import React, { useEffect } from "react";
// import roomData from "../../../components/Datatables/newsData.json";
import Image from "next/image";
import { Edit, Trash, Eye, Plus, Video } from "react-feather";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { CSVLink } from "react-csv";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import NoData from "@/components/NoData";
import Loader from "@/components/common/Loader";
import ReactPlayer from "react-player";
import { useUserContext } from "@/hooks/useUserContext";

const ViewPayments = () => {
  const [payment, setPaymentDetails] = React.useState<any[]>([]);
  const [nameFilter, setNameFilter] = React.useState<string>("");
  const [idFilter, setIdFilter] = React.useState<string>("");
  const [newsSelection, setNewsSelection] = React.useState<number[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);
  const [loading, setLoading] = React.useState<boolean>(true);
  const router = useRouter();
  const { groupFour, groupThree } = useUserContext();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        const limit = 100; // Number of items per page
        let skip = 0; // Initial offset

        const response = await axios.get(`${process.env.BE_URL}/payment/`, {
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
        console.log(response.data.data);
        setPaymentDetails(response.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

const filteredNews = payment
  ?.filter((payment) => {
    const bookingIdMatch = String(payment.booking_id || "") // Convert `booking_id` to string
      .toLowerCase()
      .includes(nameFilter.toLowerCase());

    const idMatch = String(payment.id || "") // Convert `id` to string
      .toLowerCase()
      .includes(idFilter.toLowerCase());

    return bookingIdMatch && idMatch;
  }) ?? [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allRoomIds = currentItems.map((payment) => payment.id);
      setNewsSelection(allRoomIds);
    } else {
      setNewsSelection([]);
    }
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    newsId: number,
  ) => {
    if (e.target.checked) {
      setNewsSelection((prevSelected) => [...prevSelected, newsId]);
    } else {
      setNewsSelection((prevSelected) =>
        prevSelected.filter((id) => id !== newsId),
      );
    }
  };

  const handleEditPush = (payment: any) => {
    router.push(`/payment/update?newsID=${payment.id}`);
  };

  const handleViewPush = (payment: any) => {
    router.push(`/payment/view/view?newsID=${payment.id}`);
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

  const handleDelete = async (newsId: number) => {
    const accessToken = Cookies.get("access_token");

    try {
      await axios.delete(`${process.env.BE_URL}/payment/${newsId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });
      setPaymentDetails((prevNews) =>
        prevNews.filter((payment) => payment.id !== newsId),
      );
      toast.success("News is Deleted Successfully");
    } catch (err) {
      console.error(err);
      toast.error(
        "There was an error deleting the News. Please try again later",
      );
    }
  };

  const confirmDelete = (newsId: number) => {
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
        handleDelete(newsId);
      }
    });
  };

  const csvData = filteredNews.map(({ id, title, content }) => ({
    id,
    title,
    content,
  }));

  console.log("CURRENTT", currentItems)

  return (
    <div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          {payment.length > 0 && (
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search by Booking ID"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
        {!loading ? (
          <div>
            {currentItems.length > 0 ? (
              <div>
                <div className="bg-white">
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
                                  newsSelection.length === currentItems.length
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
                            Guest Id
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Amount
                          </th>

                          <th scope="col" className="px-6 py-3">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Client Reference
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Booking Id
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Transaction Id
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((payment) => (
                          <tr
                            key={payment.id}
                            className="dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-b bg-white text-black"
                          >
                            <td className="w-4 p-4">
                              <div className="flex items-center">
                                <input
                                  id={`checkbox-table-search-${payment.id}`}
                                  type="checkbox"
                                  checked={newsSelection.includes(payment.id)}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, payment.id)
                                  }
                                  className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                                />
                                <label
                                  htmlFor={`checkbox-table-search-${payment.id}`}
                                  className="sr-only"
                                >
                                  checkbox
                                </label>
                              </div>
                            </td>
                            <td className="px-6 py-4">{payment.id}</td>
                            <td className="px-6 py-4">{payment.guest_id}</td>

                            <td className="px-6 py-4">{payment.amount}</td>
                            <td className="px-6 py-4">{payment.status}</td>
                            <td className="px-6 py-4">{payment.client_ref}</td>
                            <td className="px-6 py-4">{payment.booking_id}</td>
                            <td className="px-6 py-4">
                              {payment.transaction_id}
                            </td>

                            {/* <td className="px-6 py-4">
                              <div className="flex items-center gap-4 ">
                                {groupFour && (
                                  <button
                                    onClick={() => handleEditPush(payment)}
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                  >
                                    <Edit />
                                  </button>
                                )}

                                <button
                                  onClick={() => handleViewPush(payment)}
                                  className="dark:text-red-500 font-medium text-green-600 hover:underline"
                                >
                                  <Eye />
                                </button>
                                {groupThree && (
                                  <a
                                    href="#"
                                    className="font-medium text-rose-600  hover:underline"
                                    onClick={() => confirmDelete(payment.id)}
                                  >
                                    <Trash />
                                  </a>
                                )}
                              </div>
                            </td> */}
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
                        disabled={indexOfLastItem >= filteredNews.length}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-pointer rounded-md px-3 py-1"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
                {/* <div className="mt-7 flex w-full justify-end ">
                  <CSVLink
                    data={csvData}
                    filename={"payment.csv"}
                    className="justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  >
                    Export as CSV
                  </CSVLink>
                </div> */}
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

export default ViewPayments;
