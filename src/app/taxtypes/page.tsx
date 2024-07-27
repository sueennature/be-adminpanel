import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import ViewTaxTypes from '@/components/TaxTypes/ViewTaxTypes/page'
import React from 'react'

const ViewTaxTypePage = () => {
  return (
 
       <DefaultLayout>
       <Breadcrumb pageName={'Tax Types'} pageNameTwo='All Tax Types' firstLink={"/taxtypes"}/>
         <ViewTaxTypes/>
         
     </DefaultLayout>
   )

}

export default ViewTaxTypePage