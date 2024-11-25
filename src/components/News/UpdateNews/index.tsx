"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import SelectGroupOne from "../../SelectGroup/SelectGroupOne";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Image from "next/image";
import Swal from "sweetalert2";
import { useUserContext } from "@/hooks/useUserContext";

interface NewsFormData {
  title: string;
  content: string;
  images: string[];
  videos: (File | string)[];
}

const UpdateNews = () => {
  const [formData, setFormData] = useState<NewsFormData>({
    title: "",
    content: "",
    images: [],
    videos: [],
  });

  const searchParams = useSearchParams();
  let newsId = searchParams.get("newsID");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null); //set tooltip
  const [tooltipType, setTooltipType] = useState<"images" | "videos" | null>(
    null,
  );
  const { groupFour, groupThree } = useUserContext();

  //   const handleDeleteImage = async (index: number) => {
  //     const imageUrl = formData.images[index];
  //     if (imageUrl) {
  //         console.log("IMAGEURL", imageUrl);
  //         try {
  //             await axios.delete(`${process.env.BE_URL}/rooms/${newsId}/media`, {
  //                 data: { files_to_delete: [imageUrl] },
  //                 headers: {
  //                     'Content-Type': 'application/json',
  //                     Authorization: `Bearer ${Cookies.get('access_token')}`,
  //                     'x-api-key': process.env.X_API_KEY,
  //                 },
  //             });

  //             setImagePreviews(prevImages => prevImages.filter((_, i) => i !== index));
  //             setFormData(prevData => ({
  //                 ...prevData,
  //                 images: prevData.images.filter((_, i) => i !== index),
  //             }));
  //         } catch (err) {
  //             console.error('Error deleting image:', err);
  //             toast.error('Error deleting image');
  //         }
  //     }
  // };

  const handleDeleteMedia = async (
    index: number,
    mediaType: "image" | "video",
  ) => {
    const mediaUrl =
      mediaType === "image" ? formData.images[index] : formData.videos[index];
    if (mediaUrl) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      console.log("MEDIA URL", mediaUrl);
      const payload = [mediaUrl];
      console.log("Payload:", JSON.stringify(payload));
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${process.env.BE_URL}/news/${newsId}/media?media_type=${mediaType}`,
            {
              data: payload,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("access_token")}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );

          if (mediaType === "image") {
            setImagePreviews((prevImages) =>
              prevImages.filter((_, i) => i !== index),
            );
            setFormData((prevData) => ({
              ...prevData,
              images: prevData.images.filter((_, i) => i !== index),
            }));
            Swal.fire("Deleted!", "Image has been deleted.", "success");
          } else {
            setVideoPreviews((prevVideos) =>
              prevVideos.filter((_, i) => i !== index),
            );
            setFormData((prevData) => ({
              ...prevData,
              videos: prevData.videos.filter((_, i) => i !== index),
            }));
          }

          Swal.fire("Deleted!", "Video has been deleted.", "success");
        } catch (err) {
          console.error(`Error deleting ${mediaType}:`, err);
          toast.error(`Error deleting ${mediaType}`);
        }
      }
    }
  };

  const handleDeleteVideo = (index: number) => {
    setVideoPreviews((prevVideos) => prevVideos.filter((_, i) => i !== index));
    setFormData((prevData) => ({
      ...prevData,
      videos: prevData.videos.filter((_, i) => i !== index),
    }));
  };

  const router = useRouter();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video",
  ) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      // Set file size limits: 1 MB for images, 2 MB for videos
      const maxSize = type === "image" ? 1024 * 1024 : 2 * 1024 * 1024;
      const oversizedFiles = fileArray.filter((file) => file.size > maxSize);

      if (oversizedFiles.length > 0) {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          [type]: `File size must be less than ${type === "image" ? "1 MB" : "2 MB"} for ${type}`,
        }));
      } else {
        setTooltipMessage(null);
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          [type]: "",
        }));
      }

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

      Promise.all(fileReaders)
        .then((base64Strings) => {
          if (type === "image") {
            setImagePreviews((prevImages) => [...prevImages, ...base64Strings]);
            setFormData((prevData) => ({
              ...prevData,
              images: [...prevData.images, ...base64Strings],
            }));
          } else if (type === "video") {
            setVideoPreviews((prevVideos) => [...prevVideos, ...base64Strings]);
            setFormData((prevData) => ({
              ...prevData,
              videos: [...prevData.videos, ...base64Strings],
            }));
          }
        })
        .catch((error) => {
          console.error("Error converting files to base64:", error);
        });
    }
  };

  const handleFocus = (type: "images" | "videos") => {
    if (type === "images") {
      setTooltipMessage("Please upload images smaller than 1 MB");
      setTooltipType("images");
    } else if (type === "videos") {
      setTooltipMessage("Please upload videos smaller than 2 MB");
      setTooltipType("videos");
    }
  };
  useEffect(() => {
    const fetchNews = async () => {
      if (newsId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/news/${newsId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );
          console.log(response.data.data);
          setFormData(response.data.data);
          if (
            response.data.data.images &&
            Array.isArray(response.data.data.images)
          ) {
            setImagePreviews(response.data.data.images);
          }
          if (
            response.data.data.videos &&
            Array.isArray(response.data.data.videos)
          ) {
            setVideoPreviews(response.data.data.videos);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchNews();
  }, [newsId]);

  const removeBase64Prefix = (base64String: string) => {
    // Find the prefix pattern for images and videos
    const imagePrefixPattern = /^data:image\/(png|jpeg|jpg);base64,/;
    const videoPrefixPattern = /^data:video\/(mp4|ogg|webm);base64,/;

    if (base64String.match(imagePrefixPattern)) {
      return base64String.replace(imagePrefixPattern, "");
    }
    if (base64String.match(videoPrefixPattern)) {
      return base64String.replace(videoPrefixPattern, "");
    }
    return base64String;
  };

  const validateForm = () => {
    let errors: any = {};

    if (!formData.title.trim()) {
      errors.name = "News title is required";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all the fields correctly");
      return;
    }
    setLoading(true);
    const processedFormData = {
      ...formData,
      images: formData.images.map(removeBase64Prefix),
      videos: formData.videos.map((video) =>
        typeof video === "string" ? removeBase64Prefix(video) : video,
      ),
    };

    console.log(formData);

    try {
      const response = await fetch("/api/news/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update item");
      }

      toast.success("News updated successfully");
      setTimeout(() => {
        router.push("/news");
      }, 1000);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("An error occurred");
    }
  };
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e, "image");
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e, "video");
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
                  placeholder="Enter the Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
                {errors.name && <p className="text-red">{errors.name}</p>}
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Attach Image
              </label>
              {groupFour && tooltipMessage && tooltipType === "images" && (
                <div className="mt-2 text-sm text-red">{tooltipMessage}</div>
              )}
              <input
                type="file"
                multiple
                onChange={handleImageFileChange}
                onFocus={() => handleFocus("images")}
                disabled={!groupFour}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
              {errors.images && (
                <p className="mt-1 text-sm text-red">{errors.images}</p>
              )}
            </div>
            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">
                Image Preview
              </label>
              <div className="flex items-center gap-4">
                {imagePreviews.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={
                        image.startsWith("data:")
                          ? image
                          : `${process.env.BE_URL}/${image}`
                      }
                      alt={`Preview ${index}`}
                      width={100}
                      height={100}
                      className="h-20 rounded object-cover"
                    />
                    {groupThree && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMedia(index, "image")}
                        className="bg-red-500 relative left-[80px] top-[-80px] rounded-full font-bold text-red"
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Attach Video
              </label>
              {groupFour && tooltipMessage && tooltipType === "videos" && (
                <div className="mt-2 text-sm text-red">{tooltipMessage}</div>
              )}
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleVideoFileChange}
                onFocus={() => handleFocus("videos")}
                disabled={!groupFour}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
              {errors.videos && (
                <p className="mt-1 text-sm text-red">{errors.videos}</p>
              )}
            </div>
            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">
                Video Previews
              </label>
              <div className="flex flex-col gap-4">
                {videoPreviews.map((video, index) => (
                  <div key={index} className="relative">
                    <video
                      src={
                        video.startsWith("data:")
                          ? video
                          : `${process.env.BE_URL}/${video}`
                      }
                      controls
                      width="140"
                      height="100"
                      className="h-20 rounded object-cover"
                    />
                    {groupThree && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMedia(index, "video")}
                        className="bg-red-500 relative left-[120px] top-[-80px] rounded-full font-bold text-red"
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}
              </div>
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
                onChange={handleInputChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              ></textarea>
              {errors.content && <p className="text-red">{errors.content}</p>}
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

export default UpdateNews;
