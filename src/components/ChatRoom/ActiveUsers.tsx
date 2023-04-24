import { type User } from "next-auth";
import React, { useEffect, useState } from "react";
import { type Socket } from "socket.io-client";
import { RxDotFilled } from "react-icons/rx";
export default function ActiveUsers({ socket }: { socket: Socket | null }) {
  const [activeUsers, setActiveUsers] = useState<User[] | null>([]);

  useEffect(() => {
    if (socket) {
      socket.on("user", (data: User) => {
        console.log(data);
        setActiveUsers((prev) => {
          if (prev && prev.findIndex((d) => d.id === data.id) !== -1) {
            return [...prev];
          } else {
            return !prev ? [data] : [data, ...prev];
          }
        });
      });
    }
  }, [socket]);
  return (
    <div className="fles-row flex items-center gap-4">
      {activeUsers ? (
        <>
          {activeUsers.map((val) => (
            <span key={val.id} className="inline-flex items-center">
              <RxDotFilled className="text-green-500" /> {val.name}
            </span>
          ))}
        </>
      ) : (
        <span>No Active User</span>
      )}
    </div>
  );
}
