import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import ViewSingleGuest from '@/components/Guest/ViewSingleGuest/page'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const ViewSingleGuestPage = () => {
  return (
       <DefaultLayout>
       <Breadcrumb pageName={'Guests'} pageNameTwo='View' firstLink={"/guest"}/>
         <ViewSingleGuest/>
     </DefaultLayout>
  )
}

export default ViewSingleGuestPage