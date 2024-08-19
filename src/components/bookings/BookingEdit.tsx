import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { countries } from "../../utils/contries";

// Define the type for the props
interface BookingEditProps {
  handleClose: () => void;
  open: boolean;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
interface GestInfo {
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
  telephone: string;
  address: string;
  identificationType: string;
  dob: string,
  identificationNo: string;
  gender: string;
  issueDate: string;
}

export default function BookingEdit({ handleClose, open }: BookingEditProps) {
  const [chekIn, setChekIn] = React.useState<Dayjs | null>(dayjs());
  const [chekOut, setChekOut] = React.useState<Dayjs | null>(dayjs());
  const [activities, setActivities] = useState<any>([]);
  const [issueDate, setIssueDate] = React.useState<any>();
  const [dob, setDob] = React.useState<any>();

  const [formData, setFormData] = useState({
    check_in: chekIn ? chekIn.toISOString() : "",
    check_out: chekOut ? chekOut.toISOString() : "",
    categories: "",
    views: "",
    discount_code: "",
  });
  const [guestInfo, setGuestInfo] = useState<GestInfo>({
    firstName: '',
    lastName: '',
    email: '',
    nationality: '',
    telephone: '',
    address: '',
    identificationType: '',
    dob: '',
    identificationNo: '',
    gender: '',
    issueDate: ''
  });

  const handleChangeGuest = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGuestInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectActivities = (activity: any) => {
    try {
      let temp = [...activities];
      let find = temp?.find((obj) => obj?.id === activity?.id);
      if (!find) {
        setActivities((prev: any) => [...prev, activity]);
      } else {
        setActivities((prev: any) => prev?.filter((obj: any) => obj?.id !== activity?.id));
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Update Booking
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers >
        <div className="mb-4 text-2xl font-bold text-black">Booking Info</div>
          <label className="mb-1 block text-sm font-medium text-black">Check In</label>
          <div className="relative">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                sx={{
                  overflow: 'hidden',
                }}
                components={['DateTimePicker', 'DateTimePicker']}
              >
                <DateTimePicker
                  sx={{
                    '& .MuiInputBase-root': {
                      height: '40px',

                      minHeight: 'unset',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '1rem',
                    },
                  }}
                  value={chekIn}
                  onChange={(newValue) => setChekIn(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>

            <div className="pointer-events-none absolute inset-0 left-auto right-2 flex items-center">
              <svg
                width="10"
                height="10"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.0002 12.8249C8.83145 12.8249 8.69082 12.7687 8.5502 12.6562L2.08145 6.2999C1.82832 6.04678 1.82832 5.65303 2.08145 5.3999C2.33457 5.14678 2.72832 5.14678 2.98145 5.3999L9.0002 11.278L15.0189 5.34365C15.2721 5.09053 15.6658 5.09053 15.9189 5.34365C16.1721 5.59678 16.1721 5.99053 15.9189 6.24365L9.45019 12.5999C9.30957 12.7405 9.16895 12.8249 9.0002 12.8249Z"
                  fill="#64748B"
                />
              </svg>
            </div>
          </div>

          
          <label className="mb-1 block text-sm font-medium text-black">Check Out</label>
          <div className="relative">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                sx={{
                  overflow: 'hidden',
                }}
                components={['DateTimePicker', 'DateTimePicker']}
              >
                <DateTimePicker
                  sx={{
                    '& .MuiInputBase-root': {
                      height: '40px',

                      minHeight: 'unset',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '1rem',
                    },
                  }}
                  value={chekOut}
                  onChange={(newValue) => setChekOut(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>

            <div className="pointer-events-none absolute inset-0 left-auto right-2 flex items-center">
              <svg
                width="10"
                height="10"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.0002 12.8249C8.83145 12.8249 8.69082 12.7687 8.5502 12.6562L2.08145 6.2999C1.82832 6.04678 1.82832 5.65303 2.08145 5.3999C2.33457 5.14678 2.72832 5.14678 2.98145 5.3999L9.0002 11.278L15.0189 5.34365C15.2721 5.09053 15.6658 5.09053 15.9189 5.34365C16.1721 5.59678 16.1721 5.99053 15.9189 6.24365L9.45019 12.5999C9.30957 12.7405 9.16895 12.8249 9.0002 12.8249Z"
                  fill="#64748B"
                />
              </svg>
            </div>
          </div>

          <label className="mb-3 block text-sm font-medium text-black">Room Type</label>
          <select
            name="categories"
            value={formData.categories}
            onChange={handleChange}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 text-xs py-3 text-black outline-none transition focus:border-primary active:border-primary"
            required
          >
            <option value="">Choose a room type</option>
            <option value="Single">Single</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Double">Double</option>
            <option value="Family">Family</option>
            <option value="Triple">Triple</option>
          </select>

          <label className="mb-3 block text-sm font-medium text-black">Room View</label>
          <select
            name="views"
            value={formData.views}
            onChange={handleChange}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 text-xs py-3 text-black outline-none transition focus:border-primary active:border-primary"
            required
          >
            <option value="">Choose a room view</option>
            <option value="LAKE">LAKE</option>
            <option value="MOUNTAIN">MOUNTAIN</option>
          </select>
          <label className="mb-3 block text-sm font-medium text-black">Discount Code</label>
          <input
            type="text"
            name="discount_code"
            value={formData.discount_code}
            onChange={handleChange}
            placeholder="Enter code"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 text-xs py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
          />
          <div className="mb-4 text-2xl font-bold text-black">Activities</div>
          {[
            {
              "id": 1,
              "name": "test",
              "price": 1000
            },
            {
              "id": 2,
              "name": "Swimming",
              "price": 15000
            },
            {
              "id": 3,
              "name": "Cycling",
              "price": 15000
            }
          ]?.map((activity: any, index: any) => (
            <div
              key={index}
              className="flex w-full items-center justify-between p-3 lg:flex-row"
            >
              <div>
                <label
                  htmlFor={`checkboxLabel${index}`}
                  className="flex cursor-pointer select-none items-center text-black"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={`checkboxLabel${index}`}
                      className="sr-only"
                      checked={!!activities?.find((obj: any) => obj?.id === activity?.id)}
                      onChange={() => handleSelectActivities(activity)}
                    />
                    <div
                      className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${!!activities?.find((obj: any) => obj?.id === activity?.id)
                        ? "border-primary bg-gray dark:bg-transparent"
                        : ""
                        }`}
                    >
                      <span
                        className={`opacity-0 ${!!activities?.find((obj: any) => obj?.id === activity?.id) ? "!opacity-100" : ""
                          }`}
                      >
                        <svg
                          width="11"
                          height="8"
                          viewBox="0 0 11 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                            fill="#3056D3"
                            stroke="#3056D3"
                            strokeWidth="0.4"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                  {activity?.name}
                </label>
              </div>
              <div className="font-bold text-black">{activity?.price?.toLocaleString()}</div>
            </div>
          ))}

          <div className="mb-4 text-2xl font-bold text-black">Guest Info</div>
          <label className="mb-1 block text-sm font-medium text-black">First Name</label>
          <input
            type="text"
            name="firstName"
            required
            placeholder="Enter the First Name"
            //value={guestInfo.firstName}
            //onChange={handleChangeGuest}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          />
          <label className="mb-1 block text-sm font-medium text-black">Last Name</label>
          <input
            type="text"
            name="lastName"
            required
            placeholder="Enter the Last Name"
            value={guestInfo.lastName}
            onChange={handleChangeGuest}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          />
          <label className="mb-1 block text-sm font-medium text-black">Email</label>
          <input
            type="email"
            name="email"
            required
            placeholder="Enter the email"
            value={guestInfo.email}
            onChange={handleChangeGuest}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          />
          <label className="mb-1 block text-sm font-medium text-black">Nationality</label>
          <select
            name="nationality"
            required
            value={guestInfo.nationality}
            onChange={handleChangeGuest}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
          >
            <option value="">Select a nationality</option>

            {countries?.map((country, key) => {
              return <option key={key} value={country?.value}>{country?.label}</option>
            })}
          </select>
          <label className="mb-1 block text-sm font-medium text-black">Telephone</label>
          <input
            type="tel"
            name="telephone"
            required
            placeholder="Enter the Telephone"
            value={guestInfo.telephone}
            onChange={handleChangeGuest}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          />
         <label className="mb-1 block text-sm font-medium text-black">Dob</label>
          <input
            type="text"
            id="dob"
            name="dob"
            value={dob}
            onChange={handleChangeGuest}
            className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
            placeholder="DD-MM-YYYY"
            required
            data-class="flatpickr-right"
          />
          <label className="mb-1 block text-sm font-medium text-black">Identification Type</label>
          <select
            name="identificationType"
            required
            value={guestInfo.identificationType}
            onChange={handleChangeGuest}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
          >
            <option value="">Select Identification Type</option>
            <option value="nic">National Identity Card (NIC)</option>
            <option value="Passport">Passport</option>
            <option value="driving_license">Driving License</option>
          </select>
          <label className="mb-1 block text-sm font-medium text-black">Issue Date</label>
          <input
            type="text"
            id="issueDate"
            name="issueDate"
            value={issueDate}
            onChange={handleChangeGuest}
            className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
            placeholder="DD-MM-YYYY"
            data-class="flatpickr-right"
          />
          <label className="mb-1 block text-sm font-medium text-black">Identification No</label>
          <input
            type="text"
            name="identificationNo"
            required
            placeholder="Identification No"
            value={guestInfo.identificationNo}
            onChange={handleChangeGuest}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          />
          <label className="mb-1 block text-sm font-medium text-black">Gender</label>
          <select
            name="gender"
            required
            value={guestInfo.gender}
            onChange={handleChangeGuest}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <label className="mb-1 block text-sm font-medium text-black">Address</label>
          <textarea
            name="address"
            rows={6}
            required
            placeholder="Enter the Address"
            value={guestInfo.address}
            onChange={handleChangeGuest}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          ></textarea>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
