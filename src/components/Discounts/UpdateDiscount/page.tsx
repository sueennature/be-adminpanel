"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from 'date-fns';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const UpdateDiscount = () => {
  const [formData, setFormData] = useState({
    name: "",
    percentage: "",
    start_date: new Date(),
    end_date: new Date(),
    description: "",
    discount_code:'',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const discountId = searchParams.get("discountID");

  useEffect(() => {
    const fetchDiscount = async () => {
      if (discountId) {
        setError(null);
        try {
          const accessToken = Cookies.get("access_token");
          const response = await axios.get(
            `${process.env.BE_URL}/discounts/${discountId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            }
          );
          
          const start_date = new Date(response.data.start_date);
          const end_date = new Date(response.data.end_date);
          
          setFormData({
            ...response.data,
            start_date,
            end_date,
          });
        } catch (err) {
          setError("Failed to fetch discount data. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDiscount();
  }, [discountId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formattedStartDate = format(formData.start_date, "yyyy-MM-dd'T'HH:mm:ss");
    const formattedEndDate = format(formData.end_date, "yyyy-MM-dd'T'HH:mm:ss");
    
    const dataToSubmit = {
      ...formData,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    };

    try {
      const response = await fetch('/api/discount/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: discountId, ...dataToSubmit }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update item');
      }
      
      setLoading(false)
      toast.success('Discount is updated successfully');
      setTimeout(()=>{
        router.push("/discount")
      }, 1500)
    } catch (err) {
      console.error(err);
      setLoading(false); 
      toast.error('An error occurred');
    }
    console.log("Form Data:", dataToSubmit);
  };

  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">Percentage</label>
                <input
                  type="number"
                  name="percentage"
                  value={formData.percentage}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Percentage"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">Discount Code</label>
                <input
                  type="text"
                  name="discount_code"
                  value={formData.discount_code}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Percentage"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
              </div>
            </div>

            <div className="mb-6.5 flex w-full gap-6">
              <div className="w-full">
                <label className="mb-3 block text-sm font-medium text-black">Select Start Date</label>
                <div className="customDatePickerWidth">
                  <DatePicker
                    selected={formData.start_date}
                    onChange={(date) => handleDateChange(date, "start_date")}
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                    placeholderText="mm/dd/yyyy"
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="mb-3 block text-sm font-medium text-black">Select End Date</label>
                <div className="customDatePickerWidth">
                  <DatePicker
                    selected={formData.end_date}
                    onChange={(date) => handleDateChange(date, "end_date")}
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                    placeholderText="mm/dd/yyyy"
                  />
                </div>
              </div>
            </div>
            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Enter a description"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
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

export default UpdateDiscount;
