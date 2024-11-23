import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import CreateOffer from '@/components/Offers/CreateOffer/page'
import React from 'react'

const CreateOfferPage = () => {
  return (
       <DefaultLayout>
       <Breadcrumb pageName={'Offer'} pageNameTwo='Create' firstLink={"/offer"}/>
         <CreateOffer/>
     </DefaultLayout>
  )
}

export default CreateOfferPage