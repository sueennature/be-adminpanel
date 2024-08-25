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
                <Stack  direction="row" spacing={1} style={{ marginBottom: 20 , overflowX: 'auto', }}>
                    {data?.map((room: any, key: any) => (
                        <div style={{
                            backgroundColor: '#346e41', 
                            color: 'white', 
                            margin: 10, 
                            borderRadius: 10,
                        }}>
                            <div style={{ padding: 10, textAlign:"center" }}>
                                <span style={{fontSize:20, fontWeight:"bold"}}>{room?.room_number || ""} </span><br />
                                <span>{room?.category || ""} </span><br />
                                <span>{room?.secondary_category || ""} </span><br />
                                <span>{room?.views || ""} </span>
                            </div>
                        </div>
                    ))}
                </Stack>
            </div>
           }

        </div>

    );
};

export default RoomList;
