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
  start_date: Date;
  end_date: Date;
  description: string;
  offer_image: string[];
}

const ViewOffer = () => {
  const searchParams = useSearchParams();
  const [offer, setOffer] = useState<OfferData | null>(null);
  let offerId = searchParams.get("offerID");

  useEffect(() => {
    const fetchOffer = async () => {
      if (offerId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/offers/${offerId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );

          if(response.data.data){
            const offerData = response.data.data;
            offerData.offer_image = offerData.offer_image.map((image: string) =>
                image.replace('data:image/png;base64,', '')
            );

            setOffer(offerData);
          }

          console.log("RESPONSE", response)

        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchOffer();
  }, [offerId]);

  console.log("OFFERR", offer)

  return (
    <div className=' '>
      <div className='bg-white p-4 rounded-lg'>
        <div className='text-black text-2xl font-bold border-b-2 border-gray'>
          Detail
        </div>
        <div className='flex flex-col mt-4 justify-center'>
          {offer ? (
            <>
              <div className='flex'>
                <div className='flex-1'>
                  <div className='m-2'>id</div>
                </div>
                <div className='flex-1'>
                  <div className='m-2'>{offer.id}</div>
                </div>
              </div>
              <div className='flex'>
                <div className='flex-1'>
                  <div className='m-2'>Title</div>
                </div>
                <div className='flex-1'>
                  <div className='m-2'>{offer.title}</div>
                </div>
              </div>
              <div className='flex'>
                <div className='flex-1'>
                  <div className='m-2'>Description</div>
                </div>
                <div className='flex-1'>
                  <div className='m-2'>{offer.description}</div>
                </div>
              </div>
                            <div className='flex'>
                <div className='flex-1'>
                  <div className='m-2'>Start Date</div>
                </div>
                <div className='flex-1'>
                  <div className='m-2'>   {offer.start_date ? format(new Date(offer.start_date), "yyyy-MM-dd") : 'N/A'}</div>
                </div>
              </div>
              <div className='flex'>
                <div className='flex-1'>
                  <div className='m-2'>End Date</div>
                </div>
                <div className='flex-1'>
                  <div className='m-2'>   {offer.end_date ? format(new Date(offer.end_date), "yyyy-MM-dd") : 'N/A'}</div>
                </div>
              </div>
              <div className='flex'>
                <div className='flex-1'>
                  <div className="m-2">Image</div>
                </div>
                <div className='flex-1'>
                  <div className="min-w-[200px] overflow-x-auto py-4">
                    <div className="flex items-center gap-2">
                      {offer.offer_image?.map(
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
                              alt={offer.title}
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

export default ViewOffer;
