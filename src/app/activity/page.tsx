import ViewActitivity from '@/components/Actitivities/ViewActivityPage/page'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const ViewActitvityPage = () => {
  return (
 
       <DefaultLayout>
       <Breadcrumb pageName={'Activities'} pageNameTwo='Activities' firstLink={"/activity"}/>
         <ViewActitivity/>
     </DefaultLayout>
   )

}

export default ViewActitvityPage