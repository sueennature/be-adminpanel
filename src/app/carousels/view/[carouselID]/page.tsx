import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import ViewSingleCarousel from '@/components/Carousels/ViewSingleCarousel'
import UpdateDiscount from '@/components/Discounts/UpdateDiscount/page'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const ViewSingleCarouselPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Carousels'} pageNameTwo='View' firstLink={"/carousels"}/>
        <ViewSingleCarousel/>
    </DefaultLayout>
  )
}

export default ViewSingleCarouselPage