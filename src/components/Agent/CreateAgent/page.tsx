"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/utils/checkToken";
import Cookies from "js-cookie";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from "yup";

const CreateAgent = () => {
  useAuthRedirect();
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    telephone: Yup.string()
      .required("Telephone is required")
      .matches(/^[0-9]+$/, "Telephone must be a number")
      .min(10, "Telephone must be exactly 10 digits")
      .max(10, "Telephone must be exactly 10 digits"),
    address: Yup.string().required("Address is required"),
    nationality: Yup.string().required("Nationality is required"),
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create agent");
      }

      if (values.isChecked) {
        const registerResponse = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: `${values.first_name} ${values.last_name}`,
            email: values.email,
            role: "guest",
          }),
        });

        if (registerResponse.status === 401) {
          toast.error("Credentials Expired. Please Log in Again");
          Cookies.remove("access_token");
          setTimeout(() => {
            router.push("/");
          }, 1500);
          return;
        }

        if (!registerResponse.ok) {
          throw new Error("Failed to register user");
        }

        toast.success("Agent is created and user is registered successfully");
      } else {
        toast.success("Agent created successfully");
      }

      setLoading(false);
      setTimeout(() => {
        router.push("/agent");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
      toast.error("Error submitting form");
    }
  };

  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            email: "",
            telephone: "",
            address: "",
            nationality: "",
            isChecked: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="p-6.5">
                <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black">
                      First Name
                    </label>
                    <Field
                      type="text"
                      name="first_name"
                      placeholder="Enter the First Name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                    />
                    <ErrorMessage
                      name="first_name"
                      component="div"
                      className="text-red text-sm mt-1"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black">
                      Last Name
                    </label>
                    <Field
                      type="text"
                      name="last_name"
                      placeholder="Enter the Last Name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                    />
                    <ErrorMessage
                      name="last_name"
                      component="div"
                      className="text-red text-sm mt-1"
                    />
                  </div>
                </div>

                <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/3">
                    <label className="mb-3 block text-sm font-medium text-black">
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter the email"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red text-sm mt-1"
                    />
                  </div>

                  <div className="w-full xl:w-1/3">
                    <label className="mb-3 block text-sm font-medium text-black">
                      Nationality
                    </label>
                    <Field
                      as="select"
                      name="nationality"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                    >
                      <option value="">Select a nationality</option>
                      <option value="foreign">Foreign</option>
                      <option value="local">Local</option>
                    </Field>
                    <ErrorMessage
                      name="nationality"
                      component="div"
                      className="text-red text-sm mt-1"
                    />
                  </div>
                  <div className="w-full xl:w-1/3">
                    <label className="mb-3 block text-sm font-medium text-black">
                      Telephone
                    </label>
                    <Field
                      type="text"
                      name="telephone"
                      placeholder="Enter the Telephone"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                    />
                    <ErrorMessage
                      name="telephone"
                      component="div"
                      className="text-red text-sm mt-1"
                    />
                  </div>
                </div>
                <div className="mb-6.5">
                  <label className="mb-3 block text-sm font-medium text-black">
                    Address
                  </label>
                  <Field
                    type="text"
                    name="address"
                    placeholder="Enter the Address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
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
                    disabled={loading || isSubmitting}
                    className="rounded bg-primary px-6 py-2 text-sm font-medium text-gray shadow transition hover:bg-opacity-90"
                  >
                    {loading ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateAgent;