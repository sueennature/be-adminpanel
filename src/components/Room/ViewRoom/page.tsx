"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

const ViewRoom = () => {
  const searchParams = useSearchParams();
  const [roomData, setRoomData] = React.useState<any>("");

  let roomId = searchParams.get("roomID");
  console.log(roomId);

  useEffect(() => {
    const fetchRooms = async () => {
      if (roomId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/rooms/${roomId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );
          console.log(response.data);
          setRoomData(response.data);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchRooms();
  }, [roomId]);
  return (
    <div className=" ">
      <div className="rounded-lg bg-white p-4">
        <div className="border-b-2 border-gray text-2xl font-bold text-black">
          Detail
        </div>
        <div className="mt-4 flex flex-col  justify-center">
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">id</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{roomData.id}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Name</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{roomData.name}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Max Adults</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{roomData.max_adults}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Max Children</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{roomData.max_childs}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Max People</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{roomData.max_people}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Description</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{roomData.description}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Category</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{roomData.category}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Second Category</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{roomData.secondary_category}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Room Only</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{(roomData.room_only)?.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Break fast</div>
            </div>
            <div className="flex-1">
              <div className="m-2">
                {(roomData.bread_breakfast)?.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Half board</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{(roomData.half_board)?.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Full board</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{(roomData.full_board)?.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Beds</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{roomData.beds}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Features</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{roomData.features}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Size</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{roomData.size}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Images</div>
            </div>
            <div className="flex-1">
              <div className="min-w-[200px] overflow-x-auto py-4">
                <div className="flex items-center gap-2">
                  {roomData.images?.map(
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
                          alt={roomData.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>{" "}
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Bathroom</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{roomData.bathroom}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRoom;
