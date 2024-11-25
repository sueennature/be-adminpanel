"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { format } from "date-fns";

interface RoomHomeDetails {
  id: number;
  category: string;
  primary_image: any[];
}

const ViewRoomHome = () => {
  const searchParams = useSearchParams();
  const [roomHome, setRoomHome] = useState<RoomHomeDetails | null>(null);
  let roomHomeId = searchParams.get("roomHomeID");

  useEffect(() => {
    const fetchRoomHome = async () => {
      if (roomHomeId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/room_home/${roomHomeId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );

          if (response.data.data) {
            const roomTypeData = response.data.data;
            roomTypeData.primary_image = roomTypeData.primary_image.map(
              (image: string) => image.replace("data:image/png;base64,", ""),
            );

            setRoomHome(roomTypeData);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchRoomHome();
  }, [roomHomeId]);

  return (
    <div className=" ">
      <div className="rounded-lg bg-white p-4">
        <div className="border-b-2 border-gray text-2xl font-bold text-black">
          Detail
        </div>
        <div className="mt-4 flex flex-col justify-center">
          {roomHome ? (
            <>
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">id</div>
                </div>
                <div className="flex-1">
                  <div className="m-2">{roomHome.id}</div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">Category</div>
                </div>
                <div className="flex-1">
                  <div className="m-2">{roomHome.category}</div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">Primary Images</div>
                </div>
                <div className="flex-1">
                  <div className="min-w-[200px] overflow-x-auto py-4">
                    <div className="flex items-center gap-2">
                      {roomHome.primary_image?.map(
                        (
                          image: string | StaticImport,
                          index: React.Key | null | undefined,
                        ) => (
                          <div
                            key={index}
                            className="h-20 w-20 flex-shrink-0 overflow-hidden"
                          >
                            <Image
                              src={`${process.env.BE_URL}/${image}`}
                              alt={roomHome.category}
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

export default ViewRoomHome;
