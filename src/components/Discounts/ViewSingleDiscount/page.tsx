import Image from 'next/image'
import React from 'react'
import flower from '../../../../public/images/flower.jpg'

const ViewSingleDiscount = () => {
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
            <div className='m-2'>Discount</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>213213</div>
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
            <div className='m-2'>Start Date</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>2024-09-25 15:35:05	</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>End Date</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>
            2024-09-25 15:35:05	                          
            </div>
           </div>
        </div>
    
    
      </div>
      </div>
    </div>
  )
}

export default ViewSingleDiscount