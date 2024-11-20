import ViewAdditionalServices from '@/components/AdditionalServices/ViewAdditionalServices/page'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import ViewReports from '@/components/Reports/ViewReports/page'
import React from 'react'

const Reports = () => {
  return (
 
       <DefaultLayout>
       <Breadcrumb pageName={'Reports'} pageNameTwo='Reports' firstLink={"/reports"}/>
         <ViewReports/>
     </DefaultLayout>
   )

}

export default Reports