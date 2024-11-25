"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import flower from "../../../../public/images/flower.jpg";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";

const ViewSingleGuest = () => {
  const searchParams = useSearchParams();
  const guestId = searchParams.get("guestID");
  const [guest, setGuest] = React.useState<any>([]);

  useEffect(() => {
    const fetchDiscount = async () => {
      if (guestId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/guests/guest/${guestId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );
          console.log(response.data);
          setGuest(response.data);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchDiscount();
  }, [guestId]);
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
              <div className="m-2">{guest.id}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">First Name</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{guest.first_name}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Last Name</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{guest.last_name}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Email</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{guest.email}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Address</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{guest.address}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Telephone</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{guest.telephone}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Nationality</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{guest.nationality}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Gender</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{guest.gender}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Identification Type</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{guest.identification_type}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Identification No</div>
            </div>
            <div className="flex-1">
              <div className="m-2">{guest.identification_no}</div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Identification Issued Date</div>
            </div>
            <div className="flex-1">
              <div className="m-2">
                {guest.identification_issue_date
                  ? format(
                      new Date(guest.identification_issue_date),
                      "yyyy-MM-dd",
                    )
                  : "N/A"}
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Date of Birth</div>
            </div>
            <div className="flex-1">
              <div className="m-2">
                {guest.dob ? format(new Date(guest.dob), "yyyy-MM-dd") : "N/A"}
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="flex-1">
              <div className="m-2">Profile Image</div>
            </div>
            <div className="flex-1">
              <div className="m-2">
                {guest.profile_image?.map((image: any, index: any) => (
                  <div
                    key={index}
                    className="h-20 w-20 flex-shrink-0 overflow-hidden"
                  >
                    <Image
                      src={`${process.env.BE_URL}/${image}`} // Ensure the URL is correct
                      alt={guest.first_name}
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
      </div>
    </div>
  );
};

export default ViewSingleGuest;
