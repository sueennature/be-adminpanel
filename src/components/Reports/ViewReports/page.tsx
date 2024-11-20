"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Edit, Trash, Eye, Plus } from "react-feather";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NextRequest } from "next/server";
import { CSVLink } from "react-csv";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import NoData from "@/components/NoData";
import Loader from "@/components/common/Loader";
import { useAuthRedirect } from "@/utils/checkToken";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { GET } from "@/app/api/report/route";
import dayjs, { Dayjs } from "dayjs";
import { Button, CircularProgress } from "@mui/material";
import jsPDF from "jspdf";
// import "jspdf-autotable";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

interface ActivityData {
  id: number;
  name: string;
  description: string;
  price: number;
  media: string;
}

const headers = [
  { label: "ID", key: "id" },
  { label: "Name", key: "name" },
  { label: "Date", key: "date" },
  { label: "Action", key: "action" },
];

const reportNames = [
  { id: 1, label: "Kitchen Report", type: "kitchen", key: "Kitchen Report" },
  {
    id: 2,
    label: "Room Cleaners Report",
    type: "room_cleaners",
    key: "Room Cleaners Report",
  },
  {
    id: 3,
    label: "Accounting Report",
    type: "accounting",
    key: "Accounting Report",
  },
  {
    id: 4,
    label: "Management Report",
    type: "management",
    key: "Management Report",
  },
  {
    id: 5,
    label: "Daily Summary Report",
    type: "daily_summary",
    key: "Daily Summary Report",
  },
  {
    id: 6,
    label: "Weekly Summary Report",
    type: "weekly_summary",
    key: "Weekly Summary Report",
  },
  {
    id: 7,
    label: "Monthly Summary Report",
    type: "monthly_summary",
    key: "Monthly Summary Report",
  },
  {
    id: 8,
    label: "Guest Summary Report",
    type: "guest_summary",
    key: "Guest Summary Report",
  },
  {
    id: 9,
    label: "Room Occupancy Report",
    type: "room_occupancy",
    key: "Room Occupancy Report",
  },
  {
    id: 10,
    label: "Staff Performance Report",
    type: "staff_performance",
    key: "Staff Performance Report",
  },
];

