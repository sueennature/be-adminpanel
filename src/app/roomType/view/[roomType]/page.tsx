import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import ViewOffer from '@/components/Offers/ViewOffer'
import ViewRoomType from '@/components/RoomType/ViewRoomType/page'
import React from 'react'

const ViewRoomTypePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Room Type'} pageNameTwo='Room Type' firstLink={"/room_type"}/>
        <ViewRoomType/>
    </DefaultLayout>
  )
}

export default ViewRoomTypePage