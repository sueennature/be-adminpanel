import React from 'react'
import SelectGroupOne from '../../SelectGroup/SelectGroupOne'

const CreateActivity = () => {
  return (
    <div className="flex flex-col gap-9">
    <div className="rounded-sm border border-stroke bg-white shadow-default ">
      <form action="#">
        <div className="p-6.5">
          
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">

            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black ">
                Activity Name
              </label>
              <input
                type="text"
                required
                placeholder="Enter the Activity Name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
              />
            </div>   
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black ">
                Amount
              </label>
              <input
                type="number"
                required
                placeholder="Enter the Amount"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
              />
            </div>
          
          </div>

          <div className="mb-6">
            <div>
                <label className="mb-3 block text-sm font-medium text-black">
                  Attach file
                </label>
                <input
                  type="file"
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
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
  )
}

export default CreateActivity