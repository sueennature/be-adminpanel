import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import ViewRoom from '@/components/Room/ViewRoom/page'
import React from 'react'

const ViewRoomPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'rooms'} pageNameTwo='view' firstLink={"/rooms"}/>
        <ViewRoom/>
    </DefaultLayout>
  )
}

export default ViewRoomPage