'use client'
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import { useAuthRedirect } from "@/utils/checkToken";

const UpdateUser = () => {
  useAuthRedirect();

  const [formData, setFormData] = useState({
    username:"",
    email:"",
    password:"",
    role:'',
  })
  const [errors, setErrors] = useState<any>({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const searchParams = useSearchParams();
  let userId = searchParams.get("userID");

  const router = useRouter();
  const [loading, setLoading] = useState(false); 

  const handleInputChange =(e: any)=>{
    const {name, value} = e.target;
    setFormData({...formData, [name]:value});
    // Validate the input as it's being changed
    validateField(name, value);
  }

  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
        case 'username':
            if (!value.trim()) {
                error = 'Username is required';
            }
            break;  

        case 'email':
              if (!value.trim()) {
                  error = 'Email is required';
              } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
                  error = 'Email is invalid';
              }
              break;
          
          
        case 'role':
              if (!value.trim()) {
                  error = 'User Role is required';
              }
              break;     

        case 'password':
                const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#]{8,}$/;
                if (value && !passwordPattern.test(value)) {
                    error = 'Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, and 1 number.';
                }
                break;

        // Add additional validation cases as needed

        default:
            break;
    }

    setErrors((prevErrors: any) => ({
        ...prevErrors,
        [name]: error,
    }));
};
  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const accessToken = Cookies.get('access_token'); 

          const response = await axios.get(`${process.env.BE_URL}/users/${userId}`, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                  'x-api-key': process.env.X_API_KEY, 
              },
          });
          console.log(response.data);
          setFormData(response.data)
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchUser();
  }, [userId]);
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const response = await fetch('/api/user/update', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: userId, ...formData }),
      });

      const result = await response.json();

      if (!response.ok) {
          throw new Error(result.error || 'Failed to update user');
      }

      toast.success('User updated successfully');
      setTimeout(()=>{
        router.push('/users')
      },1000)
    
  } catch (err) {
    console.log(err)
      setLoading(false); 
      toast.error( 'An error occurred');
  }
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
                {errors.username && <p className="text-red text-sm">{errors.username}</p>}
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
                {errors.email && <p className="text-red text-sm">{errors.email}</p>}
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black ">
                  Password
                </label>
                <input
                  type="text"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter the password"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
                {errors.password && <p className="text-red text-sm">{errors.password}</p>}
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
                {errors.role && <p className="text-red text-sm">{errors.role}</p>}
              </div>
          
            </div>



            <button type="submit" disabled={loading} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
           {loading ? "Updating..." : "Update"} 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
