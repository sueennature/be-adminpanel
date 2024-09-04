"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import Image from "next/image";
import { useAuthRedirect } from "@/utils/checkToken";
import Swal from 'sweetalert2';

interface FormData {
  title: string;
  tags:string;
  media_type: string;
  media_urls: string[];
}

const UpdateCarousel: React.FC = () => {
  useAuthRedirect();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    tags:"",
    media_type: "",
    media_urls: [],
  });
  const [errors, setErrors] = useState<any>({
    title: '',
    tags:"",
    media_type: '',
    media_urls: '',
  });
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);  //set tooltip
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const carouselId = searchParams.get("carouselID");

  const handleDeleteImage = async (index: number) => {
    const imageUrl = formData.media_urls[index];
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
            const reponse = await axios.delete(`${process.env.BE_URL}/carousels/${carouselId}/media`, {
              data: [imageUrl],
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${Cookies.get('access_token')}`,
                  'x-api-key': process.env.X_API_KEY,
              },
          });
     
          setImagePreviews(prevImages => prevImages.filter((_, i) => i !== index));
          setFormData(prevData => ({
              ...prevData,
              media_urls: prevData.media_urls.filter((_, i) => i !== index),
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
    //   console.log("IMAGEURL", imageUrl);
    //   try {
    //     await axios.delete(
    //       `${process.env.BE_URL}/carousels/${carouselId}/media`,
    //       {
    //         data: [imageUrl], // Wrap imageUrl in an array
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${Cookies.get("access_token")}`,
    //           "x-api-key": process.env.X_API_KEY,
    //         },
    //       },
    //     );

    //     setImagePreviews((prevImages) =>
    //       prevImages.filter((_, i) => i !== index),
    //     );
    //     setFormData((prevData) => ({
    //       ...prevData,
    //       media_urls: prevData.media_urls.filter((_, i) => i !== index),
    //     }));
    //   } catch (err) {
    //     console.error("Error deleting image:", err);
    //     toast.error("Error deleting image");
    //   }
    // }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Validate the input as it's being changed
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
        case 'title':
            if (!value.trim()) {
                error = 'Title for carousel is required';
            }
            break;
        case 'tags':
              if (!value.trim()) {
                  error = 'Tags is required';
              }
              break;    
        case 'media_type':
            if (!value.trim()) {
                error = 'Media type is required';
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
  useEffect(() => {
    const fetchActivity = async () => {
      if (carouselId) {
        try {
          const accessToken = Cookies.get("access_token");
          const response = await axios.get(
            `${process.env.BE_URL}/carousels/${carouselId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );
          setFormData(response.data.data);
          console.log("RES", response.data.data);
          if (
            response.data.data.media_urls &&
            Array.isArray(response.data.data.media_urls)
          ) {
            setImagePreviews(response.data.data.media_urls);
          }
        } catch (err) {
          console.error(err);
          toast.error("Error fetching data");
        }
      }
    };

    fetchActivity();
  }, [carouselId]);

  const removeBase64Prefix = (base64String: string) => {
    const imagePrefix = ["data:image/png;base64,", "data:image/jpeg;base64,"];

    for (const prefix of imagePrefix) {
      if (base64String.startsWith(prefix)) {
        return base64String.substring(prefix.length);
      }
    }

    const unwantedPrefix = "data:text/html;base64,";
    if (base64String.startsWith(unwantedPrefix)) {
      return base64String.substring(unwantedPrefix.length);
    }

    return base64String;
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Validate the input as it's being changed
    validateField(name, value);
    setFormData((prevFormData: any)  => ({
      ...prevFormData,
      [name]: value,
      media_urls: [], // Clear media_urls when media_type changes
    }));

    // Declare maxSize and fileType based on the selected media type
    let maxSize = 0;
    let fileType = '';
    
    // Set the max size and file type based on the selected media type
    if (value === 'image') {
      maxSize = 1024 * 1024; // 1 MB in bytes
      fileType = 'Image';
      setTooltipMessage('Please upload an image smaller than 1 MB');
    } else if (value === 'video') {
      maxSize = 2 * 1024 * 1024; // 2 MB in bytes
      fileType = 'Video';
      setTooltipMessage('Please upload a video smaller than 2 MB');
    }

    // Store maxSize and fileType in state or handle validations directly in other places
    // setMaxSize(maxSize); // If you are storing maxSize in state

    // Optionally, you can trigger validation or a reset of error states here if needed
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      media_urls: '', // Clear previous errors when media_type changes
    }));

  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      

      const base64Promises = filesArray.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      });

      Promise.all(base64Promises)
        .then((base64Images) => {
          setFormData((prevData) => ({
            ...prevData,
            media_urls: [...prevData.media_urls, ...base64Images],
          }));
          setImagePreviews([...imagePreviews, ...base64Images]);
        })
        .catch((error) => {
          console.error("Error converting images to base64:", error);
          toast.error("Error uploading images");
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log("form", formData);
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

    const convertImagesToBase64 = async (urls: string[]): Promise<string[]> => {
      const base64Promises = urls.map((url) =>
        url.startsWith("uploads/")
          ? urlToBase64(`https://api.sueennature.com/${url}`)
          : Promise.resolve(url),
      );
      return Promise.all(base64Promises);
    };
    const base64Images = await convertImagesToBase64(formData.media_urls);
    const processedFormData = {
      ...formData,
      media_urls: base64Images.map((url) =>
        url.startsWith("data:") ? removeBase64Prefix(url) : url,
      ),
    };
    console.log("PROCESS", processedFormData);
    try {
      const response = await fetch("/api/carousel/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedFormData),
      });
      const data = response.json();
      console.log("SDA", response);
      if (response.status === 401) {
        toast.error("Credentials Expired. Please Log in Again");
        Cookies.remove("access_token");

        setTimeout(() => {
          router.push("/");
        }, 1500);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(
          `Failed to update carousel: ${errorData.message || "Unknown error"}`,
        );
        return;
      }

      toast.success("Carousel updated successfully");
      setTimeout(() => {
        router.push("/carousels");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
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
              <div className="w-full">
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
                {errors.title && <p className="text-red text-sm">{errors.title}</p>}
              </div>
            </div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full">
                <label className="mb-3 block text-sm font-medium text-black">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  required
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Enter tags to categorize images (e.g., 'Summer', 'Product Launch')"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                {errors.tags && <p className="text-red text-sm">{errors.tags}</p>}
              </div>
            </div>
            <div className="mb-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-black">
                  Media
                </label>
                {tooltipMessage && (
        <div className="mt-2 text-sm text-red">
          {tooltipMessage}
        </div>
      )}
                <input
                  type="file"
                  multiple
                  name="media_urls"
                  onChange={handleFileChange}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                {errors.media_urls && <p className="text-red text-sm mt-1">{errors.media_urls}</p>}
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
                {formData.media_type === "video" ? (
                  <React.Fragment>
                    <video
                      key={index}
                      controls
                      width="200"
                      height="240"
                      className="flex-shrink-0"
                    >
                      <source
                        src={
                          image.startsWith("data:")
                            ? image
                            : `https://api.sueennature.com/${image}`
                        }
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="bg-red-500 relative left-[180px] top-[-110px] rounded-full font-bold text-red"
                    >
                      X
                    </button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Image
                      src={
                        image.startsWith("data:")
                          ? image
                          : `https://api.sueennature.com/${image}`
                      }
                      alt={`Preview ${index}`}
                      width={100}
                      height={100}
                      className="h-20 rounded object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="bg-red-500 relative left-[80px] top-[-80px] rounded-full font-bold text-red"
                    >
                      X
                    </button>
                  </React.Fragment>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
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

export default UpdateCarousel;
