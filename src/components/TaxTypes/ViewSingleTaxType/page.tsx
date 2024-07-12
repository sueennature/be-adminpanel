import Image from 'next/image'
import React from 'react'
import flower from '../../../../public/images/flower.jpg'

const ViewSingleTaxType = () => {
  return (
    <div className=' '>
      <div className='bg-white p-4 rounded-lg'>
        <div className='text-black text-2xl font-bold border-b-2 border-gray'>
          Detail
        </div>
      <div className='flex flex-col mt-4  justify-center'>
      <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>id</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>1</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Name</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>Test</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Description</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>Glide c outing.</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Rate</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>213123	</div>
           </div>
        </div>
    
    
    
      </div>
      </div>
    </div>
  )
}

export default ViewSingleTaxType