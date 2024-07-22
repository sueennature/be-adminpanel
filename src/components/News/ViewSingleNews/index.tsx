import React from 'react'
import Image from 'next/image'
import flower from '../../../../public/images/flower.jpg'

const ViewSingleNews = () => {
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
            <div className='m-2'>Title</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>News Title</div>
           </div>
        </div>
       
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Content</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>Welcome to sueen</div>
           </div>
        </div>

      
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'> Image</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>
            <Image src={flower} alt="asd" width={100} height={100} />                            

            </div>
           </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default ViewSingleNews