"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { format } from "date-fns";

interface RoomTypeDetails {
  id: number;
  category: string;
  primary_image: any[];
  room_images: any[];
  size: number;
  bed: number;
  occupancy: string;
  mountain: any[];
  lake: any[];
}

const ViewRoomType = () => {
  const searchParams = useSearchParams();
  const [roomType, setRoomType] = useState<RoomTypeDetails | null>(null);
  let roomTypeId = searchParams.get("roomTypeID");

  useEffect(() => {
    const fetchOffer = async () => {
      if (roomTypeId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/room_type/${roomTypeId}`,
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
            roomTypeData.room_images = roomTypeData.room_images.map(
              (image: string) => image.replace("data:image/png;base64,", ""),
            );
            roomTypeData.mountain = roomTypeData.mountain.map((image: string) =>
              image.replace("data:image/png;base64,", ""),
            );
            roomTypeData.lake = roomTypeData.lake.map((image: string) =>
              image.replace("data:image/png;base64,", ""),
            );

            setRoomType(roomTypeData);
          }

          console.log("RESPONSE", response);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchOffer();
  }, [roomTypeId]);

  return (
    <div className=" ">
      <div className="rounded-lg bg-white p-4">
        <div className="border-b-2 border-gray text-2xl font-bold text-black">
          Detail
        </div>
        <div className="mt-4 flex flex-col justify-center">
          {roomType ? (
            <>
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">id</div>
                </div>
                <div className="flex-1">
                  <div className="m-2">{roomType.id}</div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">Category</div>
                </div>
                <div className="flex-1">
                  <div className="m-2">{roomType.category}</div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">Size</div>
                </div>
                <div className="flex-1">
                  <div className="m-2">{roomType.size}</div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">Bed</div>
                </div>
                <div className="flex-1">
                  <div className="m-2">{roomType.bed}</div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">Occupancy</div>
                </div>
                <div className="flex-1">
                  <div className="m-2">{roomType.occupancy}</div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">Primary Images</div>
                </div>
                <div className="flex-1">
                  <div className="min-w-[200px] overflow-x-auto py-4">
                    <div className="flex items-center gap-2">
                      {roomType.primary_image?.map(
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
                              alt={roomType.category}
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
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">Room Images</div>
                </div>
                <div className="flex-1">
                  <div className="min-w-[200px] overflow-x-auto py-4">
                    <div className="flex items-center gap-2">
                      {roomType.room_images?.map(
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
                              alt={roomType.category}
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
              </div>{" "}
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">Mountain Images</div>
                </div>
                <div className="flex-1">
                  <div className="min-w-[200px] overflow-x-auto py-4">
                    <div className="flex items-center gap-2">
                      {roomType.mountain?.map(
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
                              alt={roomType.category}
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
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">Lake Images</div>
                </div>
                <div className="flex-1">
                  <div className="min-w-[200px] overflow-x-auto py-4">
                    <div className="flex items-center gap-2">
                      {roomType.primary_image?.map(
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
                              alt={roomType.category}
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

export default ViewRoomType;
