import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ViewAllRoomTypes from "@/components/RoomType/ViewAllRoomTypes/page";

const RoomTypes = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Room Types" pageNameTwo={""} firstLink={"/rooms"} />
      <ViewAllRoomTypes />
    </DefaultLayout>
  );
};

export default RoomTypes;
