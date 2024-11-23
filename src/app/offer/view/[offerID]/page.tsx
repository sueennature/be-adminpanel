import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import ViewOffer from '@/components/Offers/ViewOffer'
import React from 'react'

const ViewOfferPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Offer'} pageNameTwo='Offer' firstLink={"/offer"}/>
        <ViewOffer/>
    </DefaultLayout>
  )
}

export default ViewOfferPage