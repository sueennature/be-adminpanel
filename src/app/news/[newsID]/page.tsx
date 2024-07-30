import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import UpdateNews from '@/components/News/UpdateNews'
import React from 'react'

const UpdateNewsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'News'} pageNameTwo='Update' firstLink={"/news"}/>
        <UpdateNews/>
    </DefaultLayout>
  )
}

export default UpdateNewsPage