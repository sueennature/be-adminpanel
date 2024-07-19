'use client'
import React, { useState } from "react";
import { toast } from "react-toastify";

const UpdateUser = () => {
  const [formData, setFormData] = useState({
    username:"",
    email:"",
    password:"",
    role:'',
  })

  const handleInputChange =(e: any)=>{
    const {name, value} = e.target;
    setFormData({...formData, [name]:value})
  }

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password || !formData.role){
      toast.error("Please fill All Fields")
    }
    console.log('Form submitted:', formData);
    toast.success("User created successfully")
  };

  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default ">
      <form onSubmit={handleSubmit}>
      <div className="p-6.5">
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
         
          
            </div>

            <div className="mb-6.5  flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black ">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter the username"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black ">
                  Email
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter the email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black ">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter the password"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  role
                </label>
                <select
                  required
                  name="role"
                  onChange={handleInputChange}
                  value={formData.role}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option value="">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="guest">Guest</option>
                  <option value="channelManager">Channel Manager</option>
                </select>
              </div>
          
            </div>



            <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
