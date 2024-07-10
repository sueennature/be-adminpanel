import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import CreateGuest from '@/components/Guest/CreateGuest/page'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import CreateRoom from '@/components/Room/CreateRoom/page'
import React from 'react'

const CreateGuestPage = () => {
  return (
    <DefaultLayout>
    <Breadcrumb pageName={'Guests'} firstLink={"/guest"} secondLink={"/guest/create"} pageNameTwo={'Create Guest'}/>
    {/* <div className='text-black text-xl mt-8 mb-2 font-bold '>Create Guest</div> */}
    <CreateGuest/>
</DefaultLayout>
  )
}

export default CreateGuestPage