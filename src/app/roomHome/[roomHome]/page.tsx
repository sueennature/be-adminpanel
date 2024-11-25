import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import UpdateRoomHome from '@/components/RoomHome/UpdateRoomHome/page'
import UpdateRoomType from '@/components/RoomType/UpdateRoomType/page'
import React from 'react'

const UpdateRoomHomePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Room Home'} pageNameTwo='Update' firstLink={"/room_home"}/>
        <UpdateRoomHome/>
    </DefaultLayout>
  )
}

export default UpdateRoomHomePage;