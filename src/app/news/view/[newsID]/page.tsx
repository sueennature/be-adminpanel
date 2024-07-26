import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import ViewSingleNews from '@/components/News/ViewSingleNews'
import React from 'react'

const ViewNewsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'News'} pageNameTwo='All News' firstLink={"/news"}/>
        <ViewSingleNews/>
    </DefaultLayout>
  )
}

export default ViewNewsPage