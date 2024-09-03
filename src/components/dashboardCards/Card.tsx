import React, { ReactNode } from "react";
interface CardDataStatsProps {
  title: string;
  data: any;
  children: ReactNode;
}

const Card: React.FC<CardDataStatsProps> = ({
  title,
  data,
  children

}) => {
  return (
    <div className="rounded-md border border-stroke bg-white px-7.5 py-6 shadow-default ">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-blue-400 text-white">
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black ">
            {title?.replace(/_/g, ' ')}
          </h4>

          {typeof data === 'object' ? Object.entries(data).map(([status, value]: any, key) => (
            <span key={key} style={{
              fontWeight: "bold",
              color: status == "Completed" ?
                "green" : status == "Pending" ?
                  "orange" : status == "Failed" ? "red"
                    : '#5762ff'
            }}
              className="text-sm font-medium text-black text-red-500">
              <br />
              {status?.replace(/_/g, ' ')} - {value}
            </span>
          )) : <span className="text-sm font-medium text-black text-red-500"><br />
            {console.log("datadatadatadatadata", data)}
            {title?.replace(/_/g, ' ')} - {data}
          </span>}
          
        </div>

      </div>
    </div>
  );
};

export default Card;
