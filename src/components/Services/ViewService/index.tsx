"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { format } from "date-fns";

interface OfferData {
  id: string;
  title: string;
  sub_title: string;
  description: string;
  features: string;
  details: {
    title: string;
    content: string;
  }[];
  image: string[];
}

const ViewService = () => {
  const searchParams = useSearchParams();
  const [service, setService] = useState<OfferData | null>(null);
  let serviceID = searchParams.get("serviceID");

  useEffect(() => {
    const fetchService = async () => {
      if (serviceID) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/services/${serviceID}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );

          if (response.data) {
            const offerData = response.data;
            offerData.image = offerData.image.map((image: string) =>
              image.replace("data:image/png;base64,", ""),
            );

            setService(offerData);
          }

          console.log("RESPONSE", response);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchService();
  }, [serviceID]);

  console.log("OFFERR", service);

  return (
    <div className=" ">
      <div className="rounded-lg bg-white p-4">
        <div className="border-b-2 border-gray text-2xl font-bold text-black">
          Detail
        </div>
        <div className="mt-4 flex flex-col justify-center">
          {service ? (
            <>
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">id</div>
                </div>
                <div className="flex-1">
                  <div className="m-2">{service.id}</div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">Title</div>
                </div>
                <div className="flex-1">
                  <div className="m-2">{service.title}</div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">Subtitle</div>
                </div>
                <div className="flex-1">
                  <div className="m-2">{service.sub_title}</div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">Description</div>
                </div>
                <div className="flex-1">
                  <div className="m-2">{service.description}</div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">Features</div>
                </div>
                <div className="flex-1">
                  <div className="m-2">{service.features}</div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">Details</div>
                </div>
                <div className="flex-1">
                  {service.details && (
                    <table className="border-gray-200 table-auto border-collapse border">
                      <thead>
                        <tr>
                          <th className="border-gray-300 border px-4 py-2">
                            Title
                          </th>
                          <th className="border-gray-300 border px-4 py-2">
                            Content
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {service.details?.map((detail, index) => (
                          <tr key={index}>
                            <td className="border-gray-300 border px-4 py-2">
                              {detail.title}
                            </td>
                            <td className="border-gray-300 border px-4 py-2">
                              {detail.content}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              <div className="flex">
                <div className="flex-1">
                  <div className="m-2">Image</div>
                </div>
                <div className="flex-1">
                  <div className="min-w-[200px] overflow-x-auto py-4">
                    <div className="flex items-center gap-2">
                      {service.image?.map(
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
                              alt={service.title}
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

export default ViewService;
