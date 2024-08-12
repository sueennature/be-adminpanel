"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthRedirect } from "@/utils/checkToken";
import Swal from 'sweetalert2';

interface FormData {
    first_name: string;
    last_name: string;
    email: string;
    telephone: string;
    address: string;
    nationality: string;
  }

const UpdateAgent = () => {
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    telephone: "",
    address: "",
    nationality: ""
});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useAuthRedirect()
  const router = useRouter();
  const searchParams = useSearchParams();
  let agentId = searchParams.get("agentID");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // const handleDeleteImage = async (index: number) => {
  //   const imageUrl = formData.profile_image[index];
  //   if (imageUrl) {
  //     const result = await Swal.fire({
  //         title: 'Are you sure?',
  //         text: 'This action cannot be undone!',
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonColor: '#3085d6',
  //         cancelButtonColor: '#d33',
  //         confirmButtonText: 'Yes, delete it!'
  //     });

  //     if (result.isConfirmed) {
  //         console.log("IMAGEURL", imageUrl);
  //         try {
  //           const reponse = await axios.delete(`${process.env.BE_URL}/guests/${guestId}/images`, {
  //             data: [imageUrl] ,
  //             headers: {
  //                 'Content-Type': 'application/json',
  //                 Authorization: `Bearer ${Cookies.get('access_token')}`,
  //                 'x-api-key': process.env.X_API_KEY,
  //             },
  //         });
  //         console.log("ASD",reponse)
  //         setImagePreviews(prevImages => prevImages.filter((_, i) => i !== index));
  //         setFormData(prevData => ({
  //             ...prevData,
  //             profile_image: prevData.profile_image.filter((_, i) => i !== index),
  //         }));

  //             Swal.fire(
  //                 'Deleted!',
  //                 'Image has been deleted.',
  //                 'success'
  //             );
  //         } catch (err) {
  //             console.log('Error deleting image:', err);
  //             toast.error('Error deleting image, Please Login and try again');
  //         }
  //     }
  // }
  //   // if (imageUrl) {
  //   //   console.log("IMAGEURL", imageUrl);
  //   //   try {
  //   //     await axios.delete(`${process.env.BE_URL}/guests/${guestId}/images`, {
  //   //       data: [imageUrl] , // Wrap imageUrl in an array
  //   //       headers: {
  //   //         'Content-Type': 'application/json',
  //   //         Authorization: `Bearer ${Cookies.get('access_token')}`,
  //   //         'x-api-key': process.env.X_API_KEY,
  //   //       },
  //   //     });
  
  //   //     setImagePreviews(prevImages => prevImages.filter((_, i) => i !== index));
  //   //     setFormData(prevData => ({
  //   //       ...prevData,
  //   //       profile_image: prevData.profile_image.filter((_, i) => i !== index),
  //   //     }));
  //   //   } catch (err) {
  //   //     console.error('Error deleting image:', err);
  //   //     toast.error('Error deleting image');
  //   //   }
  //   // }
  // };

  useEffect(() => {
    const fetchActivity = async () => {
      if (agentId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/agents/${agentId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );
          console.log(response.data);
          
          setFormData({
            ...response.data,
           
          });
          
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchActivity();
  }, [agentId]);
  
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     const filesArray = Array.from(e.target.files);
  //     const base64Promises = filesArray.map(file => {
  //       return new Promise<string>((resolve, reject) => {
  //         const reader = new FileReader();
  //         reader.readAsDataURL(file);
  //         reader.onload = () => resolve(reader.result as string);
  //         reader.onerror = error => reject(error);
  //       });
  //     });
  
  //     Promise.all(base64Promises)
  //     .then(base64Images => {
  //       setFormData(prevData => ({
  //         ...prevData,
  //         profile_image: base64Images 
  //       }));
  //     })
  //     .catch(error => {
  //       console.error("Error converting images to base64:", error);
  //       toast.error("Error uploading images");
  //     });
  //   }
  // };
  
  
  // const removeBase64Prefix = (base64String: string) => {
  //   // Find the comma that separates the metadata from the base64 data
  //   const base64Prefix = 'data:image/png;base64,';
  //   if (base64String.startsWith(base64Prefix)) {
  //     return base64String.substring(base64Prefix.length);
  //   }
  //   return base64String;
  // };
  const handleDateChange = (date: Date | null, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

  

    const dataToSubmit = {
      ...formData,
    
    };
    const processedFormData = {
        ...dataToSubmit,
        
      };
      
    
      console.log(processedFormData);
    
    try {
      const response = await fetch("/api/agent/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: agentId, ...formData }),
      });

      const result = await response.json();
      if(response.status === 401){
        toast.error("Credentials Expired. Please Log in Again")
        Cookies.remove('access_token');
        setTimeout(()=>{
          router.push('/')
        },1500)
        return;
      }
      if (!response.ok) {
        throw new Error(result.error || "Failed to update item");
      }

      setLoading(false);
      toast.success("Agent is updated successfully");
      setTimeout(() => {
        router.push("/agent");
      }, 1500);
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error("An error occurred");
    }
    console.log("Form Data:", dataToSubmit);
  };

  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter the First Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Last Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
            </div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter the email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>

              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Nationality
                </label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option value="">Select a nationality</option>
                  <option value="foreign">Foreign</option>
                  <option value="local">Local</option>
                </select>
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Telephone
                </label>
                <input
                  type="number"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Telephone"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
            </div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Address"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded bg-primary px-6 py-3 text-center text-base font-medium text-white transition hover:bg-opacity-90"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAgent;
