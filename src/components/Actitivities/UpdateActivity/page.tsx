"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import SelectGroupOne from "../../SelectGroup/SelectGroupOne";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Image from "next/image";
import { useAuthRedirect } from "@/utils/checkToken";
import Swal from "sweetalert2";
import { useUserContext } from "@/hooks/useUserContext";

interface ActivityFormData {
  name: string;
  price: string;
  description: string;
  media: string[];
}

const UpdateActivity = () => {
  const [formData, setFormData] = useState<ActivityFormData>({
    name: "",
    price: "",
    description: "",
    media: [],
  });

  const searchParams = useSearchParams();
  let activityId = searchParams.get("activityID");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null); //set tooltip
  useAuthRedirect();
  const { groupThree } = useUserContext();

  const handleDeleteImage = async (index: number) => {
    const imageUrl = formData.media[index];
    const payload = [imageUrl];

    if (imageUrl) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        console.log("IMAGEURL", imageUrl);
        try {
          const reponse = await axios.delete(
            `${process.env.BE_URL}/activities/${activityId}/media`,
            {
              data: payload,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("access_token")}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );

          setImagePreviews((prevImages) =>
            prevImages.filter((_, i) => i !== index),
          );
          setFormData((prevData) => ({
            ...prevData,
            media: prevData.media.filter((_, i) => i !== index),
          }));

          Swal.fire("Deleted!", "Image has been deleted.", "success");
        } catch (err) {
          console.log("Error deleting image:", err);
          toast.error("Error deleting image");
        }
      }
    }
  };

  const router = useRouter();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const fileArray = Array.from(files);
      const oversizedFiles = fileArray.filter(
        (file) => file.size > 1024 * 1024,
      ); // 1 MB in bytes

      if (oversizedFiles.length > 0) {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          profile_image: "File size must be less than 1 MB",
        }));
      } else {
        setTooltipMessage(null);
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          profile_image: "",
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
          setImagePreviews((prevImages) => [...prevImages, ...base64Strings]);
          setFormData((prevData) => ({
            ...prevData,
            media: [...prevData.media, ...base64Strings],
          }));
        })
        .catch((error) => {
          console.error("Error converting files to base64:", error);
        });
    }
  };
  const handleFocus = () => {
    if (!tooltipMessage) {
      setTooltipMessage("Please upload an image smaller than 1 MB");
    }
  };

  const removeBase64Prefix = (base64String: string) => {
    const base64Prefix = "data:image/png;base64,";
    if (base64String.startsWith(base64Prefix)) {
      return base64String.substring(base64Prefix.length);
    }
    return base64String;
  };

  const validateForm = () => {
    let errors: any = {};

    if (!formData.name.trim()) {
      errors.name = "Activity name is required";
    }

    if (!formData.price) {
      errors.price = "Price is required";
    } else if (isNaN(Number(formData.price))) {
      errors.price = "Price must be a number";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleDateChange = (date: Date | null, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  useEffect(() => {
    const fetchActivity = async () => {
      if (activityId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/activities/${activityId}`,
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
            response.data.data.media &&
            Array.isArray(response.data.data.media)
          ) {
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
    if (!validateForm()) {
      toast.error("Please fill all the fields correctly");
      return;
    }
    setLoading(true);
    const processedFormData = {
      media: formData.media.map(removeBase64Prefix), // Process each base64 image
    };

    console.log(processedFormData);

    try {
      const response = await fetch("/api/activity/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: activityId, ...formData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update item");
      }

      toast.success("Activity updated successfully");
      setTimeout(() => {
        router.push("/activity");
      }, 1000);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("An error occurred");
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
                {errors.name && <span className="text-red">{errors.name}</span>}
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
                {errors.price && (
                  <span className="text-red">{errors.price}</span>
                )}
              </div>
            </div>
            <div className="mb-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-black">
                  Attach file
                </label>
                {tooltipMessage && (
                  <div className="mt-2 text-sm text-red">{tooltipMessage}</div>
                )}
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  onFocus={handleFocus}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                {errors.profile_image && (
                  <p className="mt-1 text-sm text-red">
                    {errors.profile_image}
                  </p>
                )}
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
                      src={
                        media.startsWith("data:")
                          ? media
                          : `${process.env.BE_URL}/${media}`
                      }
                      alt={`Preview ${index}`}
                      width={100}
                      height={100}
                      className="h-20 rounded object-cover"
                    />
                    {groupThree && (
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
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
              {errors.description && (
                <span className="text-red">{errors.description}</span>
              )}
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
