'use client'
import React, { useEffect } from 'react'
import flower from '../../../../public/images/flower.jpg'
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Cookies from "js-cookie";
import { format } from "date-fns";
import { useAuthRedirect } from '@/utils/checkToken';


const ViewSingleDiscount = () => {
  useAuthRedirect();
  const searchParams = useSearchParams();
  const [discount, setDiscount] = React.useState<any>([]);

  let discountId = searchParams.get("discountID");
  console.log(discountId);

  useEffect(() => {
    const fetchDiscount = async () => {
      if (discountId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/discounts/${discountId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );
          console.log(response.data);
          setDiscount(response.data);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchDiscount();
  }, [discountId]);
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
            <div className='m-2'>{discount.id}</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Name</div>
          </div>
          <div className='flex-1'>     
          <div className='m-2'>{discount.name}</div>
          </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Percentage</div>
          </div>
          <div className='flex-1'>     
          <div className='m-2'>{discount.percentage}%</div>
          </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Percentage</div>
          </div>
          <div className='flex-1'>     
          <div className='m-2'>{discount.discount_code}</div>
          </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Description</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>_{discount.description}</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Start Date</div>
          </div>
          <div className='flex-1'>     
          <div className='m-2'>
          {discount.start_date ? format(new Date(discount.start_date), "yyyy-MM-dd") : 'N/A'}
          </div>          
          </div>

        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>End Date</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>
            {discount.end_date ? format(new Date(discount.end_date), "yyyy-MM-dd") : 'N/A'}
            </div>
           </div>
        </div>
    
    
      </div>
      </div>
    </div>
  )
}

export default ViewSingleDiscount