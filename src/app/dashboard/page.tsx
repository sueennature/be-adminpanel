import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ECommerce from "@/components/Dashboard/E-commerce";


export const metadata: Metadata = {
  title: "Admin | Dashboard",
  description:
    "Admin Dashboard for Sueen Nature",
};

const Settings = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={""} />
        <ECommerce/>
    </DefaultLayout>
  );
};

export default Settings;
