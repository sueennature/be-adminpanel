"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import flower from "../../../../public/images/flower.jpg";
import axios from "axios";
import Cookies from "js-cookie";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useAuthRedirect } from "@/utils/checkToken";



const ViewSingleAdditionalServices = () => {
  const searchParams = useSearchParams();
  const [additionalService, setAdditionalService] = React.useState<any>([]);
  useAuthRedirect()

  let additionalServiceId = searchParams.get("additionalServiceID");
  console.log(additionalServiceId);

  useEffect(() => {
    const fetchAdditionalService = async () => {
      if (additionalServiceId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/additional-services/${additionalServiceId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );
          console.log(response.data);
          setAdditionalService(response.data);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchAdditionalService();
  }, [additionalServiceId]);

  return (
    <div className=" ">
      <div className="rounded-lg bg-white p-4">
        <div className="border-b-2 border-gray text-2xl font-bold text-black">
          Detail
        </div>
        <div className="mt-4 flex flex-col  justify-center">
        {additionalService ? (
          <>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">id</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{additionalService.id}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Additional Service Name</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{additionalService.name}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Description</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{additionalService.description}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Amount</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{additionalService.price}</div>
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

export default ViewSingleAdditionalServices;
