import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import UpdateGuest from '@/components/Guest/UpdateGuest'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const UpdateGuestPage = () => {
  return (
    <DefaultLayout>
    <Breadcrumb pageName={'Guests'} pageNameTwo='Update' firstLink={"/guest"}/>
      <UpdateGuest/>
  </DefaultLayout>
  )
}

export default UpdateGuestPage