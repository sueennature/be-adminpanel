"use client";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import flatpickr from "flatpickr";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/utils/checkToken";
import Cookies from "js-cookie";

interface RoomType {
  category: string;
  primary_image: string[];
}
const CreateRoomHome = () => {
  useAuthRedirect();
  const [formData, setFormData] = useState<RoomType>({
    category: "",
    primary_image: [],
  });
  const [errors, setErrors] = useState<any>({
    category: "",
    primary_image: [],
  });
  const [loading, setLoading] = useState(false); // Add a loading state
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);
  const [tooltipType, setTooltipType] = useState<
    "primary_image" | null
  >(null);

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: "primary_image",
  ) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const maxSize = 1024 * 1024; // 1 MB size limit for images
      const oversizedFiles = fileArray.filter((file) => file.size > maxSize);

      if (oversizedFiles.length > 0) {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          [field]: `File size must be less than 1 MB`,
        }));
        return; // Exit early if there are oversized files
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
    field: "primary_image" ,
  ) => {
    setTooltipMessage("Please upload images smaller than 1 MB");
    setTooltipType(field);
  };

  const removeImageBase64Prefix = (base64String: string) => {
    const imagePrefixPattern = /^data:image\/(png|jpeg|jpg);base64,/;
    return base64String.replace(imagePrefixPattern, "");
  };

  // form validation fields
  const validateField = (name: string, value: string | Date | null) => {
    let error = "";

    switch (name) {
      case "category":
        if (typeof value === "string" && !value.trim()) {
          error = "Category is required";
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

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const processedFormData = {
      ...formData,
      primary_image: formData.primary_image.map(removeImageBase64Prefix),
    };

    console.log(processedFormData);

    setLoading(true);

    try {
      const response = await fetch("/api/roomHome/create", {
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
          `Failed to create room home: ${errorData.error || "Unknown error"}`,
        );
        return;
      }

      const data = await response.json();
      toast.success("Room Home is created successfully");
      setFormData({
        category: "",
        primary_image: [],
      });
      setTimeout(() => {
        router.push("/roomHome");
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
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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

export default CreateRoomHome;
