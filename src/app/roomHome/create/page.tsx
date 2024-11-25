import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import CreateRoomHome from '@/components/RoomHome/CreateRoomHome/page'
import React from 'react'

const CreateRoomHomePage = () => {
  return (
       <DefaultLayout>
       <Breadcrumb pageName={'Room Home'} pageNameTwo='Create' firstLink={"/room_home"}/>
         <CreateRoomHome/>
     </DefaultLayout>
  )
}

export default CreateRoomHomePage