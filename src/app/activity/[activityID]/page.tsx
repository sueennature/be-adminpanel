import UpdateActivity from '@/components/Actitivities/UpdateActivity/page'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const UpdateActivityPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Activities'} pageNameTwo='Update' firstLink={"/activity"}/>
        <UpdateActivity/>
    </DefaultLayout>
  )
}

export default UpdateActivityPage