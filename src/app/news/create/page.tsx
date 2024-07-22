import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import CreateNews from '@/components/News/CreateNews'
import React from 'react'

const CreateNewsPage = () => {
  return (
       <DefaultLayout>
       <Breadcrumb pageName={'News'} pageNameTwo='Create' firstLink={"/news"}/>
         <CreateNews/>
     </DefaultLayout>
  )
}

export default CreateNewsPage