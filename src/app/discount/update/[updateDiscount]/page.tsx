import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import UpdateDiscount from '@/components/Discounts/UpdateDiscount/page'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const UpdateDiscountPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Discounts'} pageNameTwo='Update' firstLink={"/discount"}/>
        <UpdateDiscount/>
    </DefaultLayout>
  )
}

export default UpdateDiscountPage