import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'
import CreateAdditionalServices from '@/components/AdditionalServices/CreateAdditonalService/page'

const CreateAdditionalServicePage = () => {
  return (
    <DefaultLayout>
        <Breadcrumb pageName={'AdditionalServices'} firstLink={"/additionalServices"} secondLink={"/additionalServices/create"} pageNameTwo={'Create Additional Services'}/>
        {/* <div className='text-black text-xl mt-8 mb-2 font-bold '>Create room</div> */}
        <CreateAdditionalServices/>
    </DefaultLayout>
  )
}

export default CreateAdditionalServicePage