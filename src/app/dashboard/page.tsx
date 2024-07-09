import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ECommerce from "@/components/Dashboard/E-commerce";

export const metadata: Metadata = {
  title: "Next.js Settings | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Settings = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <ECommerce/>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
