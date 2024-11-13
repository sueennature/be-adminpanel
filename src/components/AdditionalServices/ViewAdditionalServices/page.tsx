"use client";
import React, { useEffect } from "react";
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
import { useAuthRedirect } from "@/utils/checkToken";
import { useUserContext } from "@/hooks/useUserContext";

interface ActivityData {
  id: number;
  name: string;
  description: string;
  price: number;
  media: string;
}

const ViewAdditionalServices = () => {
  const [additionalServices, setAdditionalServices] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [nameFilter, setNameFilter] = React.useState<string>("");
  const [additionalServicesSelection, setAdditionalServicesSelection] =
    React.useState<number[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);
  const router = useRouter();
  const { groupThree, groupFour } = useUserContext();
  useAuthRedirect();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        const limit = 100; // Number of items per page
        let skip = 0; // Initial offset
        const response = await axios.get(
          `${process.env.BE_URL}/additional-services/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              "x-api-key": process.env.X_API_KEY,
            },
            params: {
              skip,
              limit,
            },
          },
        );

        // Check if response data is an array

        setAdditionalServices(response.data);
        console.log(response.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

  const [idFilter, setIdFilter] = React.useState<string>("");

  // Ensure activities is an array before using .filter
  const filteredAdditionalServices = Array.isArray(additionalServices)
    ? additionalServices.filter(
        (additionalService) =>
          additionalService.name
            .toLowerCase()
            .includes(nameFilter.toLowerCase()) &&
          String(additionalService.id)
            .toLowerCase()
            .includes(idFilter.toLowerCase()),
      )
    : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAdditionalServices.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allAdditionalServices = currentItems.map(
        (additionalService) => additionalService.id,
      );
      setAdditionalServicesSelection(allAdditionalServices);
    } else {
      setAdditionalServicesSelection([]);
    }
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    additionalServiceId: number,
  ) => {
    if (e.target.checked) {
      setAdditionalServicesSelection((prevSelected) => [
        ...prevSelected,
        additionalServiceId,
      ]);
    } else {
      setAdditionalServicesSelection((prevSelected) =>
        prevSelected.filter((id) => id !== additionalServiceId),
      );
    }
  };

  const handleEditPush = (additionalService: any) => {
    router.push(
      `/additionalServices/update?additionalServiceID=${additionalService.id}`,
    );
  };

  const handleViewPush = (additionalService: any) => {
    router.push(
      `/additionalServices/view/view?additionalServiceID=${additionalService.id}`,
    );
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

  const handleDelete = async (additionalServiceID: number) => {
    const accessToken = Cookies.get("access_token");

    try {
      await axios.delete(
        `${process.env.BE_URL}/additional-services/${additionalServiceID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "x-api-key": process.env.X_API_KEY,
          },
        },
      );
      setAdditionalServices((prevAdditionalService) =>
        prevAdditionalService.filter(
          (additionalService) => additionalService.id !== additionalServiceID,
        ),
      );
      toast.success("Additional Service is Deleted Successfully");
    } catch (err) {
      console.error(err);
      toast.error(
        "There was an error deleting the Additional Service. Please try again later",
      );
    }
  };

  const confirmDelete = (additionalServiceId: number) => {
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
        handleDelete(additionalServiceId);
      }
    });
  };

  const csvData = filteredAdditionalServices.map(
    ({ id, name, description, price }) => ({
      id,
      name,
      description,
      price,
    }),
  );

  return (
    <div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          {additionalServices.length > 0 && (
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
              <Link href="/additionalServices/create">
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
                                  additionalServicesSelection.length ===
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
                            Additional Service Name
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Description
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((additionalService) => (
                          <tr
                            key={additionalService.id}
                            className="dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-b bg-white text-black"
                          >
                            <td className="w-4 p-4">
                              <div className="flex items-center">
                                <input
                                  id={`checkbox-table-search-${additionalService.id}`}
                                  type="checkbox"
                                  checked={additionalServicesSelection.includes(
                                    additionalService.id,
                                  )}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      e,
                                      additionalService.id,
                                    )
                                  }
                                  className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                                />
                                <label
                                  htmlFor={`checkbox-table-search-${additionalService.id}`}
                                  className="sr-only"
                                >
                                  checkbox
                                </label>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {additionalService.id}
                            </td>
                            <td className="px-6 py-4">
                              {additionalService.name}
                            </td>
                            <td
                              className="px-6 py-4"
                              style={{ minWidth: "200px" }}
                            >
                              {additionalService.description}
                            </td>
                            <td
                              className="px-6 py-4"
                              style={{ minWidth: "200px" }}
                            >
                              LKR {additionalService.price.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4 ">
                                {groupThree && (
                                  <button
                                    onClick={() =>
                                      handleEditPush(additionalService)
                                    }
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                  >
                                    <Edit />
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    handleViewPush(additionalService)
                                  }
                                  className="dark:text-red-500 font-medium text-green-600 hover:underline"
                                >
                                  <Eye />
                                </button>
                                {groupThree && (
                                  <a
                                    href="#"
                                    className="font-medium text-rose-600 hover:underline"
                                    onClick={() =>
                                      confirmDelete(additionalService.id)
                                    }
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
                        <option value={30}>30</option>
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
                        disabled={
                          indexOfLastItem >= filteredAdditionalServices.length
                        }
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
                    filename={"AdditionalServices.csv"}
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

export default ViewAdditionalServices;
