import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import CreateRoom from '@/components/Room/CreateRoom/page'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'
import CreateDiscount from '@/components/Discounts/CreateDiscount/page'

const CreateDiscountPage = () => {
  return (
    <DefaultLayout>
        <Breadcrumb pageName={'Discounts'} firstLink={"/discount"} secondLink={"/rooms/createDiscount"} pageNameTwo={'Create Discount'}/>
        {/* <div className='text-black text-xl mt-8 mb-2 font-bold '>Create room</div> */}
        <CreateDiscount/>
    </DefaultLayout>
  )
}

export default CreateDiscountPage