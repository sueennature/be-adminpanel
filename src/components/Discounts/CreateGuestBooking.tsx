import React from "react";

const CreateGuestBooking = () => {
  return (
    <div className="flex flex-col gap-9">
        <form action="#">
            <div className="mb-4 text-2xl font-bold text-black">
                Your Info
            </div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black ">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter the First Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black ">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter the Last Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black ">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter the email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black">
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
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black ">
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
              <label className="mb-3 block text-xl font-medium text-black ">
                Address
              </label>
              <textarea
                rows={6}
                required
                placeholder="Enter the Address"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
              ></textarea>
            </div>

            <div className="mb-4 text-2xl font-bold text-black">
                Guest Info
            </div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black ">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter the Guest First Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black ">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter the Guest Last Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black ">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter the Guest email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>

              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black">
                  Nationality
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
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-xl font-medium text-black ">
                   Telephone
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
              <label className="mb-3 block text-xl font-medium text-black ">
                 Address
              </label>
              <textarea
                rows={6}
                required
                placeholder="Enter the Guest Address"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
              ></textarea>
            </div>
        </form>
      </div>
  );
};

export default CreateGuestBooking;
