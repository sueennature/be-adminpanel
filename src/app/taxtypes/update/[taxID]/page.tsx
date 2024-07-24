import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import UpdateTaxTypes from '@/components/TaxTypes/UpdateTaxTypes/page'
import React from 'react'

const UpdateTaxTypesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={'Tax Types'} pageNameTwo='Update' firstLink={"/taxtypes"}/>
        <UpdateTaxTypes/>
    </DefaultLayout>
  )
}

export default UpdateTaxTypesPage