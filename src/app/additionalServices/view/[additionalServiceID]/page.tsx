import ViewSingleAdditionalServices from '@/components/AdditionalServices/ViewSingleAdditionalService/page'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const ViewSingleAdditionalServicePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'AdditionalServices'} pageNameTwo='View' firstLink={"/additionalServices"}/>
        <ViewSingleAdditionalServices/>
    </DefaultLayout>
  )
}

export default ViewSingleAdditionalServicePage