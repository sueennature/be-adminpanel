import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import UpdateGuest from '@/components/Guest/UpdateGuest'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const UpdateAgentPage = () => {
  return (
    <DefaultLayout>
    <Breadcrumb pageName={'Agents'} pageNameTwo='Update' firstLink={"/agent"}/>
       <UpdateGuest/>
  </DefaultLayout>
  )
}

export default UpdateAgentPage