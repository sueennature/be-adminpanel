"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import flatpickr from "flatpickr";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/utils/checkToken";
import Cookies from "js-cookie";

const CreateGuest = () => {
  useAuthRedirect();
  const [formData, setFormData] = useState<any>({
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
    profile_image: [],
  });

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


  
  const dobPickerRef = useRef<flatpickr.Instance | null>(null);
  const idIssueDatePickerRef = useRef<flatpickr.Instance | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    flatpickr("#dob", {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      prevArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg className="fill-current" width="7" height="11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      onChange: (selectedDates) => {
        const dateStr = selectedDates[0].toISOString();
        setFormData((prevData : any) => ({
          ...prevData,
          dob: dateStr,
        }));
      },
    });

    flatpickr("#identification_issue_date", {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      prevArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg className="fill-current" width="7" height="11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      onChange: (selectedDates) => {
        const dateStr = selectedDates[0].toISOString();
        setFormData((prevData :any) => ({
          ...prevData,
          identification_issue_date: dateStr,
        }));
      },
    });

    // Cleanup flatpickr instances on unmount
    return () => {
      if (dobPickerRef.current) {
        dobPickerRef.current.destroy();
      }
      if (idIssueDatePickerRef.current) {
        idIssueDatePickerRef.current.destroy();
      }
    };
  }, []);

  
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
     // Validate the input as it's being changed
     validateField(name, value);
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
          setFormData({
            ...formData,
            profile_image: base64Images
          });
        })
        .catch(error => {
          console.error("Error converting images to base64:", error);
          toast.error("Error uploading images");
        });
    }
  };
};
const handleFocus = () => {
  if (!tooltipMessage) {
    setTooltipMessage('Please upload an image smaller than 1 MB');
  }
};
  const removeBase64Prefix = (base64String: string) => {
    const base64Prefix = 'data:image/png;base64,';
    if (base64String.startsWith(base64Prefix)) {
      return base64String.substring(base64Prefix.length);
    }
    return base64String;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setLoading(true)

    const processedFormData = {
      ...formData,
      profile_image: formData.profile_image?.map(removeBase64Prefix),
    };

    console.log(processedFormData);

    try {
      const response = await fetch("/api/guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      toast.success("Guest is created successfully")
      if (!response.ok) {
        throw new Error("Failed to create guest");
      }

      if (isChecked) {
        const registerResponse = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          
          body: JSON.stringify({
            username: formData.first_name + " " + formData.last_name,
            email: formData.email,
            role: "guest",
            password: formData.password,
          }),
        });

        if(registerResponse.status === 401){
          toast.error("Credentials Expired. Please Log in Again")
          Cookies.remove('access_token');
          setTimeout(()=>{
            router.push('/')
          },1500)
          return;
        }
        if (!registerResponse.ok) {
          throw new Error("Failed to register user");
        }
        if(isChecked) {
          setLoading(false)
          toast.success("Guest is created and user is registered successfully");
        }
        setTimeout(()=>{
          router.push("/guest")
        },1500)
      } else {
        setLoading(false)
        toast.success("Guest created successfully");
        setTimeout(()=>{
          router.push("/guest")
        },1500)
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false)
      toast.error("Error submitting form");
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
              <div className="w-full xl:w-1/5">
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
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red text-sm">{errors.gender}</p>}
              </div>

              <div className="w-full xl:w-1/5">
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
              <div className="w-full xl:w-1/5">
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

              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-sm font-medium text-black">
                  Identification Issue Date
                </label>
                <input
                  type="text"
                  name="identification_issue_date"
                  id="identification_issue_date"
                  required
                  placeholder="Enter the Identification Issue Date"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                {errors.identification_issue_date && <p className="text-red text-sm">{errors.identification_issue_date}</p>}
              </div>
              <div className="w-full xl:w-1/5">
                <label className="mb-3 block text-sm font-medium text-black">
                  Date of Birth
                </label>
                <input
                  type="text"
                  name="dob"
                  id="dob"
                  required
                  placeholder="Enter the Date of Birth"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                {errors.dob && <p className="text-red text-sm">{errors.dob}</p>}
              </div>
            </div>

            <div className="mb-6.5">
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
              {errors.address && <p className="text-red text-sm">{errors.address}</p>}
            </div>

            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">
                Password
              </label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter the Password"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
               {errors.password && <p className="text-red text-sm">{errors.password}</p>}
            </div>

            <div className="mb-6.5">
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
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
            />
            {errors.profile_image && (
            <p className="text-red text-sm mt-1">{errors.profile_image}</p>
        )}
       
            
            </div>
            <div>
      <label
        htmlFor="checkboxLabelOne"
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="checkboxLabelOne"
            className="sr-only"
            onChange={() => {
              setIsChecked(!isChecked);
            }}
          />
          <div
            className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
              isChecked && "border-primary bg-gray dark:bg-transparent"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-sm ${isChecked && "bg-primary"}`}
            ></span>
          </div>
        </div>
        Allow User
      </label>
    </div>

            <div className="flex justify-end gap-4.5">
              <button
                type="button"
                className="rounded bg-gray-2 px-6 py-2 text-sm font-medium text-black shadow transition hover:bg-opacity-90"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded bg-primary px-6 py-2 text-sm font-medium text-gray shadow transition hover:bg-opacity-90"
              >
                  {loading ? "Creating..." : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGuest;
