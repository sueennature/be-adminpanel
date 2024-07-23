import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import ViewSingleUser from '@/components/User/ViewUsers/ViewUser'
import React from 'react'

const ViewSingleUserPage = () => {
  return (
       <DefaultLayout>
       <Breadcrumb pageName={'Users'} pageNameTwo='View' firstLink={"/users"}/>
         <ViewSingleUser/>
     </DefaultLayout>
  )
}

export default ViewSingleUserPage