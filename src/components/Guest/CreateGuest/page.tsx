"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const dobPickerRef = useRef<flatpickr.Instance | null>(null);
  const idIssueDatePickerRef = useRef<flatpickr.Instance | null>(null);
  useEffect(() => {
    flatpickr("#dob", {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      prevArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg className="fill-current" width="7" height="11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      onChange: (selectedDates) => {
        const dateStr = selectedDates[0].toISOString();
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
      dateFormat: "Y-m-d",
      prevArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg className="fill-current" width="7" height="11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      onChange: (selectedDates) => {
        const dateStr = selectedDates[0].toISOString();
        setFormData((prevData) => ({
          ...prevData,
          identification_issue_date: dateStr,
        }));
      },
    });

    // Cleanup flatpickr instances on unmount
    return () => {
      if (dobPickerRef.current) {
        dobPickerRef.current.destroy();
      }
      if (idIssueDatePickerRef.current) {
        idIssueDatePickerRef.current.destroy();
      }
    };
  }, []);

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    
    if (name === "profile_image" && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          profile_image: reader.result as string,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    console.log(formData);
    const response = await fetch("/api/guest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

  console.log(response)
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
                  Identification Issue Date
                </label>
                <input
                  type="text"
                  name="identification_issue_date"
                  id="identification_issue_date"
                  required
                  placeholder="Enter the Identification Issue Date"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-sm font-medium text-black">
                  Date of Birth
                </label>
                <input
                  type="text"
                  name="dob"
                  id="dob"
                  required
                  placeholder="Enter the Date of Birth"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
            </div>

            <div className="mb-6.5">
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

            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">
                Password
              </label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter the Password"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
            </div>

            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">
                Profile Image
              </label>
              <input
              type="file"
              name="profile_image"
              accept="image/*"
              onChange={handleChange} 
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
            />

            </div>

            <div className="flex justify-end gap-4.5">
              <button
                type="button"
                className="rounded bg-gray-2 px-6 py-2 text-sm font-medium text-black shadow transition hover:bg-opacity-90"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-primary px-6 py-2 text-sm font-medium text-gray shadow transition hover:bg-opacity-90"
              >
                Create Guest
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGuest;
