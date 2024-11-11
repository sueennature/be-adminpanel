"use client";
import React, { useEffect } from "react";
import taxData from "../../../components/Datatables/taxData.json";
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
import { useUserContext } from "@/hooks/useUserContext";
// import checkToken from '@/utils/checkToken';

interface taxData {
  id: number;
  name: number;
  description: string;
  percentage: number;
  tax_type: string;
}

const ViewTaxTypes = () => {
  const [discounts, setDiscounts] = React.useState<any[]>([]);
  const [nameFilter, setNameFilter] = React.useState<string>("");
  const [discountsSelection, setDiscountsSelection] = React.useState<number[]>(
    [],
  );
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);
  const router = useRouter();
  const [idFilter, setIdFilter] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(true);
  const { groupThree, groupFour } = useUserContext();

  React.useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) {
      return router.push("/");
    }
  }, [router]);

  const filteredDiscounts = discounts.filter(
    (activity) =>
      activity.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      String(activity.id).toLowerCase().includes(idFilter.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDiscounts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allDiscountids = currentItems.map((activity) => activity.id);
      setDiscountsSelection(allDiscountids);
    } else {
      setDiscountsSelection([]);
    }
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    roomId: number,
  ) => {
    if (e.target.checked) {
      setDiscountsSelection((prevSelected) => [...prevSelected, roomId]);
    } else {
      setDiscountsSelection((prevSelected) =>
        prevSelected.filter((id) => id !== roomId),
      );
    }
  };

  const handleEditPush = (roomData: any) => {
    router.push(`/taxtypes/update/update?taxID=${roomData.id}`);
  };

  const handleViewPush = (roomData: any) => {
    router.push(`/taxtypes/view/view?taxID=${roomData.id}`);
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
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        const limit = 100; // Number of items per page
        let skip = 0; // Initial offset

        const response = await axios.get(`${process.env.BE_URL}/taxes/`, {
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
      toast.success("Tax Deleted Successfully");
    } catch (err) {
      console.error(err);
      toast.error(
        "There was an error deleting the tax. Please try again later",
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
  const csvData = filteredDiscounts.map(
    ({ id, name, description, percentage, tax_type }) => ({
      id,
      name,
      description,
      tax_type,
      percentage,
    }),
  );
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        {discounts.length > 0 && groupFour && (
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by Name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        {groupThree && (
          <div className="cursor-pointer text-blue-400">
            <Link href="/taxtypes/createtaxtype">
              <Plus />
            </Link>
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
                                discountsSelection.length ===
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
                          className="dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-b bg-white text-black"
                        >
                          <td className="w-4 p-4">
                            <div className="flex items-center">
                              <input
                                id={`checkbox-table-search-${activity.id}`}
                                type="checkbox"
                                checked={discountsSelection.includes(
                                  activity.id,
                                )}
                                onChange={(e) =>
                                  handleCheckboxChange(e, activity.id)
                                }
                                className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                              />
                              <label
                                htmlFor={`checkbox-table-search-${activity.id}`}
                                className="sr-only"
                              >
                                checkbox
                              </label>
                            </div>
                          </td>
                          <td className="px-6 py-4">{activity.id}</td>
                          <td className="px-6 py-4">{activity.name}</td>
                          <td
                            className="px-6 py-4"
                            style={{ minWidth: "200px" }}
                          >
                            {activity.description}
                          </td>
                          <td
                            className="px-6 py-4"
                            style={{ minWidth: "200px" }}
                          >
                            {" "}
                            {activity.percentage}%
                          </td>
                          <td
                            className="px-6 py-4"
                            style={{ minWidth: "200px" }}
                          >
                            {" "}
                            {activity.tax_type}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4 ">
                              {groupThree && (
                                <button
                                  onClick={() => handleEditPush(activity)}
                                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                >
                                  <Edit />
                                </button>
                              )}
                              <button
                                onClick={() => handleViewPush(activity)}
                                className="dark:text-red-500 font-medium text-green-600 hover:underline"
                              >
                                <Eye />
                              </button>
                              {groupThree && (
                                <button
                                  onClick={() => confirmDelete(activity.id)}
                                  className="font-medium text-rose-600  hover:underline"
                                >
                                  <Trash />
                                </button>
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
                      disabled={indexOfLastItem >= filteredDiscounts.length}
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
                  filename={"Taxtypes.csv"}
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
  );
};

export default ViewTaxTypes;
