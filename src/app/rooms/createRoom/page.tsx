import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import CreateRoom from '@/components/CreateRoom/page'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const CreateRoomPage = () => {
  return (
    <DefaultLayout>
        <Breadcrumb pageName={'Rooms'} firstLink={"/rooms"} secondLink={"/rooms/createRoom"} pageNameTwo={'Create'}/>
        <div className='text-black text-xl mt-8 mb-2 font-bold '>Create room</div>
        <CreateRoom/>
    </DefaultLayout>
  )
}

export default CreateRoomPage