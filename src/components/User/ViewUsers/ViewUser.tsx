'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from "next/navigation";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useAuthRedirect } from '@/utils/checkToken';

interface UserDataProps {
  username: string;
  email: string;
  role: string;
  id: number;
  is_active: boolean;
  is_superadmin: boolean;
}

const ViewSingleUser = () => {
  const searchParams = useSearchParams();
  useAuthRedirect();
  const [userData, setUserData] = React.useState<UserDataProps | null>(null);

  let userId = searchParams.get("userID");
  console.log(userId)
  useEffect(() => {
    const fetchUser = async () => {
    
      if (userId) {
        try {
          const accessToken = Cookies.get('access_token'); 

          const response = await axios.get(`${process.env.BE_URL}/users/${userId}`, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                  'x-api-key': process.env.X_API_KEY, 
              },
          });
          console.log(response.data);
          setUserData(response.data);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div className=' '>
      <div className='bg-white p-4 rounded-lg'>
        <div className='text-black text-2xl font-bold border-b-2 border-gray'>
          Detail
        </div>
        <div className='flex flex-col mt-4  justify-center'>
          {userData ? (
            <>
              <div className='flex'>
                <div className='flex-1'>   
                  <div className='m-2'>ID</div>
                </div>
                <div className='flex-1'>     
                  <div className='m-2'>{userData.id}</div>
                </div>
              </div>
              <div className='flex'>
                <div className='flex-1'>   
                  <div className='m-2'>Username</div>
                </div>
                <div className='flex-1'>     
                  <div className='m-2'>{userData.username}</div>
                </div>
              </div>
              <div className='flex'>
                <div className='flex-1'>   
                  <div className='m-2'>Email</div>
                </div>
                <div className='flex-1'>     
                  <div className='m-2'>{userData.email}</div>
                </div>
              </div>
              <div className='flex'>
                <div className='flex-1'>   
                  <div className='m-2'>Role</div>
                </div>
                <div className='flex-1'>     
                  <div className='m-2'>{userData.role}</div>
                </div>
              </div>
              <div className='flex'>
                <div className='flex-1'>   
                  <div className='m-2'>Active</div>
                </div>
                <div className='flex-1'>     
                  <div className='m-2'>{userData.is_active ? "Yes" : "No"}</div>
                </div>
              </div>
              <div className='flex'>
                <div className='flex-1'>   
                  <div className='m-2'>SuperAdmin</div>
                </div>
                <div className='flex-1'>     
                  <div className='m-2'>{userData.is_superadmin ? "Yes" : "No"}</div>
                </div>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewSingleUser
