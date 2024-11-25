import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import UpdateService from '@/components/Services/UpdateService/page'
import React from 'react'

const UpdateServicePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Service'} pageNameTwo='Update' firstLink={"/service"}/>
        <UpdateService/>
    </DefaultLayout>
  )
}

export default UpdateServicePage