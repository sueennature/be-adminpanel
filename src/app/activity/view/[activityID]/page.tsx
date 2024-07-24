import ViewSingleActivity from '@/components/Actitivities/ViewSingleActivity/page'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const ViewSingleActivityPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Activities'} pageNameTwo='View' firstLink={"/activity"}/>
        <ViewSingleActivity/>
    </DefaultLayout>
  )
}

export default ViewSingleActivityPage