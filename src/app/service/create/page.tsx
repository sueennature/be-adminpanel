import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import CreateService from '@/components/Services/CreateService/page'
import React from 'react'

const CreateServicePage = () => {
  return (
       <DefaultLayout>
       <Breadcrumb pageName={'Service'} pageNameTwo='Create' firstLink={"/service"}/>
         <CreateService/>
     </DefaultLayout>
  )
}

export default CreateServicePage