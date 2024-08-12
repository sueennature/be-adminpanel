import UpdateAgent from '@/components/Agent/UpdateAgent'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const UpdateAgentPage = () => {
  return (
    <DefaultLayout>
    <Breadcrumb pageName={'Agents'} pageNameTwo='Update' firstLink={"/agent"}/>
      <UpdateAgent/>
  </DefaultLayout>
  )
}

export default UpdateAgentPage