import Calendar from "@/components/Calender";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
  title: "Admin | Dashboard",
  description:
    "Admin Dashboard for Sueen Nature",
};

const CalendarPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Booking Calendar" firstLink={"/calendar"}/>
      <Calendar/>
    </DefaultLayout>
  );
};

export default CalendarPage;
