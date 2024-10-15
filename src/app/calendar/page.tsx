import Calendar from "@/components/Calender";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CheckAvailability from '@/components/Discounts/CheckAvailability'
import BookingTable from "@/components/bookings/BookingTable";
import CustomTimeLine from "@/components/CustomTimeLine/CustomTimeLine";
import CustomTimeLineNew from "@/components/CustomTimeLine/CustomTimeLineNew";

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
      <BookingTable/>
      <CustomTimeLineNew/>
    </DefaultLayout>
  );
};

export default CalendarPage;
