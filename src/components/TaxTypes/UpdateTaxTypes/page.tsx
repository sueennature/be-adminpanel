"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateTaxTypes = () => {
  const [formData, setFormData] = useState({
    name: "",
    percentage: 0,
    tax_type: "",
    description: ""
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const searchParams = useSearchParams();
  let taxId = searchParams.get("taxID");

  const router = useRouter();
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const fetchTax = async () => {
      if (taxId) {
        try {
          const accessToken = Cookies.get('access_token'); 

          const response = await axios.get(`${process.env.BE_URL}/taxes/${taxId}`, {
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

    fetchTax();
  }, [taxId]);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
    try {
      const response = await fetch('/api/tax/update', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: taxId, ...formData }),
      });

      const result = await response.json();

      if (!response.ok) {
          throw new Error(result.error || 'Failed to update item');
      }

      toast.success('tax is updated successfully');
      if(response.status === 401){
        toast.error("Credentials Expired. Please Log in Again")
        Cookies.remove('access_token');
        setTimeout(()=>{
          router.push('/')
        },1500)
        return;
      }
      setTimeout(()=>{
        router.push('/taxestypes')
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
        <form action="#" onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black ">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black ">
                  Percentage
                </label>
                <input
                  type="number"
                  name="percentage"
                  value={formData.percentage}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Rate"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Tax Type
                </label>
                <select
                  required
                  name="tax_type"
                  onChange={handleChange}
                  value={formData.tax_type}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option value="">Select a tax type</option>
                  <option value="private">Private</option>
                  <option value="government">Government</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black ">
                Description
              </label>
              <textarea
                rows={6}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Type description"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
              ></textarea>
            </div>

            <button disabled={loading} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTaxTypes;
