import Calendar from "@/components/Calender";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CheckAvailability from '@/components/Discounts/CheckAvailability'
import BookingTable from "@/components/bookings/BookingTable";

export const metadata: Metadata = {
  title: "Admin | Dashboard",
  description:
    "Admin Dashboard for Sueen Nature",
};

const CalendarPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Booking Calendar" firstLink={"/calendar"}/>
      <CheckAvailability/>
      <Calendar/>
      <BookingTable/>
    </DefaultLayout>
  );
};

export default CalendarPage;
