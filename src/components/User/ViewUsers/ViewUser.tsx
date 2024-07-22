'use client'
import React from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const ViewSingleUser = () => {

  const [visible, setVisible] = React.useState<boolean>(false);
  
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
            <div className='m-2'>Username</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>John</div>
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
            <div className='m-2 flex items-center gap-[10px]'>
              Password <span className='cursor-pointer relative top-[1px]' onClick={()=>setVisible(!visible)}>{visible ? <FaEye style={{color:"black"}}/> : <FaEyeSlash style={{color:"black"}}/>}</span>
            </div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>{visible ? "123213": "#####"}</div>
           </div>
        </div>
   
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Role</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>Admin</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Active</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>True</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>SuperAdmin</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>True</div>
           </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default ViewSingleUser