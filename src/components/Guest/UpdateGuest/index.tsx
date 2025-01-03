"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthRedirect } from "@/utils/checkToken";
import Swal from 'sweetalert2';

interface FormData {
    first_name: string;
    last_name: string;
    email: string;
    telephone: string;
    address: string;
    nationality: string;
    identification_type: string;
    identification_no: string;
    identification_issue_date: Date;
    dob: Date;
    gender: string;
    password: string;
    profile_image: string[]; // Explicitly set as an array of strings
  }

const UpdateGuest = () => {
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    telephone: "",
    address: "",
    nationality: "",
    identification_type: "",
    identification_no: "",
    identification_issue_date: new Date(),
    dob: new Date(),
    gender: "",
    password: "",
    profile_image: [],
});

type ErrorsType = {
  [key: string]: string;
};
const [errors, setErrors] = useState<any>({
  first_name: "",
  last_name: "",
  email: "",
  telephone: "",
  address: "",
  nationality: "",
  identification_type: "",
  identification_no: "",
  identification_issue_date: "",
  dob: "",
  gender: "",
  password: "",
  profile_image: "",
});
  
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);  //set tooltip
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useAuthRedirect()
  const router = useRouter();
  const searchParams = useSearchParams();
  let guestId = searchParams.get("guestID");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleDeleteImage = async (index: number) => {
    const imageUrl = formData.profile_image[index];
    if (imageUrl) {
      const result = await Swal.fire({
          title: 'Are you sure?',
          text: 'This action cannot be undone!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
          console.log("IMAGEURL", imageUrl);
          try {
            const reponse = await axios.delete(`${process.env.BE_URL}/guests/${guestId}/images`, {
              data: [imageUrl] ,
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${Cookies.get('access_token')}`,
                  'x-api-key': process.env.X_API_KEY,
              },
          });
          console.log("ASD",reponse)
          setImagePreviews(prevImages => prevImages.filter((_, i) => i !== index));
          setFormData(prevData => ({
              ...prevData,
              profile_image: prevData.profile_image.filter((_, i) => i !== index),
          }));

              Swal.fire(
                  'Deleted!',
                  'Image has been deleted.',
                  'success'
              );
          } catch (err) {
              console.log('Error deleting image:', err);
              toast.error('Error deleting image, Please Login and try again');
          }
      }
  }
    
  };

  useEffect(() => {
    const fetchActivity = async () => {
      if (guestId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/guests/guest/${guestId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );
          console.log(response.data);
          const id_date = new Date(response.data.identification_issue_date);
          const dob = new Date(response.data.dob);
          setFormData({
            ...response.data,
            id_date,
            dob,
          });
          if (
            response.data.profile_image &&
            Array.isArray(response.data.profile_image)
          ) {
            setImagePreviews(response.data.profile_image);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchActivity();
  }, [guestId]);
  
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Validate the input as it's being changed
    validateField(name, value);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const oversizedFiles = filesArray.filter(file => file.size > 1024 * 1024); // 1 MB in bytes

      if (oversizedFiles.length > 0) {
        
        setErrors((prevErrors :any) => ({
            ...prevErrors,
            profile_image: 'File size must be less than 1 MB',
        }));
    } else {
      setTooltipMessage(null);
        setErrors((prevErrors :any) => ({
            ...prevErrors,
            profile_image: '',
        }));

      const base64Promises = filesArray.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      });
  
      Promise.all(base64Promises)
      .then(base64Images => {
        setFormData(prevData => ({
          ...prevData,
          profile_image: base64Images 
        }));
      })
      .catch(error => {
        console.error("Error converting images to base64:", error);
        toast.error("Error uploading images");
      });
    }
  };
};
  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
        case 'first_name':
            if (!value.trim()) {
                error = 'First name is required';
            }
            break;

        case 'last_name':
            if (!value.trim()) {
                error = 'Last name is required';
            }
            break;
        case 'nationality':
              if (!value.trim()) {
                  error = 'Nationality is required';
              }
              break;    

        case 'email':
            if (!value.trim()) {
                error = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                error = 'Email is invalid';
            }
            break;

        case 'telephone':
            if (!value.trim()) {
                error = 'Telephone is required';
            } else if (!/^\d+$/.test(value)) {
                error = 'Telephone must contain only numbers';
            } else if (value.length !== 10) {
                error = 'Telephone must be exactly 10 digits';
            }
            break;

        case 'identification_no':
            const identificationNoPattern = /^\d{9}[A-Za-z]?$/;
            if (value && !identificationNoPattern.test(value)) {
                error = 'Invalid identification number. Must be 9 digits followed by an optional single letter';
            }
            break;

        case 'password':
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if (value && !passwordPattern.test(value)) {
                error = 'Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, and 1 number';
            }
            break;

        // Add additional validation cases as needed

        default:
            break;
    }

    setErrors((prevErrors: any) => ({
        ...prevErrors,
        [name]: error,
    }));
};

const handleFocus = () => {
  if (!tooltipMessage) {
    setTooltipMessage('Please upload an image smaller than 1 MB');
  }
};
  const removeBase64Prefix = (base64String: string) => {
    // Find the comma that separates the metadata from the base64 data
    const base64Prefix = 'data:image/png;base64,';
    if (base64String.startsWith(base64Prefix)) {
      return base64String.substring(base64Prefix.length);
    }
    return base64String;
  };
  const handleDateChange = (date: Date | null, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("HELLO")
    e.preventDefault();
    // Validate all fields including password
    if (!formData.password?.trim()) {
      setErrors((prevErrors:any) => ({
          ...prevErrors,
          password: 'Password is required',
      }));
      return; // Prevent form submission if password is empty
  }

  // Submit the form if all fields are valid
  if (Object.values(errors).every(error => error === '')) {
      setLoading(true);

      // Proceed with form submission logic here

      setLoading(false);
  }
    setLoading(true);

    const formattedStartDate = format(
      formData.identification_issue_date,
      "yyyy-MM-dd'T'HH:mm:ss",
    );
    const formattedEndDate = format(formData.dob, "yyyy-MM-dd'T'HH:mm:ss");

    const dataToSubmit = {
      ...formData,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    };
    const processedFormData = {
        ...dataToSubmit,
        profile_image: formData.profile_image.map(removeBase64Prefix) // Process each base64 image
      };
      
    
      console.log(processedFormData);
    
    try {
      const response = await fetch("/api/guest/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: guestId, ...formData }),
      });

      const result = await response.json();
      if(response.status === 401){
        toast.error("Credentials Expired. Please Log in Again")
        Cookies.remove('access_token');
        setTimeout(()=>{
          router.push('/')
        },1500)
        return;
      }
      if (!response.ok) {
        throw new Error(result.error || "Failed to update item");
      }

      setLoading(false);
      toast.success("Guest is updated successfully");
      setTimeout(() => {
        router.push("/guest");
      }, 1500);
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error("An error occurred");
    }
    console.log("Form Data:", dataToSubmit);
  };

  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter the First Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                {errors.first_name && <p className="text-red text-sm">{errors.first_name}</p>}
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Last Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                {errors.last_name && <p className="text-red text-sm">{errors.last_name}</p>}
              </div>
            </div>

            <div className="mb-6.5 flex w-full gap-6">
              <div className="w-full">
                <label className="mb-3 block text-sm font-medium text-black">
                  Select Start Date
                </label>
                <div className="customDatePickerWidth">
                  <DatePicker
                    selected={formData.dob}
                    onChange={(date) => handleDateChange(date, "dob")}
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                    placeholderText="mm/dd/yyyy"
                  />
                  {errors.dob && <p className="text-red text-sm">{errors.dob}</p>}
                </div>
              </div>
              <div className="w-full">
                <label className="mb-3 block text-sm font-medium text-black">
                  Select End Date
                </label>
                <div className="customDatePickerWidth">
                  <DatePicker
                    selected={formData.identification_issue_date}
                    onChange={(date) =>
                      handleDateChange(date, "identification_issue_date")
                    }
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                    placeholderText="mm/dd/yyyy"
                  />
                </div>
              </div>
            </div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter the email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                {errors.email && <p className="text-red text-sm">{errors.email}</p>}
              </div>

              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Nationality
                </label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option value="">Select a nationality</option>
                  <option value="foreign">Foreign</option>
                  <option value="local">Local</option>
                </select>
                {errors.nationality && <p className="text-red text-sm">{errors.nationality}</p>}
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Telephone
                </label>
                <input
                  type="number"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Telephone"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                {errors.telephone && <p className="text-red text-sm">{errors.telephone}</p>}
              </div>
            </div>

            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option value="">Select a gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-red text-sm">{errors.gender}</p>}
              </div>

              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Identification Type
                </label>
                <select
                  name="identification_type"
                  value={formData.identification_type}
                  onChange={handleChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option value="">Select a identification type</option>
                  <option value="Private">Private</option>
                  <option value="government">Government</option>
                  <option value="other">Other</option>
                </select>
                {errors.identification_type && <p className="text-red text-sm">{errors.identification_type}</p>}
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Identification No
                </label>
                <input
                  type="text"
                  name="identification_no"
                  value={formData.identification_no}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Identification No"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                {errors.identification_no && <p className="text-red text-sm">{errors.identification_no}</p>}
              </div>
            </div>

            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Address"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black">
                  Password
                </label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter the password"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                {errors.password && <p className="text-red text-sm">{errors.password}</p>}
              </div>
            </div>

            <div className="mb-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-black">
                  Profile Image
                </label>
                {tooltipMessage && (
        <div className="mt-2 text-sm text-red">
            {tooltipMessage}
        </div>
    )}
                <input
                  type="file"
                  name="profile_image"
                  onChange={handleFileChange}
                  onFocus={handleFocus}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                 {errors.profile_image && (
            <p className="text-red text-sm mt-1">{errors.profile_image}</p>
        )}
              </div>
            </div>
            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">
                Image Preview
              </label>
              <div className="flex items-center gap-4">
                {imagePreviews.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={`${process.env.BE_URL}/${image}`} // Ensure the URL is correct
                      alt="asd"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="bg-red-500 relative left-[100px]  top-[-90px] rounded-full font-bold text-red"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded bg-primary px-6 py-3 text-center text-base font-medium text-white transition hover:bg-opacity-90"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateGuest;
