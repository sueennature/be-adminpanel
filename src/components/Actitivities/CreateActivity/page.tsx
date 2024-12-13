"use client";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import SelectGroupOne from "../../SelectGroup/SelectGroupOne";
import { toast } from "react-toastify";
import { useAuthRedirect } from "@/utils/checkToken";
import Cookies from "js-cookie"; //-

type PreviewFile = {
  url: string;
  type: string;
};
const CreateActivity = () => {
  const [formData, setFormData] = useState<any>({
    name: "",
    price: "",
    description: "",
    media: [],
  });
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = useState<any>({});
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null); //set tooltip
  useAuthRedirect();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const MAX_IMAGE_SIZE = 1024 * 1024; // 1 MB
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    const newPreviews: { url: string; type: string }[] = [];
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    filesArray.forEach((file) => {
      if (file.type.startsWith("image/")) {
        if (file.size > MAX_IMAGE_SIZE) {
          newErrors.push(`Image "${file.name}" exceeds 1 MB.`);
        } else {
          validFiles.push(file);
          newPreviews.push({ url: URL.createObjectURL(file), type: "image" });
        }
      } else if (file.type.startsWith("video/")) {
        if (file.size > MAX_VIDEO_SIZE) {
          newErrors.push(`Video "${file.name}" exceeds 50 MB.`);
        } else {
          validFiles.push(file);
          newPreviews.push({ url: URL.createObjectURL(file), type: "video" });
        }
      } else {
        newErrors.push(`Unsupported file type: "${file.name}".`);
      }
    });

    if (newErrors.length > 0) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        profile_image: newErrors.join(" "),
      }));
    } else {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        profile_image: "",
      }));
    }

    // Append new previews without overwriting existing ones
    setPreviewFiles((prevPreviews) => [...prevPreviews, ...newPreviews]);

    const base64Promises = validFiles.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(base64Promises)
      .then((base64Files) => {
        setFormData((prevData: { media: any }) => ({
          ...prevData,
          media: [...(prevData.media || []), ...base64Files],
        }));
      })
      .catch((error) => {
        console.error("Error converting files to base64:", error);
        toast.error("Error uploading files");
      });
  };

  const handleFocus = () => {
    if (!tooltipMessage) {
      setTooltipMessage(
        "Please upload images smaller than 1 MB and videos smaller than 50 MB.",
      );
    }
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
      media: formData.media,
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

  const handleDeleteFile = (fileToRemove: { url: string }) => {
    setPreviewFiles((prevFiles) =>
      prevFiles.filter((file) => file.url !== fileToRemove.url),
    );

    setFormData((prevFormData: { media: any[] }) => ({
      ...prevFormData,
      media: prevFormData.media?.filter(
        (file) => file.url !== fileToRemove.url,
      ),
    }));
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
              <label className="mb-3 block text-sm font-medium text-black">
                Attach files (images & videos)
              </label>
              {tooltipMessage && (
                <div className="mt-2 text-sm text-blue">{tooltipMessage}</div>
              )}
              <input
                type="file"
                multiple
                name="media"
                accept="image/png, image/jpeg, image/jpg, video/mp4"
                onChange={handleFileChange}
                onFocus={handleFocus}
                className="w-full cursor-pointer rounded-lg border border-stroke bg-transparent outline-none transition file:mr-5 file:border-none file:px-5 file:py-3 file:hover:bg-primary focus:border-primary"
              />
              {errors.profile_image && (
                <p className="mt-1 text-sm text-red">{errors.profile_image}</p>
              )}

              {/* Images Section */}
              <div className="mt-4">
                <h3 className="mb-2 text-lg font-medium text-black">Images</h3>
                <div className="flex flex-wrap gap-4">
                  {previewFiles
                    .filter((file) => file.type === "image")
                    .map((file) => (
                      <div key={file.url} className="relative w-32">
                        <img
                          src={file.url}
                          alt={`Image Preview`}
                          className="h-auto w-full rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(file)}
                          className="bg-red-500 absolute left-[110px] top-[-2px] rounded-full font-bold text-red"
                        >
                          X
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Videos Section */}
              <div className="mt-6">
                <h3 className="mb-2 text-lg font-medium text-black">Videos</h3>
                <div className="flex flex-wrap gap-4">
                  {previewFiles
                    .filter((file) => file.type === "video")
                    .map((file) => (
                      <div key={file.url} className="relative w-32">
                        <video
                          controls
                          src={file.url}
                          className="h-auto w-full rounded-lg"
                        ></video>
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(file)}
                          className="bg-red-500 absolute left-[110px] top-[-6px] z-10 rounded-full font-bold text-red"
                        >
                          X
                        </button>
                      </div>
                    ))}
                </div>
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
