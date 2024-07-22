import React from 'react'
import Image from 'next/image'
import flower from '../../../../public/images/flower.jpg'

const ViewSingleGuest = () => {
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
            <div className='m-2'>First Name</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>John</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Last  Name</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>Doe</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Email</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>John@gmail.com</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Address</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>Main Street, Colombo</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Telephone</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>1123211</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Nationality</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>Local</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Gender</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>Male</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Identification Type</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>Passport</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Identification No</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>2131223</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Identification Issued Date</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>21.02.2024</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Date of Birth</div>
          </div>
          <div className='flex-1'>     
          <div className='m-2'>21.02.2024</div>
          </div>
        </div>
      
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Profile Image</div>
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

export default ViewSingleGuest