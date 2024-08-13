import UpdateAdditionalService from '@/components/AdditionalServices/UpdateAdditionalService/page'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const UpdateAdditionalServicePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'AdditionalServices'} pageNameTwo='Update' firstLink={"/additionalServices"}/>
       <UpdateAdditionalService/>
    </DefaultLayout>
  )
}

export default UpdateAdditionalServicePage