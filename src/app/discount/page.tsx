import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import ViewDiscount from '@/components/Discounts/ViewDiscount/page'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const ViewDiscountPage = () => {
  return (
 
       <DefaultLayout>
       <Breadcrumb pageName={'Discounts'} pageNameTwo='Views' firstLink={"/discount"}/>
         <ViewDiscount/>
     </DefaultLayout>
   )

}

export default ViewDiscountPage