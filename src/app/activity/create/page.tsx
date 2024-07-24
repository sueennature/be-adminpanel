import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'
import CreateActivity from '@/components/Actitivities/CreateActivity/page'

const CreateActivitiesPage = () => {
  return (
    <DefaultLayout>
        <Breadcrumb pageName={'Activities'} firstLink={"/activity"} secondLink={"/rooms/createActivity"} pageNameTwo={'Create Actitvity'}/>
        {/* <div className='text-black text-xl mt-8 mb-2 font-bold '>Create room</div> */}
        <CreateActivity/>
    </DefaultLayout>
  )
}

export default CreateActivitiesPage