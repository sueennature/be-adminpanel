'use client';
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent,useEffect, useState } from 'react'
import SelectGroupOne from '../../SelectGroup/SelectGroupOne'
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const UpdateActivity = () => {
  const [formData, setFormData] = useState<any>({
    name: '',
    price: '',
    description: '',
    images: []
  });

  const searchParams = useSearchParams();
  let activityId = searchParams.get("activityID");

  const router = useRouter();

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        images: Array.from(e.target.files)
      });
    }
  };

  // const handleSubmit = (e:any) => {
  //   e.preventDefault();
  //   if(!formData.activityName || !formData.price || !formData.description || !formData.images){
  //     toast.error("Please fill All Fields")
  //   }
  //   console.log('Form submitted:', formData);
  //   toast.success("Activity  created successfully")
  // };

  useEffect(() => {
    const fetchUser = async () => {
      if (activityId) {
        try {
          const accessToken = Cookies.get('access_token'); 

          const response = await axios.get(`${process.env.BE_URL}/activities/${activityId}`, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                  'x-api-key': process.env.X_API_KEY, 
              },
          });
          console.log(response.data.data);
          setFormData(response.data.data)
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchUser();
  }, [activityId]);
  const handleSubmit = async (e:any) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/activity/update', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: activityId, ...formData }),
      });

      const result = await response.json();

      if (!response.ok) {
          throw new Error(result.error || 'Failed to update item');
      }

      toast.success('User updated successfully');
      setTimeout(()=>{
        router.push('/users')
      },1000)
    
  } catch (err) {
    console.log(err)
      toast.error( 'An error occurred');
  }
  };


  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default ">
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black">
                  Activity Name
                </label>
                <input
                  type="text"
                  name="activityName"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter the Activity Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black">
                  Amount
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter the Amount"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
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
                  multiple
                  onChange={handleFileChange}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Description
              </label>
              <textarea
                rows={6}
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Type description"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              ></textarea>
            </div>
            <button
              type="submit"
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateActivity;
