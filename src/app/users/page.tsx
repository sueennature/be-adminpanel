import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import ViewAllUsers from '@/components/User/ViewAllUsers/ViewAllUsers'
import React from 'react'

const ViewUserPage = () => {
  return (
 
       <DefaultLayout>
       <Breadcrumb pageName={'Users'} pageNameTwo='Views' firstLink={"/users"}/>
         <ViewAllUsers/>
     </DefaultLayout>
   )

}

export default ViewUserPage