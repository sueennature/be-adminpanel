import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'
import CreateTaxTypes from '@/components/TaxTypes/CreateTaxTypes/page'

const CreateTaxTypesPage = () => {
  return (
    <DefaultLayout>
        <Breadcrumb pageName={'Taxtypes'} firstLink={"/taxtypes"} secondLink={"/taxtypes/createtaxtype"} pageNameTwo={'Create Tax Type'}/>
        {/* <div className='text-black text-xl mt-8 mb-2 font-bold '>Create room</div> */}
        <CreateTaxTypes/>
    </DefaultLayout>
  )
}

export default CreateTaxTypesPage