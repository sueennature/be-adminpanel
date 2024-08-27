'use client';
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from 'react';
import SelectGroupOne from '../../SelectGroup/SelectGroupOne';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Image from "next/image";
import { useAuthRedirect } from "@/utils/checkToken";
import Swal from 'sweetalert2';

interface AdditionalServiceFormData {
  name: string;
  price: string;
  description: string;
}

const UpdateAdditionalService = () => {
  const [formData, setFormData] = useState<AdditionalServiceFormData>({
    name: '',
    price: '',
    description: ''
  });
  const [errors, setErrors] = useState<any>({
    name: '',
    price: '',
    description: '',
  });

  const searchParams = useSearchParams();
  let additionalServiceId = searchParams.get("additionalServiceID");
  // const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  useAuthRedirect()


  const router = useRouter();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Validate the input as it's being changed
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
        case 'name':
            if (!value.trim()) {
                error = 'Additional Service name is required';
            }
            break;
          case 'price':
              if (!value.trim()) {
                  error = 'Additional Service amount is required';
              }
              break;    


        default:
            break;
    }

    setErrors((prevErrors: any) => ({
        ...prevErrors,
        [name]: error,
    }));
};


  const handleDateChange = (date: Date | null, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  useEffect(() => {
    const fetchAdditionalService = async () => {
      if (additionalServiceId) {
        try {
          const accessToken = Cookies.get('access_token'); 

          const response = await axios.get(`${process.env.BE_URL}/additional-services/${additionalServiceId}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
              'x-api-key': process.env.X_API_KEY, 
            },
          });
          console.log(response.data);
          setFormData(response.data);
          
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchAdditionalService();
  }, [additionalServiceId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    
    console.log(formData);

    try {
      const response = await fetch('/api/additionalService/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: additionalServiceId, ...formData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update item');
      }

      toast.success('Additional Service updated successfully');
      setTimeout(() => {
        router.push('/additionalServices');
      }, 1000);
    
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error('An error occurred');
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
                  Additional Service Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter the Additional Service Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                {errors.name && <p className="text-red text-sm">{errors.name}</p>}
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
                {errors.price && <p className="text-red text-sm">{errors.price}</p>}
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Description
              </label>
              <textarea
                rows={6}
                name="description"
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
              {loading ? "Updating..." : "Update"} 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAdditionalService;


