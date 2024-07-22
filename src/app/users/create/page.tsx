import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import CreateGuest from '@/components/Guest/CreateGuest/page'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import CreateRoom from '@/components/Room/CreateRoom/page'
import CreateUser from '@/components/User/CreateUser/CreateUser'
import React from 'react'

const CreateUserPage = () => {
  return (
    <DefaultLayout>
    <Breadcrumb pageName={'Users'} firstLink={"/users"} secondLink={"/users/create"} pageNameTwo={'Create User'}/>
    {/* <div className='text-black text-xl mt-8 mb-2 font-bold '>Create Guest</div> */}
    <CreateUser/>
</DefaultLayout>
  )
}

export default CreateUserPage