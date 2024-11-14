"use client";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { UserContext } from "@/context/userContext";
import { useUserContext } from "@/hooks/useUserContext";

export default function Login() {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [visible, setVisible] = React.useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } =useUserContext();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !password.trim()) {
      return toast.error("Please fill all fields");
    }

    if (!emailPattern.test(email)) {
      toast.error("Please enter valid email");
      return;
    }
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    setLoading(false)
    
    if (data.access_token) {
        localStorage.setItem("user_role", data.user_role);
        setUser(data.user_role);
        router.push("/home");
    } else if ((data.detail = "Invalid credentials")) {
      setLoading(false)
      return toast.error(`Invalid Credentials`);
    } else {
      setLoading(false)
      return toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center rounded-sm border bg-white  ">
      <div className="flex h-full items-center justify-center">
        <div className="flex h-full items-center justify-center rounded-xl shadow-md shadow-black/55">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black sm:text-title-xl2">
              Sign In to Sueen Admin Panel
            </h2>

            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black ">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="d w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                />

                <span className="absolute right-4 top-4">
                  <svg
                    className="fill-current"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.5">
                      <path
                        d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                        fill=""
                      />
                    </g>
                  </svg>
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black ">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type={!visible ? "password" : "text"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none "
                />

                <span className="absolute right-4 top-5">
                  <span
                    className="cursor-pointer"
                    onClick={() => setVisible(!visible)}
                  >
                    {visible ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </span>
              </div>
            </div>

            <div className="mb-5">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
