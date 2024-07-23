"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";

interface RoomFormData {
  title: string;
  content: string;
  image_url: string;
  images: [];
  videos: []; 
}

const CreateNews = () => {
  const [formData, setFormData] = useState<RoomFormData>({
    title: "",
    content: "",
    image_url: "",
    images: [],
    videos: [],
  });

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
      setFormData((prevState) => ({
        ...prevState,
        [type]: Array.from(files),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [type]: [],
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.content) {
      console.error("Title and Content are required");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("image_url", formData.image_url);

    // Append images and videos as individual files
    formData.images.forEach((image) => formDataToSend.append("images", image));
    formData.videos.forEach((video) => formDataToSend.append("videos", video));
    console.log("Payload:", Array.from(formDataToSend.entries()));

    console.log(formData)
    try {
      // Log the payload to check its format
      console.log("Payload:", Array.from(formDataToSend.entries()));

      const response = await fetch("/api/news", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create news:", errorData);
        return;
      }

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
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
