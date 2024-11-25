import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ViewAllRoomHome from "@/components/RoomHome/ViewAllRoomHomes/page";
import ViewAllRoomTypes from "@/components/RoomType/ViewAllRoomTypes/page";

const RoomTypes = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Room Homes" pageNameTwo={""} firstLink={"/room_home"} />
      <ViewAllRoomHome />
    </DefaultLayout>
  );
};

export default RoomTypes;
