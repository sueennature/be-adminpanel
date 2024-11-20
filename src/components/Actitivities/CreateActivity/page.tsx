"use client";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import SelectGroupOne from "../../SelectGroup/SelectGroupOne";
import { toast } from "react-toastify";
import { useAuthRedirect } from "@/utils/checkToken";
import Cookies from "js-cookie";//-

const CreateActivity = ( ) => {
  const [formData, setFormData] = useState<any>({
    name: "",
    price: "",
    description: "",
    media: [],
  });
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = useState<any>({});
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null); //set tooltip
  useAuthRedirect();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // Clear media error immediately after file selection

      const oversizedFiles = filesArray.filter(
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

        if (filesArray.length > 0) {
          setErrors((prevErrors: any) => ({
            ...prevErrors,
            media: "", // Clear the media error
          }));
        }
        const base64Promises = filesArray.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
          });
        });

        Promise.all(base64Promises)
          .then((base64Images) => {
            setFormData({
              ...formData,
              media: base64Images,
            });
          })
          .catch((error) => {
            console.error("Error converting images to base64:", error);
            toast.error("Error uploading images");
          });
      }
    }
  };
  const handleFocus = () => {
    if (!tooltipMessage) {
      setTooltipMessage("Please upload an image smaller than 1 MB");
    }
  };
  // Log the original base64 images
  const removeBase64Prefix = (base64String: string) => {
    // Find the comma that separates the metadata from the base64 data
    const base64PrefixPattern = /^data:image\/(png|jpeg|jpg);base64,/;
    return base64String.replace(base64PrefixPattern, "");
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

    if (formData.media.length === 0) {
      errors.media = "At least one file is required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill these input fields correctly");
      return;
    }
    setLoading(true);
    // Process the base64 images in formData
    const processedFormData = {
      ...formData,
      media: formData.media?.map(removeBase64Prefix), // Process each base64 image
    };

    console.log(processedFormData);

    if (
      !formData.name ||
      !formData.price ||
      !formData.description ||
      formData.media.length === 0
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("/api/activity/createActivity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create activity:", errorData);
        toast.error("Failed to create activity");
        return;
      }
      if (response.status === 401) {
        toast.error("Credentials Expired. Please Log in Again");
        Cookies.remove("access_token");
        setTimeout(() => {
          router.push("/");
        }, 1500);
        return;
      }
      const responseData = await response.json();
      setLoading(false);
      console.log("Success:", responseData);
      toast.success("Activity created successfully");
      setTimeout(() => {
        router.push("/activity");
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default">
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
                {errors.name && <p className="text-red">{errors.name}</p>}
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
                {errors.price && <p className="text-red">{errors.price}</p>}
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
                  name="media"
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
                <p className="text-red">{errors.description}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateActivity;
