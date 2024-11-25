import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import CreateOffer from '@/components/Offers/CreateOffer/page'
import CreateRoomType from '@/components/RoomType/CreateRoomType/page'
import React from 'react'

const CreateRoomTypePage = () => {
  return (
       <DefaultLayout>
       <Breadcrumb pageName={'Room Type'} pageNameTwo='Create' firstLink={"/room_type"}/>
         <CreateRoomType/>
     </DefaultLayout>
  )
}

export default CreateRoomTypePage