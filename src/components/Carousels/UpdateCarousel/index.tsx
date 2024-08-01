  'use client'
  import { useRouter, useSearchParams } from 'next/navigation';
  import React, { ChangeEvent, useEffect, useState } from 'react';
  import { toast } from 'react-toastify';
  import Cookies from 'js-cookie';
  import axios from 'axios';
  import Image from 'next/image';

  interface FormData {
    title: string;
    media_type: string;
    media_urls: string[];
  }

  const UpdateCarousel: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
      title: '',
      media_type: '',
      media_urls: [],
    });
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const carouselId = searchParams.get('carouselID');

    const handleDeleteImage = (index: number) => {
      console.log('Deleting index:', index);
    
      // Delete from imagePreviews
      setImagePreviews(prevImages => {
        const updatedImages = prevImages.filter((_, i) => i !== index);
        console.log('Updated imagePreviews:', updatedImages);
        return updatedImages;
      });
    
      // Delete from formData.media_urls
      setFormData(prevData => {
        const updatedMediaUrls = prevData.media_urls.filter((_, i) => i !== index);
        console.log('Updated media_urls:', updatedMediaUrls);
        return {
          ...prevData,
          media_urls: updatedMediaUrls,
        };
      });
    };
    
    
    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    useEffect(() => {
      const fetchActivity = async () => {
        if (carouselId) {
          try {
            const accessToken = Cookies.get('access_token');
            const response = await axios.get(
              `${process.env.BE_URL}/carousels/${carouselId}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${accessToken}`,
                  'x-api-key': process.env.X_API_KEY,
                },
              }
            );
            setFormData(response.data.data);
            console.log("RES", response.data.data)
            if (response.data.data.media_urls && Array.isArray(response.data.data.media_urls)) {
              setImagePreviews(response.data.data.media_urls);
            }
          } catch (err) {
            console.error(err);
            toast.error('Error fetching data');
          }
        }
      };

      fetchActivity();
    }, [carouselId]);

    const removeBase64Prefix = (base64String: string) => {
      const imagePrefix = ['data:image/png;base64,', 'data:image/jpeg;base64,'];
    
      // Check if the string starts with any of the image prefixes and return it if so
      for (const prefix of imagePrefix) {
        if (base64String.startsWith(prefix)) {
          return base64String.substring(prefix.length);
        }
      }
    
      // If it's not an image base64 string, remove the unwanted prefix
      const unwantedPrefix = 'data:text/html;base64,';
      if (base64String.startsWith(unwantedPrefix)) {
        return base64String.substring(unwantedPrefix.length);
      }
    
      // Return the string as is if no prefix needs to be removed
      return base64String;
    };


    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const filesArray = Array.from(e.target.files);
        const base64Promises = filesArray.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });
        });

        Promise.all(base64Promises)
          .then(base64Images => {
            setFormData(prevData => ({
              ...prevData,
              media_urls: [...prevData.media_urls, ...base64Images]
            }));
            setImagePreviews([...imagePreviews, ...base64Images]);
          })
          .catch(error => {
            console.error('Error converting images to base64:', error);
            toast.error('Error uploading images');
          });
      }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      console.log("form", formData)
      // Helper function to convert an image URL to a base64 string
      const urlToBase64 = async (url: string): Promise<string> => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };
    
      // Convert all image URLs in formData to base64
      const convertImagesToBase64 = async (urls: string[]): Promise<string[]> => {
        const base64Promises = urls.map(url => url.startsWith('uploads/') ? urlToBase64(`https://api.sueennature.com/${url}`) : Promise.resolve(url));
        return Promise.all(base64Promises);
      };
      const base64Images = await convertImagesToBase64(formData.media_urls);
      const processedFormData = {
        ...formData,
        media_urls: base64Images.map(url =>
          url.startsWith('data:') ? removeBase64Prefix(url) : url
        ),
      };
      console.log("PROCESS", processedFormData)
      try {
     
    
        const response = await fetch('/api/carousel/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(processedFormData),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          toast.error(`Failed to update carousel: ${errorData.message || 'Unknown error'}`);
          return;
        }
    
        toast.success('Carousel updated successfully');
        setTimeout(() => {
          router.push('/carousels');
        }, 1500);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Something went wrong!');
      } finally {
        setLoading(false);
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
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter the Title"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                  />
                </div>
              </div>
              <div className="mb-6">
                <div>
                  <label className="mb-3 block text-sm font-medium text-black">
                    Media
                  </label>
                  <input
                    type="file"
                    multiple
                    name="media_urls"
                    onChange={handleFileChange}
                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-black">
                  Media Type
                </label>
                <select
                  name="media_type"
                  value={formData.media_type}
                  onChange={handleSelectChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option value="">Select a media type</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              {imagePreviews.map((image, index) => (
  <div key={index} className="relative">
    <Image
      src={image.startsWith('data:') ? image : `https://api.sueennature.com/${image}`}
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


              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default UpdateCarousel;
