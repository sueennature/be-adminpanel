"use client";
import React from "react";
import flatpickr from "flatpickr";

const CreateTaxTypes = () => {


  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default ">
        <form action="#">
          <div className="p-6.5">
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black ">
                  Name
                </label>
                <input
                  type="number"
                  required
                  placeholder="Enter the Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black ">
                  Rate
                </label>
                <input
                  type="number"
                  required
                  placeholder="Enter the Rate"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
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

export default CreateTaxTypes;
