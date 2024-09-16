"use client";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { useAuthRedirect } from "@/utils/checkToken";
import Cookie from "js-cookie";
import Select from "react-select";

const CreateCarousel = () => {
  useAuthRedirect();
  const [formData, setFormData] = useState<any>({
    title: "",
    tags: "",
    media_type: "",
    media_urls: [],
  });
  const [errors, setErrors] = useState<any>({
    title: "",
    media_type: "",
    media_urls: "",
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  //tag options for tag selecotor
  const tagOptions = [
    { value: "Gallery", label: "Gallery" },
    { value: "Carousel", label: "Carousel" },
    { value: "Home page", label: "Home page" },
  ];
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Validate the input as it's being changed
    validateField(name, value);
  };

  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null); //set tooltip

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const { media_type } = formData;

      let maxSize = 0;
      let fileType = "";

      // Determine max size based on media type
      if (formData.media_type === "image") {
        maxSize = 1024 * 1024; // 1 MB
        fileType = "Image";
      } else if (formData.media_type === "video") {
        maxSize = 2 * 1024 * 1024; // 2 MB
        fileType = "Video";
      }

      const oversizedFiles = filesArray.filter((file) => file.size > maxSize);

      // Handle oversized files
      if (oversizedFiles.length > 0) {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          media_urls: `${fileType} size must be smaller than ${formData.media_type === "image" ? "1 MB" : "2 MB"}`,
        }));
      } else {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          media_urls: "", // Clear the error if file sizes are valid
        }));

        // Clear tooltip message when a valid file is uploaded
        setTooltipMessage("");

        // Update form data with valid files
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          media_urls: filesArray, // Store the valid files
        }));
      }

      // Validate files based on selected media type
      const allowedExtensions =
        media_type === "image"
          ? ["image/png", "image/jpeg", "image/webp"]
          : media_type === "video"
            ? ["video/mp4"]
            : [];

      if (
        media_type &&
        !filesArray.every((file) => allowedExtensions.includes(file.type))
      ) {
        toast.error(
          `Please upload ${media_type === "image" ? "images" : "videos"} only.`,
        );
        return;
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
        .then((base64Files) => {
          setFormData({
            ...formData,
            media_urls: base64Files,
          });
        })
        .catch((error) => {
          console.error("Error converting files to base64:", error);
          toast.error("Error uploading files");
        });
    }
  };

  const removeBase64Prefix = (base64String: string) => {
    // Define prefixes for different image types
    const pngPrefix = "data:image/png;base64,";
    const jpegPrefix = "data:image/jpeg;base64,";
    const webpPrefix = "data:image/webp;base64,";
    const mp4Prefix = "data:video/mp4;base64,";

    if (base64String.startsWith(pngPrefix)) {
      return base64String.substring(pngPrefix.length);
    } else if (base64String.startsWith(jpegPrefix)) {
      return base64String.substring(jpegPrefix.length);
    } else if (base64String.startsWith(webpPrefix)) {
      return base64String.substring(webpPrefix.length);
    } else if (base64String.startsWith(mp4Prefix)) {
      return base64String.substring(mp4Prefix.length);
    }

    // If none of the prefixes match, return the original string
    return base64String;
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Validate the input as it's being changed
    validateField(name, value);
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      [name]: value,
      media_urls: [], // Clear media_urls when media_type changes
    }));

    // Declare maxSize and fileType based on the selected media type
    let maxSize = 0;
    let fileType = "";

    // Set the max size and file type based on the selected media type
    if (value === "image") {
      maxSize = 1024 * 1024; // 1 MB in bytes
      fileType = "Image";
      setTooltipMessage("Please upload an image smaller than 1 MB");
    } else if (value === "video") {
      maxSize = 2 * 1024 * 1024; // 2 MB in bytes
      fileType = "Video";
      setTooltipMessage("Please upload a video smaller than 2 MB");
    }

    // Store maxSize and fileType in state or handle validations directly in other places
    // setMaxSize(maxSize); // If you are storing maxSize in state

    // Optionally, you can trigger validation or a reset of error states here if needed
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      media_urls: "", // Clear previous errors when media_type changes
    }));
  };

  const handleTagChange = (selectedOptions: any) => {
    const tagsString = selectedOptions
      ? selectedOptions.map((option: { value: string }) => option.value).join(", ")
      : "";
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      tags: tagsString, // Convert tags to a comma-separated string
    }));
  };
  const selectedTags = formData.tags
    ? formData.tags.split(", ").map((tag: string) =>
        tagOptions.find((option :any) => option.value === tag)
      ).filter((option :any) => option) // Filter out any undefined options
    : [];

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "title":
        if (!value.trim()) {
          error = "Title for carousel is required";
        }
        break;
      case "media_type":
        if (!value.trim()) {
          error = "Media type is required";
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

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (errors.media_urls) {
      toast.error(errors.media_urls);
      return;
    }
    setLoading(true);
    const processedFormData = {
      ...formData,
      media_urls: formData.media_urls?.map(removeBase64Prefix),
    };

    try {
      const response = await fetch("/api/carousel/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        toast.error("Credentials Expired. Please Log in Again");
        Cookie.remove("access_token");
        setTimeout(() => {
          router.push("/");
        }, 1500);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create carousel:", errorData);
        toast.error("Failed to create carousel");
        return;
      }

      const responseData = await response.json();
      console.log("Success:", responseData);
      setLoading(false);
      toast.success("Carousel is created successfully");
      setTimeout(() => {
        router.push("/carousels");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      toast.error("Something went wrong!");
    }
  };

  return (
    <form className="flex flex-col gap-9" onSubmit={handleSubmit}>
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <div className="p-6.5">
          <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black">
                Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter the Title"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
              {errors.title && (
                <p className="text-sm text-red">{errors.title}</p>
              )}
            </div>
          </div>
          <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black">
                Tags
              </label>
              <Select
                isMulti
                name="tags"
                options={tagOptions}
                classNamePrefix="select"
                value={selectedTags} // Ensure 'tag' is typed as a string
                onChange={handleTagChange}
                placeholder="Select tags to categorize images"
                className="w-full rounded border-none bg-transparent text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    border: state.isFocused ? "1.5px solid #3c50e0" : "1.5px solid #E2e8f0", // Blue border on focus
                    borderRadius: "4px",
                    boxShadow: "none", // Remove shadow
                    transition: "border-color 0.2s ease", // Smooth transition for border color
                  }),
                  input: (provided) => ({
                    ...provided,
                    padding: "8px", // Increase padding inside the input container
                  }),
                }}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black">
              Media Type
            </label>
            <select
              name="media_type"
              value={formData.media_type}
              onChange={handleSelectChange}
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
            >
              <option value="">Select a media type</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            {errors.media_type && (
              <p className="text-sm text-red">{errors.media_type}</p>
            )}
          </div>
          <div className="mb-6">
            <div>
              <label className="mb-3 block text-sm font-medium text-black">
                Media
              </label>
              {tooltipMessage && (
                <div className="mt-2 text-sm text-red">{tooltipMessage}</div>
              )}
              <input
                type="file"
                multiple
                required
                name="media_urls"
                onChange={handleFileChange}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
              {errors.media_urls && (
                <p className="mt-1 text-sm text-red">{errors.media_urls}</p>
              )}
            </div>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateCarousel;
