import React from "react";

const CreateGuest = () => {
  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default ">
        <form action="#">
          <div className="p-6.5">
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black ">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter the First Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black ">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter the Last Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
            </div>

            <div className="mb-6.5  flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black ">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter the email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>

              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Nationality
                </label>
                <select
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option value="">Select a nationality</option>
                  <option value="foreign">Foreign</option>
                  <option value="local">Local</option>
                </select>
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black ">
                  Telephone
                </label>
                <input
                  type="number"
                  required
                  placeholder="Enter the Telephone"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black ">
                Address
              </label>
              <textarea
                rows={6}
                required
                placeholder="Enter the Address"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
              ></textarea>
            </div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black ">
                  Guest First Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter the Guest First Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black ">
                    Guest Last Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter the Guest Last Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
            </div>

            <div className="mb-6.5  flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black ">
                    Guest Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter the Guest email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>

              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                    Guest Nationality
                </label>
                <select
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option value="">Select a guest nationality</option>
                  <option value="foreign">Foreign</option>
                  <option value="local">Local</option>
                </select>
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black ">
                 Guest Telephone
                </label>
                <input
                  type="number"
                  required
                  placeholder="Enter the Guest Telephone"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black ">
              Guest Address
              </label>
              <textarea
                rows={6}
                required
                placeholder="Enter the Guest Address"
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

export default CreateGuest;
