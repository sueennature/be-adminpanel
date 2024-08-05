import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import ViewAllCarousel from '@/components/Carousels/ViewAllCarousel'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const ViewCarouslesPage = () => {
  return (
 
       <DefaultLayout>
       <Breadcrumb pageName={'Carousels'} pageNameTwo='All Carousels' firstLink={"/carousels"}/>
         <ViewAllCarousel/>
     </DefaultLayout>
   )

}

export default ViewCarouslesPage