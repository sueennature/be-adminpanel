import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ViewAllOffers from "@/components/Offers/ViewAllOffers/ViewAllOffers";
import React from "react";

const ViewAllOffersPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={"Offers"}
        pageNameTwo="All Offers"
        firstLink={"/offers"}
      />
      <ViewAllOffers />
    </DefaultLayout>
  );
};

export default ViewAllOffersPage;
