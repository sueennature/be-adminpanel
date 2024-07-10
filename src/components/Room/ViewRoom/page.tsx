import React from 'react'

const ViewRoom = (roomData :any) => {
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
            <div className='m-2'>Single Room</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Max Adults</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>3</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Max Children</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>2</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Description</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>This is the Sgnle room</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Room Only</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>14,000</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Break fast</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>20,000</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Half board</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>40,000</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Full board</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>50,000</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Beds</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>Queen</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Features</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>Soothing, modern design, and floor-to-ceiling windows</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Size</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>12</div>
           </div>
        </div>
        {/* <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Images</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>Soothing, modern design, and floor-to-ceiling windows</div>
           </div>
        </div> */}
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Bathroom</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>One full granite bathroom</div>
           </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default ViewRoom