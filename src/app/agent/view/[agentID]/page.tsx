import ViewSingleAgent from '@/components/Agent/ViewSingleAgent/page'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const ViewSingleAgentPage = () => {
  return (
       <DefaultLayout>
       <Breadcrumb pageName={'Agents'} pageNameTwo='View' firstLink={"/agent"}/>
         <ViewSingleAgent/>
     </DefaultLayout>
  )
}

export default ViewSingleAgentPage