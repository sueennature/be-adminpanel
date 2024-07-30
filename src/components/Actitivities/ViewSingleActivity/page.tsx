"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import flower from "../../../../public/images/flower.jpg";
import axios from "axios";
import Cookies from "js-cookie";
import { StaticImport } from "next/dist/shared/lib/get-img-props";



const ViewSingleActivity = () => {
  const searchParams = useSearchParams();
  const [activity, setActivity] = React.useState<any>([]);

  let activityId = searchParams.get("activityID");
  console.log(activityId);

  useEffect(() => {
    const fetchActivity = async () => {
      if (activityId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/activities/${activityId}`,
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
  }, [activityId]);

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
              <div className="m-2">Activity Name</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{activity.name}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Description</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{activity.description}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Amount</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{activity.price}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
            <div className="m-2">Images</div>
            </div>
            <div className="flex-1">
            <div className="min-w-[200px] overflow-x-auto py-4">
            <div className="flex items-center gap-2">
                              {activity.images?.map((image:any, index :any) => (
                                <div
                                  key={index}
                                  className="h-20 w-20 flex-shrink-0 overflow-hidden"
                                >
                                  <Image
                                    src={image}
                                    alt={activity.name}
                                    width={80}
                                    height={80}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ))}
                            </div> 
              </div>{" "}
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

export default ViewSingleActivity;
