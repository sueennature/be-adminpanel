"use client";
import React from "react";
import SelectGroupOne from "../../SelectGroup/SelectGroupOne";
import flatpickr from "flatpickr";
import { useEffect } from "react";

const CreateDiscount = () => {
  useEffect(() => {
    // Init flatpickr
    flatpickr(".form-datepicker", {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M j, Y",
      prevArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    });
  }, []);

  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default ">
        <form action="#">
          <div className="p-6.5">
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full">
                <label className="mb-3 block text-sm font-medium text-black ">
                  Discount Amount
                </label>
                <input
                  type="number"
                  required
                  placeholder="Enter the Discount Amount"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
            </div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black ">
                  Select Start Date
                </label>
                <div className="relative">
                  <input
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary "
                    placeholder="mm/dd/yyyy"
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
                        d="M9.0002 12.8249C8.83145 12.8249 8.69082 12.7687 8.5502 12.6562L2.08145 6.2999C1.82832 6.04678 1.82832 5.65303 2.08145 5.3999C2.33457 5.14678 2.72832 5.14678 2.98145 5.3999L9.0002 11.278L15.0189 5.34365C15.2721 5.09053 15.6658 5.09053 15.9189 5.34365C16.1721 5.59678 16.1721 5.99053 15.9189 6.24365L9.45019 12.5999C9.30957 12.7405 9.16895 12.8249 9.0002 12.8249Z"
                        fill="#64748B"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black ">
                  Select End Date
                </label>
                <div className="relative">
                  <input
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary "
                    placeholder="mm/dd/yyyy"
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
                        d="M9.0002 12.8249C8.83145 12.8249 8.69082 12.7687 8.5502 12.6562L2.08145 6.2999C1.82832 6.04678 1.82832 5.65303 2.08145 5.3999C2.33457 5.14678 2.72832 5.14678 2.98145 5.3999L9.0002 11.278L15.0189 5.34365C15.2721 5.09053 15.6658 5.09053 15.9189 5.34365C16.1721 5.59678 16.1721 5.99053 15.9189 6.24365L9.45019 12.5999C9.30957 12.7405 9.16895 12.8249 9.0002 12.8249Z"
                        fill="#64748B"
                      />
                    </svg>
                  </div>
                </div>
              </div>
           
            </div>
   
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black ">
                Description
              </label>
              <textarea
                rows={6}
                required
                placeholder="Type  description"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
              ></textarea>
            </div>

            <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDiscount;
