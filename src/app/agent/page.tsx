import ViewAgent from '@/components/Agent/ViewAgent/page'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import ViewRoom from '@/components/Room/ViewRoom/page'
import React from 'react'

const ViewAgentPage = () => {
  return (
 
       <DefaultLayout>
       <Breadcrumb pageName={'Agents'} pageNameTwo='All Agents' firstLink={"/agent"}/>
         <ViewAgent/>
     </DefaultLayout>
   )

}

export default ViewAgentPage