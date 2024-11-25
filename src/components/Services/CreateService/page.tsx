"use client";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import flatpickr from "flatpickr";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/utils/checkToken";
import Cookies from "js-cookie";
import { features } from "process";

const CreateService = () => {
  useAuthRedirect();
  const [formData, setFormData] = useState<{
    title: string;
    sub_title: string;
    description: string;
    images: string[];
    features: string[];
    details: { title: string; content: string }[];
  }>({
    title: "",
    sub_title: "",
    description: "",
    images: [],
    features: [],
    details: [{ title: "", content: "" }],
  });

  const [errors, setErrors] = useState<any>({
    title: "",
    sub_title: "",
    description: "",
    images: [],
    features: [],
    details: [
      {
        title: "",
        content: "",
      },
    ],
  });
  const [loading, setLoading] = useState(false); // Add a loading state
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);
  const [tooltipType, setTooltipType] = useState<"images" | "videos" | null>(
    null,
  );

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
      case "title":
        if (typeof value === "string" && !value.trim()) {
          error = "Title is required";
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
      ...formData,
      image: formData.images.map(removeImageBase64Prefix),
    };

    console.log(processedFormData);

    setLoading(true);

    try {
      const response = await fetch("/api/service/create", {
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
          `Failed to create service: ${errorData.error || "Unknown error"}`,
        );
        return;
      }

      const data = await response.json();
      toast.success("Service is created successfully");
      setFormData({
        title: "",
        sub_title: "",
        description: "",
        images: [],
        features: [],
        details: [
          {
            title: "",
            content: "",
          },
        ],
      });
      setTimeout(() => {
        router.push("/service");
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
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Title"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                {errors.title && (
                  <p className="text-sm text-red">{errors.title}</p>
                )}
              </div>
            </div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Subtitle
                </label>
                <input
                  type="text"
                  name="sub_title"
                  value={formData.sub_title}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Subtitle"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                {errors.sub_title && (
                  <p className="text-sm text-red">{errors.sub_title}</p>
                )}
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
          <div className="mb-6.5 ml-6">
            <label className="mb-3 block text-sm font-medium text-black">
              Features
            </label>
            {formData.features.map((feature, index) => (
              <input
                key={index}
                type="text"
                value={feature}
                onChange={(e) =>
                  setFormData((prev) => {
                    const updatedFeatures = [...prev.features];
                    updatedFeatures[index] = e.target.value;
                    return { ...prev, features: updatedFeatures };
                  })
                }
                placeholder={`Feature ${index + 1}`}
                className="mb-2 w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary"
              />
            ))}
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  features: [...prev.features, ""],
                }))
              }
              className="hover:bg-primary-dark mt-2 rounded bg-primary px-4 py-2 text-white"
            >
              Add Feature
            </button>
          </div>

          <div className="mb-6.5 ml-6">
            <label className="mb-3 block text-sm font-medium text-black">
              Details
            </label>
            {formData.details.map((detail, index) => (
              <div key={index} className="mb-4">
                <input
                  type="text"
                  value={detail.title}
                  onChange={(e) =>
                    setFormData((prev) => {
                      const updatedDetails = [...prev.details];
                      updatedDetails[index].title = e.target.value;
                      return { ...prev, details: updatedDetails };
                    })
                  }
                  placeholder={`Title ${index + 1}`}
                  className="mb-2 w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary"
                />
                <textarea
                  rows={3}
                  value={detail.content}
                  onChange={(e) =>
                    setFormData((prev) => {
                      const updatedDetails = [...prev.details];
                      updatedDetails[index].content = e.target.value;
                      return { ...prev, details: updatedDetails };
                    })
                  }
                  placeholder={`Content ${index + 1}`}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  details: [...prev.details, { title: "", content: "" }],
                }))
              }
              className="hover:bg-primary-dark mt-2 rounded bg-primary px-4 py-2 text-white"
            >
              Add Detail
            </button>
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

export default CreateService;
