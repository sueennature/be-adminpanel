import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import CreateCarousel from '@/components/Carousels/CreateCarousel'
import CreateGuest from '@/components/Guest/CreateGuest/page'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import CreateRoom from '@/components/Room/CreateRoom/page'
import React from 'react'

const CreateCarouselPage = () => {
  return (
    <DefaultLayout>
    <Breadcrumb pageName={'Carousels'} firstLink={"/carousels"} secondLink={"/carousels/create"} pageNameTwo={'Create Carousel'}/>
    {/* <div className='text-black text-xl mt-8 mb-2 font-bold '>Create Guest</div> */}
    <CreateCarousel/>
</DefaultLayout>
  )
}

export default CreateCarouselPage