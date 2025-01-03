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
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = useState<any>({});
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);  //set tooltip
  const [tooltipType, setTooltipType] = useState<"images" | "videos" | null>(null);


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
      const fileArray = Array.from(files);
      // Set file size limits: 1 MB for images, 2 MB for videos
       const maxSize = type === "images" ? 1024 * 1024 : 2 * 1024 * 1024;
       const oversizedFiles = fileArray.filter(file => file.size > maxSize);

      if (oversizedFiles.length > 0) {
        
        setErrors((prevErrors :any) => ({
            ...prevErrors,
            [type]: `File size must be less than ${type === "images" ? "1 MB" : "2 MB"} for ${type}`,
        }));
    } else {
      setTooltipMessage(null);
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        [type]: '',
      }));
      }

      if (files.length > 0) {
        setErrors((prevErrors: any) => ({
            ...prevErrors,
            media: '' // Clear the media error
        }));
      }
      const filePromises = Array.from(files).map(file => {
         // Clear media error immediately after file selection
         
      
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

  const handleFocus = (type: "images" | "videos") => {
    if (type === "images") {
      setTooltipMessage('Please upload images smaller than 1 MB');
      setTooltipType("images");
    } else if (type === "videos") {
      setTooltipMessage('Please upload videos smaller than 2 MB');
      setTooltipType("videos");
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

  const validateForm = () => {
    let errors: any = {};

    if (!formData.title.trim()) {
      errors.name = "News title is required";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
    }

    if (formData.images.length === 0) {
      errors.media = "At least one file is required";
    }

    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill these input fields correctly");
      return;
    }
    setLoading(true)
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
    if (!formData.title || !formData.content || formData.images.length === 0) {
      toast.error("Please fill all fields");
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
      setLoading(false)
      console.log("Success:", data);
      toast.success("The news has been created successfully!")  
      // successfull toast messsage
      setTimeout(()=>{
        router.push("/news")
      },1500)
    } catch (error) {
      setLoading(false)
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
              {errors.name && <p className="text-red">{errors.name}</p>}
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
            {tooltipMessage && tooltipType === "images" && (
    <div className="mt-2 text-sm text-red">
      {tooltipMessage}
    </div>
  )}
            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, "images")}
              onFocus={() => handleFocus("images")} 
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
            />
            {errors.images && (
    <p className="text-red text-sm mt-1">{errors.images}</p>
  )}
          </div>

          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black">
              Attach Videos
            </label>
            {tooltipMessage && tooltipType === "videos" && (
    <div className="mt-2 text-sm text-red">
      {tooltipMessage}
    </div>
  )}
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => handleFileChange(e, "videos")}
              onFocus={() => handleFocus("videos")}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
            />
            {errors.videos && (
    <p className="text-red text-sm mt-1">{errors.videos}</p>
  )}
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
            {errors.content && <p className="text-red">{errors.content}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          >
             {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNews;

