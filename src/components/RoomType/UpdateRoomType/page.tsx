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
import DatePicker from "react-datepicker";

interface RoomType {
  category: string;
  primary_image: string[];
  room_images: string[];
  size: number;
  bed: number;
  occupancy: string;
  mountain: string[];
  lake: string[];
}
const UpdateRoomType = () => {
  const [formData, setFormData] = useState<RoomType>({
    category: "",
    primary_image: [],
    room_images: [],
    size: 0,
    bed: 0,
    occupancy: "",
    mountain: [],
    lake: [],
  });

  const searchParams = useSearchParams();
  let roomTypeID = searchParams.get("roomTypeID");
  const [primaryImagePreviews, setPrimaryImagePreviews] = useState<string[]>(
    [],
  );
  const [roomImagePreviews, setRoomImagePreviews] = useState<string[]>([]);
  const [mountainImagePreviews, setMountainImagePreviews] = useState<string[]>(
    [],
  );
  const [lakeImagePreviews, setLakeImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null); //set tooltip
  const [tooltipType, setTooltipType] = useState<
    "primary_image" | "room_images" | "mountain" | "lake" | null
  >(null);
  const { groupFour, groupThree } = useUserContext();

  const handleDeleteMedia = async (
    index: number,
    mediaType: "primary_image" | "room_images" | "mountain" | "lake",
  ) => {
    const mediaUrl = formData[mediaType]?.[index];

    if (!mediaUrl) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const payload = [mediaUrl];
      console.log("Payload:", JSON.stringify(payload));

      await axios.delete(
        `${process.env.BE_URL}/room_type/${roomTypeID}/media?media_type=${mediaType}`,
        {
          data: payload,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("access_token")}`,
            "x-api-key": process.env.X_API_KEY,
          },
        },
      );

      // Update the state to remove the deleted media
      setFormData((prevData) => ({
        ...prevData,
        [mediaType]: prevData[mediaType]?.filter((_, i) => i !== index) || [],
      }));

      Swal.fire(
        "Deleted!",
        `${mediaType.replace("_", " ")} has been deleted.`,
        "success",
      );
    } catch (err) {
      console.error(`Error deleting ${mediaType}:`, err);
      toast.error(`Error deleting ${mediaType.replace("_", " ")}`);
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
    field: "primary_image" | "room_images" | "mountain" | "lake",
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
    field: "primary_image" | "room_images" | "mountain" | "lake",
  ) => {
    setTooltipMessage("Please upload images smaller than 1 MB");
    setTooltipType(field);
  };

  useEffect(() => {
    const fetchRoomType = async () => {
      if (roomTypeID) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/room_type/${roomTypeID}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );

          setFormData(response.data.data);
          setPrimaryImagePreviews(response.data.data.primary_image);
          setRoomImagePreviews(response.data.data.room_images);
          setMountainImagePreviews(response.data.data.mountain);
          setLakeImagePreviews(response.data.data.lake);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchRoomType();
  }, [roomTypeID]);

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

    if (!formData.category.trim()) {
      errors.name = "Category title is required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const removeImageBase64Prefix = (base64String: string) => {
    const imagePrefixPattern = /^data:image\/(png|jpeg|jpg);base64,/;
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
      room_images: formData.room_images.map(removeImageBase64Prefix),
      mountain: formData.mountain.map(removeImageBase64Prefix),
      lake: formData.lake.map(removeImageBase64Prefix),
    };

    try {
      const response = await fetch("/api/roomType/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: roomTypeID, ...processedFormData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update item");
      }

      toast.success("Room Type updated successfully");
      setTimeout(() => {
        router.push("/roomType");
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

            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">
                Size
              </label>
              <textarea
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                placeholder="Enter the Size"
                rows={1}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
            </div>

            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">
                Bed
              </label>
              <textarea
                name="bed"
                value={formData.bed}
                onChange={handleInputChange}
                placeholder="Enter the Beds Count"
                rows={1}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
            </div>

            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">
                Occupancy
              </label>
              <textarea
                name="occupancy"
                value={formData.occupancy}
                onChange={handleInputChange}
                placeholder="Enter Occupancy"
                rows={1}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Attach Primary Images
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
                {primaryImagePreviews.map((image, index) => (
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
                        onClick={() =>
                          handleDeleteMedia(index, "primary_image")
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

            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Attach Room Images
              </label>
              {tooltipMessage && tooltipType === "room_images" && (
                <div className="mt-2 text-sm text-red">{tooltipMessage}</div>
              )}
              <input
                type="file"
                multiple
                name="room_images"
                onChange={(e) => handleFileChange(e, "room_images")}
                onFocus={() => handleFocus("room_images")}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
              {errors.room_images && (
                <p className="mt-1 text-sm text-red">{errors.room_images}</p>
              )}
            </div>
            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">
                Image Preview
              </label>
              <div className="flex items-center gap-4">
                {roomImagePreviews.map((image, index) => (
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
                        onClick={() => handleDeleteMedia(index, "room_images")}
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
                Attach Mountain Images
              </label>
              {tooltipMessage && tooltipType === "mountain" && (
                <div className="mt-2 text-sm text-red">{tooltipMessage}</div>
              )}
              <input
                type="file"
                multiple
                name="mountain"
                onChange={(e) => handleFileChange(e, "mountain")}
                onFocus={() => handleFocus("mountain")}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
              {errors.mountain && (
                <p className="mt-1 text-sm text-red">{errors.mountain}</p>
              )}
            </div>
            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">
                Image Preview
              </label>
              <div className="flex items-center gap-4">
                {mountainImagePreviews.map((image, index) => (
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
                        onClick={() => handleDeleteMedia(index, "mountain")}
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
                Attach Lake Images
              </label>
              {tooltipMessage && tooltipType === "lake" && (
                <div className="mt-2 text-sm text-red">{tooltipMessage}</div>
              )}
              <input
                type="file"
                multiple
                name="lake"
                onChange={(e) => handleFileChange(e, "lake")}
                onFocus={() => handleFocus("lake")}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
              {errors.lake && (
                <p className="mt-1 text-sm text-red">{errors.lake}</p>
              )}
            </div>
            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">
                Image Preview
              </label>
              <div className="flex items-center gap-4">
                {lakeImagePreviews.map((image, index) => (
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
                        onClick={() => handleDeleteMedia(index, "lake")}
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

export default UpdateRoomType;
