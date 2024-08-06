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

interface ActivityFormData {
  name: string;
  price: string;
  description: string;
  media: string[];
}

const UpdateActivity = () => {
  const [formData, setFormData] = useState<ActivityFormData>({
    name: '',
    price: '',
    description: '',
    media: [],
  });

  const searchParams = useSearchParams();
  let activityId = searchParams.get("activityID");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  useAuthRedirect()

  const handleDeleteImage = async (index: number) => {
    const imageUrl = formData.media[index];
    const payload = [imageUrl] ;

    if (imageUrl) {
      const result = await Swal.fire({
          title: 'Are you sure?',
          text: 'This action cannot be undone!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
          console.log("IMAGEURL", imageUrl);
          try {
            const reponse = await axios.delete(`${process.env.BE_URL}/activities/${activityId}/media`, {
              data: payload,
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${Cookies.get('access_token')}`,
                  'x-api-key': process.env.X_API_KEY,
              },
          });
     
          setImagePreviews(prevImages => prevImages.filter((_, i) => i !== index));
          setFormData(prevData => ({
              ...prevData,
              media: prevData.media.filter((_, i) => i !== index),
          }));

              Swal.fire(
                  'Deleted!',
                  'Image has been deleted.',
                  'success'
              );
          } catch (err) {
              console.log('Error deleting image:', err);
              toast.error('Error deleting image');
          }
      }
  }
    // if (imageUrl) {
    //     console.log("IMAGEURL", imageUrl);
    //     const payload = [imageUrl] ;
    //     console.log("Payload:", JSON.stringify(payload));
    //     try {
    //         await axios.delete(`${process.env.BE_URL}/activities/${activityId}/media`, {
    //             data: payload,
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${Cookies.get('access_token')}`,
    //                 'x-api-key': process.env.X_API_KEY,
    //             },
    //         });

    //         setImagePreviews(prevImages => prevImages.filter((_, i) => i !== index));
    //         setFormData(prevData => ({
    //             ...prevData,
    //             media: prevData.media.filter((_, i) => i !== index),
    //         }));
    //     } catch (err) {
    //         console.error('Error deleting image:', err);
    //         toast.error('Error deleting image');
    //     }
    // }
  };

  const router = useRouter();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const fileReaders = fileArray.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReaders).then((base64Strings) => {
        setImagePreviews(prevImages => [...prevImages, ...base64Strings]);
        setFormData(prevData => ({
          ...prevData,
          media: [...prevData.media, ...base64Strings]
        }));
      }).catch((error) => {
        console.error("Error converting files to base64:", error);
      });
    }
  };

  const removeBase64Prefix = (base64String: string) => {
    const base64Prefix = 'data:image/png;base64,';
    if (base64String.startsWith(base64Prefix)) {
      return base64String.substring(base64Prefix.length);
    }
    return base64String;
  };

  const handleDateChange = (date: Date | null, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  useEffect(() => {
    const fetchActivity = async () => {
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
          setFormData(response.data.data);
          if (response.data.data.media && Array.isArray(response.data.data.media)) {
            setImagePreviews(response.data.data.media);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchActivity();
  }, [activityId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const processedFormData = {
      media: formData.media.map(removeBase64Prefix) // Process each base64 image
    };
    
    console.log(processedFormData);

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

      toast.success('Activity updated successfully');
      setTimeout(() => {
        router.push('/activity');
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
                  Activity Name
                </label>
                <input
                  type="text"
                  name="name"
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
            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">
                Image Preview
              </label>
              <div className="flex items-center gap-4">
                {imagePreviews.map((media, index) => (
                  <div key={index} className="relative">
                    <Image
                       src={media.startsWith('data:') ? media : `https://api.sueennature.com/${media}`}
                      alt={`Preview ${index}`}
                      width={100}
                      height={100}
                      className="object-cover rounded h-20"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="relative top-[-80px] left-[80px] text-red bg-red-500 rounded-full font-bold"
                    >
                      X
                    </button>
                  </div>
                ))}
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
              {loading ? "Updating..." : "Update"} 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateActivity;


