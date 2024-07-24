'use client'
import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const ViewSingleTaxType = () => {
  const searchParams = useSearchParams();
  const [tax, setTax] = React.useState<any>([]);

  let taxId = searchParams.get("taxID");
  console.log(taxId);
  const router = useRouter();

  React.useEffect(()=>{
    const token = Cookies.get('access_token');
    if(!token){
        return router.push('/')
    }
},[router])


  useEffect(() => {
    const fetchTax = async () => {
      if (taxId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/taxes/${taxId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );
          setTax(response.data);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchTax();
  }, [taxId]);
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
            <div className='m-2'>{tax.id}</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Name</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>{tax.name}</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Description</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>{tax.description}</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Tax Type</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>{tax.tax_type}</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Percentage</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>{tax.percentage}%</div>
           </div>
        </div>
    
    
    
      </div>
      </div>
    </div>
  )
}

export default ViewSingleTaxType