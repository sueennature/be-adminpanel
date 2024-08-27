'use client'
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from 'react';
import SelectGroupOne from '../../SelectGroup/SelectGroupOne';
import { toast } from 'react-toastify';
import { useAuthRedirect } from "@/utils/checkToken";
import Cookies from "js-cookie";

const CreateAdditionalServices = () => {
  const [formData, setFormData] = useState<any>({
    name: '',
    price: '',
    description: '',
  });
  const [errors, setErrors] = useState<any>({
    name: '',
    price: '',
    description: '',
  });
  const router = useRouter();
  const [loading, setLoading] = React.useState(false)
useAuthRedirect()
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


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true)
      // Process the base64 images in formData
    const processedFormData = {
      ...formData,
     
    };
  
    console.log(processedFormData);

    if (!formData.name || !formData.price ) {
      toast.error("Please fill At least name and amount fields");
      return;
    }

    try {
      const response = await fetch("/api/additionalService", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create additional service:", errorData);
        toast.error("Failed to create additional service");
        return;
      }
      if(response.status === 401){
        toast.error("Credentials Expired. Please Log in Again")
        Cookies.remove('access_token');
        setTimeout(()=>{
          router.push('/')
        },1500)
        return;
      }
      const responseData = await response.json();
      setLoading(false)
      console.log("Success:", responseData);
      toast.success("Additional Service created successfully");
      setTimeout(()=>{
        router.push("/additionalServices")
      },1500)
    } catch (error) {
      setLoading(false)
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default">
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
              disabled={loading}
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdditionalServices;

