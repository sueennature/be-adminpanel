import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import ViewSingleDiscount from '@/components/Discounts/ViewSingleDiscount/page'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const ViewSingleDiscountPage= () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Discounts'} pageNameTwo='View' firstLink={"/discount"}/>
        <ViewSingleDiscount/>
    </DefaultLayout>
  )
}

export default ViewSingleDiscountPage