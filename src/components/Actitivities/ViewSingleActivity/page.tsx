"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import flower from "../../../../public/images/flower.jpg";
import axios from "axios";
import Cookies from "js-cookie";

interface ActivityData {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ViewSingleActivity = () => {
  const searchParams = useSearchParams();
  const [activity, setActivity] = React.useState<ActivityData | null>(null);

  let activityId = searchParams.get("activityID");
  console.log(activityId);

  useEffect(() => {
    const fetchUser = async () => {
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

    fetchUser();
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
              {/* <div className="m-2">{activity.image}</div> */}
            </div>
            <div className="flex-1">
              <div className="m-2">
                {/* <Image
                  src={activity.image}
                  alt={activity.image}
                  width={100}
                  height={100}
                /> */}
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

export default ViewSingleActivity;
