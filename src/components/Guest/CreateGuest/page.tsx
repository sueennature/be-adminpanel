"use client";

import React, { useEffect, useState } from "react";
import flatpickr from "flatpickr";

const CreateGuest = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    telephone: "",
    address: "",
    nationality: "",
    identification_type: "",
    identification_no: "",
    identification_issue_date: "",
    dob: "",
    gender: "",
    password: "",
    profile_image: "",
  });

  useEffect(() => {
    flatpickr("#dob", {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M j, Y",
      prevArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg className="fill-current" width="7" height="11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      onChange: (selectedDates, dateStr) => {
        setFormData((prevData) => ({
          ...prevData,
          dob: dateStr,
        }));
      },
    });

    flatpickr("#identification_issue_date", {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M j, Y",
      prevArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg className="fill-current" width="7" height="11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      onChange: (selectedDates, dateStr) => {
        setFormData((prevData) => ({
          ...prevData,
          identification_issue_date: dateStr,
        }));
      },
    });
  }, []);

  const handleChange = (e:any) => {
    const { name, value, files } = e.target;
    if (name === "profile_image") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [name]: reader.result });
      };
      if (files[0]) {
        reader.readAsDataURL(files[0]);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log(formData);
    // Add your form submission logic here
  };

  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter the First Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Last Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
            </div>

            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter the email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>

              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Nationality
                </label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option value="">Select a nationality</option>
                  <option value="foreign">Foreign</option>
                  <option value="local">Local</option>
                </select>
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Telephone
                </label>
                <input
                  type="number"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Telephone"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
            </div>

            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-sm font-medium text-black">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option value="">Select a gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-sm font-medium text-black">
                  Identification Type
                </label>
                <select
                  name="identification_type"
                  value={formData.identification_type}
                  onChange={handleChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option value="">Select a identification type</option>
                  <option value="Private">Private</option>
                  <option value="government">Government</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-sm font-medium text-black">
                  Identification No
                </label>
                <input
                  type="text"
                  name="identification_no"
                  value={formData.identification_no}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Identification No"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-sm font-medium text-black">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                    placeholder="mm/dd/yyyy"
                    required
                    data-class="flatpickr-right"
                  />
                  <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.0002 12.8249C8.83145 12.8249 8.69082 12.7687 8.5502 12.6562L2.08145 6.29993C1.83145 6.04993 1.83145 5.64993 2.08145 5.39993C2.33145 5.14993 2.73145 5.14993 2.98145 5.39993L9.0002 11.2437L15.0189 5.39993C15.2689 5.14993 15.6689 5.14993 15.9189 5.39993C16.1689 5.64993 16.1689 6.04993 15.9189 6.29993L9.4502 12.6562C9.30957 12.7687 9.16895 12.8249 9.0002 12.8249Z"
                        fill="#637381"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-sm font-medium text-black">
                  Identification Issue Date
                </label>
                <div className="relative">
                  <input
                    id="identification_issue_date"
                    name="identification_issue_date"
                    value={formData.identification_issue_date}
                    onChange={handleChange}
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                    placeholder="mm/dd/yyyy"
                    required
                    data-class="flatpickr-right"
                  />
                  <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.0002 12.8249C8.83145 12.8249 8.69082 12.7687 8.5502 12.6562L2.08145 6.29993C1.83145 6.04993 1.83145 5.64993 2.08145 5.39993C2.33145 5.14993 2.73145 5.14993 2.98145 5.39993L9.0002 11.2437L15.0189 5.39993C15.2689 5.14993 15.6689 5.14993 15.9189 5.39993C16.1689 5.64993 16.1689 6.04993 15.9189 6.29993L9.4502 12.6562C9.30957 12.7687 9.16895 12.8249 9.0002 12.8249Z"
                        fill="#637381"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Address"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black">
                  Password
                </label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter the password"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-black">
                  Profile Image
                </label>
                <input
                  type="file"
                  onChange={handleChange}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded bg-primary px-5 py-2.5 text-white hover:bg-opacity-90"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGuest;
