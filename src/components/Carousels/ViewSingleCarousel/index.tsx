"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import flower from "../../../../public/images/flower.jpg";
import axios from "axios";
import Cookies from "js-cookie";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useAuthRedirect } from "@/utils/checkToken";



const ViewSingleCarousel = () => {
  const searchParams = useSearchParams();
  const [activity, setActivity] = React.useState<any>([]);

  let carouselId = searchParams.get("carouselID");

useAuthRedirect();
  useEffect(() => {
    const fetchActivity = async () => {
      if (carouselId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/carousels/${carouselId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );
          console.log(response.data.data);
          setActivity(response.data.data);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchActivity();
  }, [carouselId]);

  return (
    <div className=" ">
      <div className="rounded-lg bg-white p-4">
        <div className="border-b-2 border-gray text-2xl font-bold text-black">
          Detail
        </div>
        <div className="mt-4 flex flex-col  justify-center">
        {activity ? (
          <>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">id</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{activity.id}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Title</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{activity.title}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Tags</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{activity?.tags ? activity.tags:'N/A'}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Media Type</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{activity.media_type}</div>
            </div>
          </div>
       
          <div className="flex">
            <div className="flex-1">
            <div className="m-2">Images</div>
            </div>
            <div className="flex-1 ">
  <div className=" overflow-x-auto py-4">
    <div className="flex flex-col sm:flex-row items-start gap-2">
      {activity.media_urls?.map((image: any, index: any) => (
        <div
          key={index}
          className="h-20 w-20 overflow-hidden"
        >
          <Image
            src={`https://api.sueennature.com/${image}`}
            alt="Image description"
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
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

export default ViewSingleCarousel;
