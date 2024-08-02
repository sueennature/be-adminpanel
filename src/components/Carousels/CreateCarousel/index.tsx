'use client'
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthRedirect } from "@/utils/checkToken";
import Cookie from 'js-cookie';

const CreateCarousel = () => {
  useAuthRedirect();
  const [formData, setFormData] = useState<any>({
    title: '',
    media_type: '',
    media_urls: [],
  });
  const router = useRouter()
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const { media_type } = formData;

      // Validate files based on selected media type
      const allowedExtensions = media_type === 'image'
        ? ['image/png', 'image/jpeg']
        : media_type === 'video'
        ? ['video/mp4']
        : [];

      if (media_type && !filesArray.every(file => allowedExtensions.includes(file.type))) {
        toast.error(`Please upload ${media_type === 'image' ? 'images' : 'videos'} only.`);
        return;
      }

      const base64Promises = filesArray.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      });

      Promise.all(base64Promises)
        .then(base64Files => {
          setFormData({
            ...formData,
            media_urls: base64Files
          });
        })
        .catch(error => {
          console.error("Error converting files to base64:", error);
          toast.error("Error uploading files");
        });
    }
  };

  const removeBase64Prefix = (base64String: string) => {
    // Define prefixes for different image types
    const pngPrefix = 'data:image/png;base64,';
    const jpegPrefix = 'data:image/jpeg;base64,';
    const mp4Prefix = 'data:video/mp4;base64,';

    if (base64String.startsWith(pngPrefix)) {
      return base64String.substring(pngPrefix.length);
    } else if (base64String.startsWith(jpegPrefix)) {
      return base64String.substring(jpegPrefix.length);
    } else if (base64String.startsWith(mp4Prefix)) {
      return base64String.substring(mp4Prefix.length);
    }

    // If none of the prefixes match, return the original string
    return base64String;
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setFormData((prevFormData: any)  => ({
      ...prevFormData,
      [name]: value,
      media_urls: [], // Clear media_urls when media_type changes
    }));
  };

  const handleSubmit = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    const processedFormData = {
      ...formData,
      media_urls: formData.media_urls?.map(removeBase64Prefix) 
    };
  
    try {
      const response = await fetch("/api/carousel/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedFormData),
      });

      if (response.status === 401) {
        toast.error("Credentials Expired. Please Log in Again");
        Cookie.remove('access_token');
        setTimeout(() => {
          router.push('/');
        }, 1500);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create carousel:", errorData);
        toast.error("Failed to create carousel");
        return;
      }

      const responseData = await response.json();
      console.log("Success:", responseData);
      setLoading(false);
      toast.success("Carousel is created successfully");
      setTimeout(() => {
        router.push("/carousels");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default">
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
            <button
              disabled={loading}
              type="submit"
              onSubmit={handleSubmit}
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
      </div>
    </div>
  );
};

export default CreateCarousel;
