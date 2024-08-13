import CreateAgent from '@/components/Agent/CreateAgent/page'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const CreateGuestPage = () => {
  return (
    <DefaultLayout>
    <Breadcrumb pageName={'Agents'} firstLink={"/agent"} secondLink={"/agent/create"} pageNameTwo={'Create Agent'}/>
    {/* <div className='text-black text-xl mt-8 mb-2 font-bold '>Create Guest</div> */}
    <CreateAgent/>
</DefaultLayout>
  )
}

export default CreateGuestPage