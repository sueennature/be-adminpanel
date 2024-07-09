import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import RoomTable from "@/components/Tables/roomTable";

const Rooms = () => {
  

    return (
        <DefaultLayout>
          <Breadcrumb pageName="Rooms" pageNameTwo={""}  firstLink={'/rooms'}/>
            <RoomTable/>
        </DefaultLayout>
        
    );
};

export default Rooms;
