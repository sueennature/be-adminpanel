import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import ViewGuest from '@/components/Guest/ViewGuest/page'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import ViewRoom from '@/components/Room/ViewRoom/page'
import React from 'react'

const ViewGuestPage = () => {
  return (
 
       <DefaultLayout>
       <Breadcrumb pageName={'Guests'} pageNameTwo='All Guest' firstLink={"/guest"}/>
         <ViewGuest/>
     </DefaultLayout>
   )

}

export default ViewGuestPage