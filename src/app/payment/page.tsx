import Calendar from "@/components/Calender";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CheckAvailability from '@/components/Discounts/CheckAvailability'
import ViewPayments from "@/components/Payments/page";
// import BookingTable from "@/components/bookings";

export const metadata: Metadata = {
  title: "Admin | Dashboard",
  description:
    "Admin Dashboard for Sueen Nature",
};

const PaymentPage = () => {
  return (
    <DefaultLayout>
        <Breadcrumb pageName="payment" firstLink={"/payment"}/>
      <ViewPayments/>
    </DefaultLayout>
  );
};

export default PaymentPage;