import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import UpdateCarousel from '@/components/Carousels/UpdateCarousel'
import UpdateDiscount from '@/components/Discounts/UpdateDiscount/page'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const UpdateDiscountPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Carousels'} pageNameTwo='Update' firstLink={"/carousels"}/>
        <UpdateCarousel/>
    </DefaultLayout>
  )
}

export default UpdateDiscountPage