import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import UpdateOffer from '@/components/Offers/UpdateOffer'
import React from 'react'

const UpdateOfferPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Offer'} pageNameTwo='Update' firstLink={"/offer"}/>
        <UpdateOffer/>
    </DefaultLayout>
  )
}

export default UpdateOfferPage