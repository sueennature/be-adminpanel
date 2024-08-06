"use client";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";

interface RoomFormData {
  title: string;
  content: string;
  image_url: string;
  images: string[];
  videos: string[];
}

const CreateNews = () => {
  const [formData, setFormData] = useState<RoomFormData>({
    title: "",
    content: "",
    image_url: "",
    images: [],
    videos: [],
  });
  const router = useRouter()
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "images" | "videos",
  ) => {
    const files = e.target.files;
    if (files) {
      const filePromises = Array.from(files).map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      });

      Promise.all(filePromises)
        .then(base64Files => {
          setFormData((prevState) => ({
            ...prevState,
            [type]: base64Files,
          }));
        })
        .catch(error => console.error("Error converting files:", error));
    }
  };
  const removeImageBase64Prefix = (base64String: string) => {
    const imagePrefixPattern = /^data:image\/(png|jpeg|jpg);base64,/;
    return base64String.replace(imagePrefixPattern, '');
  };
  
  const removeVideoBase64Prefix = (base64String: string) => {
    const videoPrefixPattern = /^data:video\/(mp4|ogg|webm);base64,/;
    return base64String.replace(videoPrefixPattern, '');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const processedFormData = {
      ...formData,
       images: formData.images.map(removeImageBase64Prefix),
    videos: formData.videos.map(video => typeof video === 'string' ? removeVideoBase64Prefix(video) : video)
    };
  
    console.log(processedFormData);

    // Basic validation
    if (!formData.title || !formData.content) {
      console.error("Title and Content are required");
      return;
    }

   

    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create news:", errorData);
        return;
      }

      const data = await response.json();
      console.log("Success:", data);
      toast.success("The news has been created successfully!")  
      // successfull toast messsage
      setTimeout(()=>{
        router.push("/news")
      },1500)
    } catch (error) {
      console.error("Error:", error);
      toast.success("Somthing went wrong!")
      // Error toast messsage
    }
  };

  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <form onSubmit={handleSubmit} className="p-6.5">
          <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-3 block text-sm font-medium text-black">
                Title
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="Enter the Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black">
              Image URL
            </label>
            <input
              type="text"
              name="image_url"
              placeholder="Enter the Image URL"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
            />
          </div>

          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black">
              Attach Images
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, "images")}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
            />
          </div>

          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black">
              Attach Videos
            </label>
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => handleFileChange(e, "videos")}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
            />
          </div>

          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black">
              Content
            </label>
            <textarea
              rows={6}
              name="content"
              required
              placeholder="Type Content"
              value={formData.content}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
            ></textarea>
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNews;

