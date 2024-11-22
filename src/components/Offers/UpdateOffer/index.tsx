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

interface OfferData {
  title: string;
  start_date: Date;
  end_date: Date;
  description: string;
  images: string[];
}

const UpdateOffer = () => {
  const [formData, setFormData] = useState<OfferData>({
    title: "",
    start_date: new Date(),
    end_date: new Date(),
    description: "",
    images: [],
  });

  const searchParams = useSearchParams();
  let offerId = searchParams.get("offerID");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null); //set tooltip
  const [tooltipType, setTooltipType] = useState<"images" | "videos" | null>(
    null,
  );
  const startDate = useRef<flatpickr.Instance | null>(null);
  const endDate = useRef<flatpickr.Instance | null>(null);
  const { groupFour, groupThree } = useUserContext();

  useEffect(() => {
    flatpickr("#start_date", {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      prevArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg className="fill-current" width="7" height="11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      // onChange: (selectedDates) => {
      //   const dateStr = selectedDates[0].toISOString();
      //   setFormData((prevData) => ({
      //     ...prevData,
      //     start_date: dateStr,
      //   }));
      // },
      onChange: (selectedDates) => {
        handleDateChange(selectedDates[0], "start_date");
      },
    });

    flatpickr("#end_date", {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      prevArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg className="fill-current" width="7" height="11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      // onChange: (selectedDates) => {
      //   const dateStr = selectedDates[0].toISOString();
      //   setFormData((prevData) => ({
      //     ...prevData,
      //     end_date: dateStr,
      //   }));
      // },
      onChange: (selectedDates) => {
        handleDateChange(selectedDates[0], "end_date");
      },
    });

    // Cleanup flatpickr instances on unmount
    return () => {
      if (startDate.current) {
        startDate.current.destroy();
      }
      if (endDate.current) {
        endDate.current.destroy();
      }
    };
  }, []);

  const handleDateChange = (date: Date | null, field: string) => {
    if (date) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: date.toISOString(),
      }));
      validateField(field, date.toISOString());
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [field]: "",
      }));
      validateField(field, null);
    }
  };

  const validateField = (name: string, value: string | Date | null) => {
    let error = "";

    switch (name) {
      case "title":
        if (typeof value === "string" && !value.trim()) {
          error = "Title is required";
        }
        break;

      case "start_date":
        if (!value || (value instanceof Date && isNaN(value.getTime()))) {
          error = "Start Date is required";
        }
        break;

      case "end_date":
        if (!value || (value instanceof Date && isNaN(value.getTime()))) {
          error = "End Date is required";
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Validate the input as it's being changed
    validateField(name, value);
  };

  const handleDeleteMedia = async (
    index: number,
    mediaType: "image" | "video",
  ) => {
    const mediaUrl = mediaType === "image" && formData.images[index];
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

      const payload = [mediaUrl];
      console.log("Payload:", JSON.stringify(payload));
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${process.env.BE_URL}/offer/${offerId}/media?media_type=${mediaType}`,
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
            setFormData((prevData) => ({
              ...prevData,
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
      if (offerId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/offers/${offerId}`,
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
            response.data.data.offer_image &&
            Array.isArray(response.data.data.offer_image)
          ) {
            setImagePreviews(response.data.data.offer_image);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchNews();
  }, [offerId]);

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
      errors.name = "Offer title is required";
    }

    if (!formData.description.trim()) {
      errors.content = "Description is required";
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
      start_date: formData.start_date,
      end_date: formData.end_date,
      description: formData.description,
      title: formData.title,
      offer_image: formData.images?.map(removeImageBase64Prefix),
    };

    try {
      const response = await fetch("/api/offer/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: offerId, ...processedFormData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update item");
      }

      toast.success("Offer updated successfully");
      setTimeout(() => {
        router.push("/offer");
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
                          : `https://api.sueennature.com/${image}`
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

            <div className="mb-6.5 flex w-full gap-6">
              <div className="w-full">
                <label className="mb-3 block text-sm font-medium text-black">
                  Select Start Date
                </label>
                <div className="customDatePickerWidth">
                  <DatePicker
                    selected={formData.start_date}
                    onChange={(date: Date | null) =>
                      handleDateChange(date, "start_date")
                    }
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                    placeholderText="mm/dd/yyyy"
                  />
                </div>
                {errors.start_date && (
                  <p className="text-sm text-red">{errors.start_date}</p>
                )}
              </div>
              <div className="w-full">
                <label className="mb-3 block text-sm font-medium text-black">
                  Select End Date
                </label>
                <div className="customDatePickerWidth">
                  <DatePicker
                    selected={formData.end_date}
                    onChange={(date: Date | null) =>
                      handleDateChange(date, "end_date")
                    }
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                    placeholderText="mm/dd/yyyy"
                  />
                </div>
                {errors.end_date && (
                  <p className="text-sm text-red">{errors.end_date}</p>
                )}
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
                placeholder="Type Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              ></textarea>
              {errors.description && (
                <p className="text-red">{errors.description}</p>
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

export default UpdateOffer;
