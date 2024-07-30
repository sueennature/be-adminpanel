"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import flower from "../../../../public/images/flower.jpg";
import axios from "axios";
import Cookies from "js-cookie";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface NewsData {
  id: number;
  title: string;
  content: string;
  image:[];
}

const ViewSingleNews = () => {

  const searchParams = useSearchParams();
 
  const [news, setNews] = React.useState<any>(null);

  let newsId = searchParams.get("newsID");
  console.log(newsId);

  useEffect(() => {
    const fetchNews = async () => {
      if (newsId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/news/${newsId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );
          console.log(response.data.data);
          setNews(response.data.data);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchNews();
  }, [newsId]);

  return (
    <div className=' '>
      <div className='bg-white p-4 rounded-lg'>
        <div className='text-black text-2xl font-bold border-b-2 border-gray'>
          Detail
        </div>
      <div className='flex flex-col mt-4  justify-center'>
      {news ? (
          <>
      <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>id</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>{news?.id}</div>
           </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Title</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>{news?.title}</div>
           </div>
        </div>
       
        <div className='flex'>
          <div className='flex-1'>   
            <div className='m-2'>Content</div>
          </div>
          <div className='flex-1'>     
            <div className='m-2'>{news?.content}</div>
           </div>
        </div>

      
        <div className='flex'>
          <div className='flex-1'>   
              <div className="m-2">Image</div>
          </div>
          <div className='flex-1'>     
            {/* <div className='m-2'>
            <Image
                  src={image}
                  alt={news.title}
                  width={100}
                  height={100}
                />                           

            </div> */}
            <div className="min-w-[200px] overflow-x-auto py-4">
                <div className="flex items-center gap-2">
                  {news.images?.map(
                    (
                      image: string | StaticImport,
                      index: React.Key | null | undefined,
                    ) => (
                      <div
                        key={index}
                        className="h-20 w-20 flex-shrink-0 overflow-hidden"
                      >
                        <Image
                          src={image}
                          alt={news.title}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>
           </div> 
        </div>
        </>
        ) : (
          <p>Loading...</p>
        )} 
      </div>
      </div>
    </div>
  );
};

export default ViewSingleNews