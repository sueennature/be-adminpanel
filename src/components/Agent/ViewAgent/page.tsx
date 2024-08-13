"use client";
import React, { useEffect } from "react";
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

interface AgentData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
  address: string;
  nationality: string;
}

const ViewAgent = () => {
  const [agents, setAgents] = React.useState<any[]>([]);
  const [nameFilter, setNameFilter] = React.useState<string>("");
  const [idFilter, setIdFilter] = React.useState<string>("");
  const [agentSelection, setAgentSelection] = React.useState<number[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);
  const [loading, setLoading] = React.useState<boolean>(true);

  const router = useRouter();
  
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        const limit = 50; // Number of items per page
        let skip = 0; // Initial offset
        let allAgents: AgentData[] = []; // Specify type here
        let hasMore = true;
    
        while (hasMore) {
          const response = await axios.get<AgentData[]>(`${process.env.BE_URL}/agents`, {
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
    
          const data = response.data;
          allAgents = [...allAgents, ...data];
          skip += limit; // Move to the next page
          hasMore = data.length === limit; // Continue if there are more items
        }
    
        console.log(allAgents);
        setAgents(allAgents);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };

    fetchAgents();
  }, []);

  const filteredAgents = agents.filter(
    (agent) =>
      agent.first_name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      String(agent.id).toLowerCase().includes(idFilter.toLowerCase()),
  );
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAgents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
 
  useEffect(() => {
    console.log("Current Page:", currentPage);
    console.log("Items Per Page:", itemsPerPage);
    console.log("Total Pages:", totalPages);
    console.log("Filtered Agents Length:", filteredAgents.length);
    console.log("Index of First Item:", indexOfFirstItem);
    console.log("Index of Last Item:", indexOfLastItem);
    console.log("Current Items Length:", currentItems.length);
  }, [
    currentPage, 
    itemsPerPage, 
    filteredAgents, 
    indexOfFirstItem, 
    indexOfLastItem, 
    totalPages, 
    currentItems.length
  ]);
  
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page whenever items per page changes
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allAgentIds = currentItems.map((agent) => agent.id);
      setAgentSelection(allAgentIds);
    } else {
      setAgentSelection([]);
    }
  };
 
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    agentId: number,
  ) => {
    if (e.target.checked) {
      setAgentSelection((prevSelected) => [...prevSelected, agentId]);
    } else {
      setAgentSelection((prevSelected) =>
        prevSelected.filter((id) => id !== agentId),
      );
    }
  };

  const handleDelete = async (agentId: number) => {
    const accessToken = Cookies.get("access_token");

    try {
      await axios.delete(`${process.env.BE_URL}/agents/${agentId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });
      setAgents((prevAgent) =>
        prevAgent.filter((agent) => agent.id !== agentId),
      );
      toast.success("Agent is Deleted Successfully");
    } catch (err) {
      console.error(err);
      toast.error(
        "There was an error deleting the Agent. Please try again later",
      );
    }
  };

  const confirmDelete = (agentId: number) => {
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
        handleDelete(agentId);
      }
    });
  };
  const handleEditPush = (agentData: any) => {
    router.push(`/agent/update/update?agentID=${agentData.id}`);
  };

  const handleViewPush = (agentData: any) => {
    router.push(`/agent/view/view?agentID=${agentData.id}`);
  };
  const csvData = filteredAgents.map(
    ({
      id,
      first_name,
      last_name,
      email,
      telephone,
      address,
      nationality
    }) => ({
      id,
      first_name,
      last_name,
      email,
      telephone,
      address,
      nationality
    }),
  );
  // const formatDate = (dateString: string) => {
  //   const options: Intl.DateTimeFormatOptions = {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  return (
    <div>
      <div>
      <div className="mb-4 flex items-center justify-between">
      {agents.length > 0 && (
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
          <Link href="/agent/create">
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
                      checked={agentSelection.length === currentItems.length}
                      className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    />
                    <label htmlFor="checkbox-all-search" className="sr-only">
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((agent) => (
                <tr
                  key={agent.id}
                  className="dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-b bg-white text-black"
                >
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        id={`checkbox-table-search-${agent.id}`}
                        type="checkbox"
                        checked={agentSelection.includes(agent.id)}
                        onChange={(e) => handleCheckboxChange(e, agent.id)}
                        className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor={`checkbox-table-search-${agent.id}`}
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  <td className="px-6 py-4">{agent.id}</td>
                  <td className="px-6 py-4">{agent.first_name}</td>
                  <td className="px-6 py-4">{agent.last_name}</td>
                  <td className="px-6 py-4">{agent.email}</td>
                  <td className="px-6 py-4">{agent.telephone}</td>
                  <td className="px-6 py-4">{agent.address}</td>
                  <td className="px-6 py-4">{agent.nationality}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 ">
                      <button
                        onClick={() => handleEditPush(agent)}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => handleViewPush(agent)}
                        className="dark:text-red-500 font-medium text-green-600 hover:underline"
                      >
                        <Eye />
                      </button>

                      <a
                        href="#"
                        className="font-medium text-rose-600 hover:underline"
                        onClick={() => confirmDelete(agent.id)}
                      >
                        <Trash />
                      </a>
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
            id="itemsPerPage"
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
              disabled={indexOfLastItem >= filteredAgents.length}
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
          filename={"Agents.csv"}
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

export default ViewAgent;
