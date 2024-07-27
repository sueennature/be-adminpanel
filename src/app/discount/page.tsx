import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import CheckAvailability from '@/components/Discounts/CheckAvailability'
import ViewDiscount from '@/components/Discounts/ViewDiscount/page'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const ViewDiscountPage = () => {
  return (
 
       <DefaultLayout>
       <Breadcrumb pageName={'Discounts'} pageNameTwo='All Discounts' firstLink={"/discount"}/>
         <ViewDiscount/>
         {/* <CheckAvailability/> */}
     </DefaultLayout>
   )

}

export default ViewDiscountPage