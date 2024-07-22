"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import "react-big-calendar/lib/css/react-big-calendar.css";  //react calendar
import { StoreProvider } from "@/store/StoreProvider";
import ToastProvider from "./ToastProvider";
import useAuth from "@/hooks/useAuth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
// useAuth();
  return (
    <StoreProvider>
      
        <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
        <ToastProvider>
        {loading ? <Loader /> : children}
        </ToastProvider>
       
        </div>
      </body>
    </html>
    </StoreProvider>
  
  );
}
