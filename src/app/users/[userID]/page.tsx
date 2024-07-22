import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import UpdateUser from '@/components/User/UpdateUser/UpdateUser'
import React from 'react'

const UpdateUserPage = () => {
  return (
    <DefaultLayout>
    <Breadcrumb pageName={'Users'} pageNameTwo='Update' firstLink={"/users"}/>
      <UpdateUser/>
  </DefaultLayout>
  )
}

export default UpdateUserPage