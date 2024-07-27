import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import ViewGuest from '@/components/Guest/ViewGuest/page'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import ViewAllNews from '@/components/News/ViewAll/ViewAllNews'
import React from 'react'

const ViewNewsPage = () => {
  return (
 
       <DefaultLayout>
       <Breadcrumb pageName={'News'} pageNameTwo='All News' firstLink={"/news"}/>
         <ViewAllNews/>
     </DefaultLayout>
   )

}

export default ViewNewsPage