"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";

const ViewSingleAgent = () => {
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agentID");
  const [agent, setAgent] = React.useState<any>([]);

  useEffect(() => {
    const fetchDiscount = async () => {
      if (agentId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/agents/${agentId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );
          console.log(response.data);
          setAgent(response.data);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchDiscount();
  }, [agentId]);
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
              <div className="m-2">{agent.id}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">First Name</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{agent.first_name}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Last Name</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{agent.last_name}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Email</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{agent.email}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Address</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{agent.address}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Telephone</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{agent.telephone}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Nationality</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{agent.nationality}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSingleAgent;
