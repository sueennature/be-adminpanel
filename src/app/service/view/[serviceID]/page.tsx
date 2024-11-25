import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import ViewService from '@/components/Services/ViewService'
import React from 'react'

const ViewServicePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Service'} pageNameTwo='All Service' firstLink={"/service"}/>
        <ViewService/>
    </DefaultLayout>
  )
}

export default ViewServicePage