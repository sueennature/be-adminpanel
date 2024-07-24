import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import UpdateRoom from '@/components/Room/UpdateRoom/page'
import React from 'react'

const UpdateRoomPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Rooms'} pageNameTwo='Update' firstLink={"/rooms"}/>
        <UpdateRoom/>
    </DefaultLayout>
  )
}

export default UpdateRoomPage