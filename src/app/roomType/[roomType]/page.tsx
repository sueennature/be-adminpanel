import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import UpdateRoomType from '@/components/RoomType/UpdateRoomType/page'
import React from 'react'

const UpdateRoomTypePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Room Type'} pageNameTwo='Update' firstLink={"/room_type"}/>
        <UpdateRoomType/>
    </DefaultLayout>
  )
}

export default UpdateRoomTypePage