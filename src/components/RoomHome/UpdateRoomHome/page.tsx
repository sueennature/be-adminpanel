"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import flatpickr from "flatpickr";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Image from "next/image";
import Swal from "sweetalert2";
import { useUserContext } from "@/hooks/useUserContext";

interface RoomType {
  category: string;
  primary_image: string[];
}
const UpdateRoomHome = () => {
  const [formData, setFormData] = useState<RoomType>({
    category: "",
    primary_image: [],
  });

  const searchParams = useSearchParams();
  let roomHomeID = searchParams.get("roomHomeID");
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null); //set tooltip
  const [tooltipType, setTooltipType] = useState<
    "primary_image" | null
  >(null);
  const { groupFour, groupThree } = useUserContext();

      const fileInputRef = useRef<any>(null);

const handleDeleteImage = async (index: number) => {
  console.log("formData:", formData);
  console.log("formData.primary_image:", formData?.primary_image);
  console.log("index:", index);

  if (!Array.isArray(formData.primary_image)) {
    console.error("formData.primary_image is not an array or is undefined.");
    return;
  }

  if (index < 0 || index >= formData.primary_image.length) {
    console.error("Invalid index:", index);
    return;
  }

  const imageUrl = formData.primary_image[index];
  if (!imageUrl) {
    console.error(`Image URL at index ${index} is undefined.`);
    return;
  }

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
    try {
      await axios.delete(`${process.env.BE_URL}/room_home/${roomHomeID}/images`, {
        data: { files_to_delete: [imageUrl] },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("access_token")}`,
          "x-api-key": process.env.X_API_KEY,
        },
      });

      // Update state
      setImagePreviews((prevImages) =>
        prevImages.filter((_, i) => i !== index),
      );
      setFormData((prevData) => ({
        ...prevData,
        primary_image: prevData.primary_image.filter((_, i) => i !== index),
      }));

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      Swal.fire("Deleted!", "Your primary_image has been deleted.", "success");
    } catch (err) {
      console.error("Error deleting primary_image:", err);
      toast.error("Error deleting primary_image");
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

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: "primary_image",
  ) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const maxSize = 1024 * 1024;
      const oversizedFiles = fileArray.filter((file) => file.size > maxSize);

      if (oversizedFiles.length > 0) {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          [field]: `File size must be less than 1 MB`,
        }));
        return;
      }

      setTooltipMessage(null);
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        [field]: "",
      }));

      const filePromises = fileArray.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      });

      Promise.all(filePromises)
        .then((base64Files) => {
          setFormData((prevState) => ({
            ...prevState,
            [field]: base64Files,
          }));
        })
        .catch((error) => console.error("Error converting files:", error));
    }
  };

  const handleFocus = (
    field: "primary_image",
  ) => {
    setTooltipMessage("Please upload images smaller than 1 MB");
    setTooltipType(field);
  };

  useEffect(() => {
    const fetchRoomHome = async () => {
      if (roomHomeID) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/room_home/${roomHomeID}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );

          setFormData(response.data.data);
          setImagePreviews(response.data.data.primary_image);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchRoomHome();
  }, [roomHomeID]);

  const removeBase64Prefix = (base64String: string) => {
    // Find the prefix pattern for images and videos
    const imagePrefixPattern = /^data:primary_image\/(png|jpeg|jpg);base64,/;
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

    if (!formData.category.trim()) {
      errors.name = "Category title is required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const removeImageBase64Prefix = (base64String: string) => {
    const imagePrefixPattern = /^data:primary_image\/(png|jpeg|jpg);base64,/;
    return base64String.replace(imagePrefixPattern, "");
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
      primary_image: formData.primary_image.map(removeImageBase64Prefix),
    };

    try {
      const response = await fetch("/api/roomHome/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: roomHomeID, ...processedFormData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update item");
      }

      toast.success("Room Home updated successfully");
      setTimeout(() => {
        router.push("/roomHome");
      }, 1000);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter the Category"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                {errors.category && (
                  <p className="text-sm text-red">{errors.category}</p>
                )}
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Attach Primary Image
              </label>
              {tooltipMessage && tooltipType === "primary_image" && (
                <div className="mt-2 text-sm text-red">{tooltipMessage}</div>
              )}
              <input
                type="file"
                name="primary_image"
                multiple
                onChange={(e) => handleFileChange(e, "primary_image")}
                onFocus={() => handleFocus("primary_image")}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
              {errors.primary_image && (
                <p className="mt-1 text-sm text-red">{errors.primary_image}</p>
              )}
            </div>
            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">
                Image Preview
              </label>
              <div className="flex items-center gap-4">
                {imagePreviews.map((primary_image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={
                        primary_image.startsWith("data:")
                          ? primary_image
                          : `${process.env.BE_URL}/${primary_image}`
                      }
                      alt={`Preview ${index}`}
                      width={100}
                      height={100}
                      className="h-20 rounded object-cover"
                    />
                    {groupThree && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteImage(index)
                        }
                        className="bg-red-500 relative left-[80px] top-[-80px] rounded-full font-bold text-red"
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}
              </div>
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

export default UpdateRoomHome;
