'use client'
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from 'react';
import SelectGroupOne from '../../SelectGroup/SelectGroupOne';
import { toast } from 'react-toastify';
import { useAuthRedirect } from "@/utils/checkToken";

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
          setFormData({
            ...formData,
            media_urls: base64Images
          });
        })
        .catch(error => {
          console.error("Error converting images to base64:", error);
          toast.error("Error uploading images");
        });
    }
  };
  const removeBase64Prefix = (base64String: string) => {
    // Find the comma that separates the metadata from the base64 data
    const base64Prefix = 'data:image/png;base64,';
    if (base64String.startsWith(base64Prefix)) {
      return base64String.substring(base64Prefix.length);
    }
    return base64String;
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setFormData((prevFormData: any)  => ({
      ...prevFormData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: any) => {
    setLoading(true)
    e.preventDefault();
    const processedFormData = {
      ...formData,
      media_urls: formData.media_urls?.map(removeBase64Prefix) 
    };
  
    console.log(formData)
    try {
      const response = await fetch("/api/carousel/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create activity:", errorData);
        toast.error("Failed to create activity");
        return;
      }

      const responseData = await response.json();
      console.log("Success:", responseData);
      setLoading(false)
      toast.success("Carousel is  created successfully");
      setTimeout(()=>{
        router.push("/carousels")
      },1500)
    } catch (error) {
      console.error("Error:", error);
      setLoading(false)
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

            <button
            disabled={loading}
              type="submit"
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

export default CreateCarousel;