const ViewReports = () => {
  const [additionalServices, setAdditionalServices] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [nameFilter, setNameFilter] = React.useState<string>("");
  const [additionalServicesSelection, setAdditionalServicesSelection] =
    React.useState<number[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [reportType, setReportType] = React.useState("");
  const [isReportReady, setIsReportReady] = React.useState(false);
  const [readyFiles, setReadyFiles] = React.useState<string[]>([]);
  const [updatedDates, setUpdatedDates] = React.useState<string[]>([]);
  const [generatedData, setGeneratedData] = React.useState([]);
  const [type, setType] = React.useState("");
  const router = useRouter();
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
      const allAdditionalServices = reportNames.map(
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

//   const pdf = (data: any, type: string) => {
//     const keys = Object.keys(data[0]);

//     let bodyData = [];
//     for (let j = 0;  j < data.length; j++) {
//       let rowData = [];
//       for(let key of keys){
//         rowData.push(data[j][key])
//       }
//       bodyData.push(rowData);
//     }

//     const doc = new jsPDF({ orientation: "portrait" });
//     var time = new Date().toLocaleString();
//     doc.setFontSize(20);
//     doc.text(`${type} Report`, 105, 13, { align: "center" });
//     doc.setFontSize(12);
//     doc.text("Sueen Nature © 2024 All rights reserved.", 105, 41, {
//       align: "center",
//     });

//     // @ts-ignore
//     doc.autoTable({
//       theme: "grid",
//       styles: { align: "center" },
//       headStyles: { fillColor: [71, 201, 76] },
//       startY: 27,
//       head: [ keys ],
//       body: bodyData,
//     });

//   doc.save(`${type}.pdf`);
// };

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const pdf = (data: any[], type: string) => {
  const keys = Object.keys(data[0]);

  const tableBody = [
    keys.map((key) => ({ text: key, style: "tableHeader" })),
    ...data.map((row) => keys.map((key) => ({ text: String(row[key]), style: "tableBody" }))),
  ];

  const docDefinition = {
    content: [
      { text: `${type} Report`, style: "header" },
      {
        table: {
          headerRows: 1,
          widths: Array(keys.length).fill("auto"), 
          body: tableBody,
        },
        layout: {
          fillColor: (rowIndex: number) => (rowIndex % 2 === 0 ? "#f5f5f5" : null),
        },
      },
      { text: "Sueen Nature © 2024 All rights reserved.", style: "subheader", margin: [0, 20, 0, 0] },
    ],
    styles: {
      header: { fontSize: 20, bold: true, alignment: "center", margin: [0, 0, 0, 10] },
      subheader: { fontSize: 12, alignment: "center", margin: [0, 0, 0, 20] },
      tableHeader: { fillColor: "#47C94C", color: "white", bold: true, alignment: "center" },
      tableBody: { alignment: "center", margin: [0, 2] },
    },
  };

  pdfMake.createPdf(docDefinition).open();
};


const handleGenerateReports = async (type: string) => {
    setReportType(type);
    setIsGenerating(true);

    const url = new URL(`${process.env.BE_URL}/api/report`);
    url.searchParams.append("type", type);
    url.searchParams.append("start_date", startDate ? startDate.format("YYYY-MM-DD") : "");
    url.searchParams.append("end_date", endDate ? endDate.format("YYYY-MM-DD") : "");

    const reportResponse = await GET({ url: url.toString() } as NextRequest);

    if (reportResponse.ok) {
        const reportData = await reportResponse.json();
        if (reportData && reportData.data && reportData.data.report) {
            setGeneratedData(reportData.data.report);
            setIsReportReady(true);
            setType(reportData.report_type);
            setReadyFiles((prev) => [...prev, type]);
        } else {
            console.error("Report data is missing in the response:", reportData);
        }
    } else {
        console.error("Failed to generate report:", await reportResponse.json());
    }

    setIsGenerating(false);
};


  const handleDownload = () =>{
    pdf(generatedData, type);
  }

  const handleDateChange = (type: string) =>{
    const updatedReadyFiles = readyFiles.filter((item) => item !== type);
    setReadyFiles(updatedReadyFiles);
  }

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
          <div className="cursor-pointer text-blue-400">
            <Link href="/additionalServices/create">
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
                          {headers.map((header, index) => (
                            <th scope="col" className="px-6 py-3" key={index}>
                              {header.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {reportNames.map((report) => (
                          <tr
                            key={report.id}
                            className="dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-b bg-white text-black"
                          >
                            <td className="w-4 p-4">
                              <div className="flex items-center">
                                <input
                                  id={`checkbox-table-search-${report.id}`}
                                  type="checkbox"
                                  checked={additionalServicesSelection.includes(
                                    report.id,
                                  )}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, report.id)
                                  }
                                  className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                                />
                                <label
                                  htmlFor={`checkbox-table-search-${report.id}`}
                                  className="sr-only"
                                >
                                  checkbox
                                </label>
                              </div>
                            </td>
                            <td className="px-6 py-4">{report.id}</td>
                            <td className="px-6 py-4">{report.label}</td>
                            <td
                              className="px-6 py-4"
                              style={{ minWidth: "200px" }}
                            >
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  label="Select Start Date"
                                  sx={{ marginRight: "10px" }}
                                  onChange={(newValue) =>{
                                    setStartDate(newValue);
                                    handleDateChange(report.type);
                                  }}
                                />
                              </LocalizationProvider>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  label="Select End Date"
                                  onChange={(newValue) =>{
                                    setEndDate(newValue);
                                    handleDateChange(report.type);
                                  }}
                                />
                              </LocalizationProvider>
                            </td>

                            <td
                              className="px-6 py-4"
                              style={{ minWidth: "200px", alignItems: "right" }}
                            >
                              {isReportReady &&
                                  readyFiles?.includes(report.type) ? (
                                <Button
                                  className="w-25 justify-center rounded p-3 font-medium text-gray hover:bg-opacity-90"
                                  variant="contained"
                                  color="success"
                                  onClick={()=>handleDownload()}
                                >
                                  Download
                                </Button>
                              ) : (
                                <Button
                                  className="w-25 justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                                  onClick={() =>
                                    handleGenerateReports(report.type)
                                  }
                                  variant="contained"
                                  disabled={
                                    isGenerating && reportType === report.type
                                  }
                                >
                                  {isGenerating &&
                                  reportType === report.type ? (
                                    <CircularProgress
                                      color="inherit"
                                      size="30px"
                                    />
                                  ) : (
                                    "Generate"
                                  )}
                                </Button>
                              )}
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

export default ViewReports;
