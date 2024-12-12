import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ViewRoomHome from "@/components/RoomHome/ViewRoomHome/page";
import React from "react";

const ViewRoomHomePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={"Room Home"}
        pageNameTwo="Room Home"
        firstLink={"/roomHome"}
      />
      <ViewRoomHome />
    </DefaultLayout>
  );
};

export default ViewRoomHomePage;
