
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useRouter } from "next/navigation";
import Login from "@/components/Login/Login";
export const metadata: Metadata = {
  title:
    "Admin | Dashboard",
  description: "Admin Dashboard for Sueen Nature",
};

export default function Home() {



  
  return (
     <main>
      <Login/>
     </main>
  );
}
