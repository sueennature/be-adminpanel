import Image from 'next/image'
import React from 'react'
import flower from '../../../../public/images/flower.jpg'

const ViewSingleActivity = () => {
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
            <div className='m-2'>Activity Name</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>Serene Boat Rides on the Nature Lake	</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Description</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>Glide across the tranquil waters of our nature lake on a leisurely boat ride. Enjoy the breathtaking scenery, observe local wildlife, and immerse yourself in the serene beauty of nature. Perfect for a peaceful retreat or a romantic outing.</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Amount</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>400</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Image</div>
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

export default ViewSingleActivity