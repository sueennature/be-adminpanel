"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useAuthRedirect } from "@/utils/checkToken";
import Swal from 'sweetalert2';

interface FormData {
    first_name: string;
    last_name: string;
    email: string;
    telephone: string;
    address: string;
    nationality: string;
}

const UpdateAgent = () => {
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    telephone: "",
    address: "",
    nationality: ""
  });

  const [errors, setErrors] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    telephone: "",
    address: "",
    nationality: ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  let agentId = searchParams.get("agentID");

  useAuthRedirect();

  useEffect(() => {
    const fetchAgent = async () => {
      if (agentId) {
        try {
          const accessToken = Cookies.get("access_token");
          const response = await axios.get(
            `${process.env.BE_URL}/agents/${agentId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );
          setFormData({ ...response.data });
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchAgent();
  }, [agentId]);

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
        case 'email':
              if (!value.trim()) {
                  error = 'Email is required';
              } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
                  error = 'Email is invalid';
              }
              break;   
        case 'telephone':
                if (!value.trim()) {
                    error = 'Telephone is required';
                } else if (!/^0\d{9}$/.test(value)) {
                    error = 'Telephone must be a valid Sri Lankan number (10 digits, starting with 0)';
                }
                break;
        case 'address':
              if (!value.trim()) {
                  error = 'Address is required';
              }
              break; 
        case 'nationality':
                if (!value.trim()) {
                    error = 'Nationality is required';
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: ""
    });
    // Validate the input as it's being changed
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   

    setLoading(true);
    try {
      const response = await fetch("/api/agent/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: agentId, ...formData }),
      });

      const result = await response.json();
      if (response.status === 401) {
        toast.error("Credentials Expired. Please Log in Again");
        Cookies.remove('access_token');
        setTimeout(() => {
          router.push('/');
        }, 1500);
        return;
      }
      if (!response.ok) {
        throw new Error(result.error || "Failed to update agent");
      }

      setLoading(false);
      toast.success("Agent updated successfully");
      setTimeout(() => {
        router.push("/agent");
      }, 1500);
    } catch (err) {
      console.error(err);
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
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
                {errors.first_name && (
                  <span className="text-red">{errors.first_name}</span>
                )}
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
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
                {errors.last_name && (
                  <span className="text-red">{errors.last_name}</span>
                )}
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
                  placeholder="Enter the Email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
                {errors.email && (
                  <span className="text-red">{errors.email}</span>
                )}
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
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                >
                  <option value="">Select a nationality</option>
                  <option value="foreign">Foreign</option>
                  <option value="local">Local</option>
                </select>
                {errors.nationality && (
                  <span className="text-red">{errors.nationality}</span>
                )}
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Telephone
                </label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Telephone"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
                {errors.telephone && (
                  <span className="text-red">{errors.telephone}</span>
                )}
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
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
                {errors.address && (
                  <span className="text-red">{errors.address}</span>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              >
                {loading ? "Loading..." : "Update Agent"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAgent;

