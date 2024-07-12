import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import ViewSingleDiscount from '@/components/Discounts/ViewSingleDiscount/page'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import ViewSingleTaxType from '@/components/TaxTypes/ViewSingleTaxType/page'
import React from 'react'

const ViewSingleTaxTypePage= () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Tax Types'} pageNameTwo='View' firstLink={"/taxtypes"}/>
        <ViewSingleTaxType/>
    </DefaultLayout>
  )
}

export default ViewSingleTaxTypePage