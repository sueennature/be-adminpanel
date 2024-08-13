import ViewAdditionalServices from '@/components/AdditionalServices/ViewAdditionalServices/page'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const ViewAdditionalServicePage = () => {
  return (
 
       <DefaultLayout>
       <Breadcrumb pageName={'AdditionalServices'} pageNameTwo='All Additional Services' firstLink={"/additionalService"}/>
         <ViewAdditionalServices/>
     </DefaultLayout>
   )

}

export default ViewAdditionalServicePage