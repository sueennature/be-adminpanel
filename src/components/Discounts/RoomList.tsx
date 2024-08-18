// components/RoomList.tsx

import React, { useEffect, useState } from 'react';
import { Chip, Stack } from '@mui/material';

interface RoomListProps {
    rooms: any;
}

const RoomList: React.FC<RoomListProps> = ({ rooms }) => {
    console.log("roomsroomsroomsroomsroomsrooms", rooms)
    const [data, setData] = useState([])
    useEffect(() => {
        setData(rooms)
    }, [rooms])
    return (
        <div>
           {rooms?.length > 0 &&
             <div>
                <div className="mb-4 text-xl font-bold text-black">
                    Available Rooms
                </div>
                <Stack direction="row" spacing={1} style={{ marginBottom: 20 }}>
                    {data?.map((room: any, key: any) => (
                        <Chip
                            key={key}
                            label={room?.room_number || ""}

                        />
                    ))}
                </Stack>
            </div>
           }

        </div>

    );
};

export default RoomList;
