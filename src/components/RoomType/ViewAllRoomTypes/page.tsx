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
import { useUserContext } from "@/hooks/useUserContext";

const ViewAllRoomTypes = () => {
  const [roomType, setRoomTypes] = React.useState<any[]>([]);
  const [nameFilter, setNameFilter] = React.useState<string>("");
  const [newsSelection, setNewsSelection] = React.useState<number[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);
  const [loading, setLoading] = React.useState<boolean>(true);
  const router = useRouter();
  const { groupFour, groupThree } = useUserContext();

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        const limit = 100;
        let skip = 0;

        const response = await axios.get(`${process.env.BE_URL}/room_type/`, {
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
        setRoomTypes(response.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };

    fetchRoomTypes();
  }, []);

  const [idFilter, setIdFilter] = React.useState<string>("");

  const filterednews = roomType?.filter(
    (roomType) =>
      roomType.category.toLowerCase().includes(nameFilter.toLowerCase()) &&
      String(roomType.id).toLowerCase().includes(idFilter.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterednews.slice(indexOfFirstItem, indexOfLastItem);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allRoomIds = currentItems.map((roomType) => roomType.id);
      setNewsSelection(allRoomIds);
    } else {
      setNewsSelection([]);
    }
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    roomTypeId: number,
  ) => {
    if (e.target.checked) {
      setNewsSelection((prevSelected) => [...prevSelected, roomTypeId]);
    } else {
      setNewsSelection((prevSelected) =>
        prevSelected.filter((id) => id !== roomTypeId),
      );
    }
  };

  const handleEditPush = (roomType: any) => {
    router.push(`/roomType/update?roomTypeID=${roomType.id}`);
  };

  const handleViewPush = (roomType: any) => {
    router.push(`/roomType/view/view?roomTypeID=${roomType.id}`);
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

  const handleDelete = async (roomTypeId: number) => {
    const accessToken = Cookies.get("access_token");

    try {
      await axios.delete(`${process.env.BE_URL}/room_type/${roomTypeId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });
      setRoomTypes((prevNews) =>
        prevNews.filter((roomType) => roomType.id !== roomTypeId),
      );
      toast.success("Room type is Deleted Successfully");
    } catch (err) {
      console.error(err);
      toast.error(
        "There was an error deleting the Room Type. Please try again later",
      );
    }
  };

  const confirmDelete = (roomTypeId: number) => {
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
        handleDelete(roomTypeId);
      }
    });
  };

  const csvData = filterednews.map(({ id, title, content }) => ({
    id,
    title,
    content,
  }));

  return (
    <div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          {roomType.length > 0 && (
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
          {groupFour && (
            <div className="cursor-pointer text-blue-400">
              <Link href="/roomType/create">
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
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Size
                          </th>

                          <th scope="col" className="px-6 py-3">
                            Bed
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Occupancy
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Primary Images
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Room Images
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Mountain Images
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Lake Images
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((roomType) => (
                          <tr
                            key={roomType.id}
                            className="dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-b bg-white text-black"
                          >
                            <td className="w-4 p-4">
                              <div className="flex items-center">
                                <input
                                  id={`checkbox-table-search-${roomType.id}`}
                                  type="checkbox"
                                  checked={newsSelection.includes(roomType.id)}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, roomType.id)
                                  }
                                  className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                                />
                                <label
                                  htmlFor={`checkbox-table-search-${roomType.id}`}
                                  className="sr-only"
                                >
                                  checkbox
                                </label>
                              </div>
                            </td>
                            <td className="px-6 py-4">{roomType.id}</td>
                            <td className="px-6 py-4">{roomType.category}</td>
                            <td className="px-6 py-4">{roomType.size}</td>
                            <td className="px-6 py-4">{roomType.bed}</td>
                            <td className="px-6 py-4">{roomType.occupancy}</td>
                            <td
                              className="px-6 py-4"
                              style={{ minWidth: "200px" }}
                            >
                              <div className="flex items-center gap-2">
                                {roomType.primary_image?.map(
                                  (
                                    image: any | StaticImport,
                                    index: React.Key | null | undefined,
                                  ) => (
                                    <div key={index} className="flex-shrink-0">
                                      <Image
                                        src={
                                          image.startsWith("data:")
                                            ? image
                                            : `${process.env.BE_URL}/${image}`
                                        }
                                        alt={roomType.name}
                                        width={50}
                                        height={50}
                                      />
                                    </div>
                                  ),
                                )}
                              </div>
                            </td>
                            <td
                              className="px-6 py-4"
                              style={{ minWidth: "200px" }}
                            >
                              <div className="flex items-center gap-2">
                                {roomType.room_images.map(
                                  (
                                    image: any | StaticImport,
                                    index: React.Key | null | undefined,
                                  ) => (
                                    <div key={index} className="flex-shrink-0">
                                      <Image
                                        src={
                                          image.startsWith("data:")
                                            ? image
                                            : `${process.env.BE_URL}/${image}`
                                        }
                                        alt={roomType.name}
                                        width={50}
                                        height={50}
                                      />
                                    </div>
                                  ),
                                )}
                              </div>
                            </td>

                            <td
                              className="px-6 py-4"
                              style={{ minWidth: "200px" }}
                            >
                              <div className="flex items-center gap-2">
                                {roomType.mountain.map(
                                  (
                                    image: any | StaticImport,
                                    index: React.Key | null | undefined,
                                  ) => (
                                    <div key={index} className="flex-shrink-0">
                                      <Image
                                        src={
                                          image.startsWith("data:")
                                            ? image
                                            : `${process.env.BE_URL}/${image}`
                                        }
                                        alt={roomType.name}
                                        width={50}
                                        height={50}
                                      />
                                    </div>
                                  ),
                                )}
                              </div>
                            </td>

                            <td
                              className="px-6 py-4"
                              style={{ minWidth: "200px" }}
                            >
                              <div className="flex items-center gap-2">
                                {roomType.lake.map(
                                  (
                                    image: any | StaticImport,
                                    index: React.Key | null | undefined,
                                  ) => (
                                    <div key={index} className="flex-shrink-0">
                                      <Image
                                        src={
                                          image.startsWith("data:")
                                            ? image
                                            : `${process.env.BE_URL}/${image}`
                                        }
                                        alt={roomType.name}
                                        width={50}
                                        height={50}
                                      />
                                    </div>
                                  ),
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4 ">
                                {groupFour && (
                                  <button
                                    onClick={() => handleEditPush(roomType)}
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                  >
                                    <Edit />
                                  </button>
                                )}

                                <button
                                  onClick={() => handleViewPush(roomType)}
                                  className="dark:text-red-500 font-medium text-green-600 hover:underline"
                                >
                                  <Eye />
                                </button>
                                {groupThree && (
                                  <a
                                    href="#"
                                    className="font-medium text-rose-600  hover:underline"
                                    onClick={() => confirmDelete(roomType.id)}
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
                        disabled={indexOfLastItem >= filterednews.length}
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
                    filename={"roomType.csv"}
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

export default ViewAllRoomTypes;
