"use client";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import flatpickr from "flatpickr";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/utils/checkToken";
import Cookies from "js-cookie";

const CreateOffer = () => {
  useAuthRedirect();
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    description: "",
    images: []
  });
  const [errors, setErrors] = useState<any>({
    name: "",
    start_date: "",
    end_date: "",
    description: "",
    images: []
  });
  const [loading, setLoading] = useState(false); // Add a loading state
  const startDate = useRef<flatpickr.Instance | null>(null);
  const endDate = useRef<flatpickr.Instance | null>(null);
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);
  const [tooltipType, setTooltipType] = useState<"images" | "videos" | null>(
    null,
  );

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

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "images" | "videos",
  ) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      // Set file size limits: 1 MB for images, 2 MB for videos
      const maxSize = type === "images" ? 1024 * 1024 : 2 * 1024 * 1024;
      const oversizedFiles = fileArray.filter((file) => file.size > maxSize);

      if (oversizedFiles.length > 0) {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          [type]: `File size must be less than ${type === "images" ? "1 MB" : "2 MB"} for ${type}`,
        }));
      } else {
        setTooltipMessage(null);
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          [type]: "",
        }));
      }

      if (files.length > 0) {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          media: "", // Clear the media error
        }));
      }
      const filePromises = Array.from(files).map((file) => {
        // Clear media error immediately after file selection

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
            [type]: base64Files,
          }));
        })
        .catch((error) => console.error("Error converting files:", error));
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

  const removeImageBase64Prefix = (base64String: string) => {
    const imagePrefixPattern = /^data:image\/(png|jpeg|jpg);base64,/;
    return base64String.replace(imagePrefixPattern, "");
  };

  // form validation fields
  const validateField = (name: string, value: string | Date | null) => {
    let error = "";

    switch (name) {
      case "name":
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Validate the input as it's being changed
    validateField(name, value);
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check for any errors
    // if (Object.values(errors).some((error) => error)) {
    //   return; // Prevent form submission if there are validation errors
    // }

    const processedFormData = {
      start_date: formData.start_date,
      end_date: formData.end_date,
      description: formData.description,
      title: formData.name,
      offer_image: formData.images.map(removeImageBase64Prefix),
    };

    console.log(processedFormData);

    setLoading(true); 

    try {
      const response = await fetch("/api/offer/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedFormData),
      });
      if (response.status === 401) {
        toast.error("Credentials Expired. Please Log in Again");
        Cookies.remove("access_token");
        setTimeout(() => {
          router.push("/");
        }, 1500);
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(
          `Failed to create offer: ${errorData.error || "Unknown error"}`,
        );
        return;
      }

      const data = await response.json();
      toast.success("Offer is created successfully");
      setFormData({
        name: "",
        start_date: "",
        end_date: "",
        description: "",
        images: []
      });
      setTimeout(() => {
        router.push("/offer");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while creating the offer");
    } finally {
      setLoading(false);
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
                  Title
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                {errors.name && (
                  <p className="text-sm text-red">{errors.name}</p>
                )}
              </div>
            </div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black">
                  Select Start Date
                </label>
                <div className="relative">
                  <input
                    id="start_date"
                    name="start_date"
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                    placeholder="mm/dd/yyyy"
                    onChange={handleChange}
                    data-class="flatpickr-right"
                  />
                  {errors.start_date && (
                    <p className="text-sm text-red">{errors.start_date}</p>
                  )}
                  <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.0002 12.8249C8.83145 12.8249 8.69082 12.7687 8.5502 12.6562L2.08145 6.2999C1.82832 6.04678 1.82832 5.65303 2.08145 5.3999C2.33457 5.14678 2.72832 5.14678 2.98145 5.3999L9.0002 11.278L15.0189 5.34365C15.2721 5.09053 15.6658 5.09053 15.9189 5.34365C16.1721 5.59678 16.1721 5.99053 15.9189 6.24365L9.45019 12.5999C9.30957 12.7405 9.16895 12.8249 9.0002 12.8249Z"
                        fill="#64748B"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black">
                  Select End Date
                </label>
                <div className="relative">
                  <input
                    id="end_date"
                    name="end_date"
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                    placeholder="mm/dd/yyyy"
                    onChange={handleChange}
                    data-class="flatpickr-right"
                  />
                  {errors.end_date && (
                    <p className="text-sm text-red">{errors.end_date}</p>
                  )}
                  <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.0002 12.8249C8.83145 12.8249 8.69082 12.7687 8.5502 12.6562L2.08145 6.2999C1.82832 6.04678 1.82832 5.65303 2.08145 5.3999C2.33457 5.14678 2.72832 5.14678 2.98145 5.3999L9.0002 11.278L15.0189 5.34365C15.2721 5.09053 15.6658 5.09053 15.9189 5.34365C16.1721 5.59678 16.1721 5.99053 15.9189 6.24365L9.45019 12.5999C9.30957 12.7405 9.16895 12.8249 9.0002 12.8249Z"
                        fill="#64748B"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter the Description"
                rows={3}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
            </div>
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Attach Images
              </label>
              {tooltipMessage && tooltipType === "images" && (
                <div className="mt-2 text-sm text-red">{tooltipMessage}</div>
              )}
              <input
                type="file"
                multiple
                onChange={(e) => handleFileChange(e, "images")}
                onFocus={() => handleFocus("images")}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
              {errors.images && (
                <p className="mt-1 text-sm text-red">{errors.images}</p>
              )}
            </div>
          </div>
          <div className="bg-light-100 flex items-center justify-end border-t border-stroke p-6.5">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 items-center justify-center rounded bg-primary px-6 text-base font-medium text-white transition hover:bg-opacity-90"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOffer;
