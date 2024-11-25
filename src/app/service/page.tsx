import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import ViewGuest from '@/components/Guest/ViewGuest/page'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import ViewAllNews from '@/components/News/ViewAll/ViewAllNews'
import ViewAllServices from '@/components/Services/ViewAllServices/ViewAllServices'
import React from 'react'

const ViewServicePage = () => {
  return (
 
       <DefaultLayout>
       <Breadcrumb pageName={'Service'} pageNameTwo='All Services' firstLink={"/service"}/>
         <ViewAllServices/>
     </DefaultLayout>
   )

}

export default ViewServicePage