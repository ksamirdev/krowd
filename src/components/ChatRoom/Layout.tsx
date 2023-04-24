import React, { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import ChatsList from "./ChatsList";
import { api } from "@/utils/api";

import { type Socket, io } from "socket.io-client";
import { type Messages } from "@prisma/client";
import { useSession } from "next-auth/react";
import ActiveUsers from "./ActiveUsers";

export type ExtendedMessage = Messages & {
  author: {
    name: string | null;
    image: string | null;
  };
};

export default function Layout() {
  const { data, isLoading } = api.messages.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const { data: sessionData } = useSession();
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);

  useEffect(() => {
    if (!isLoading && data) {
      setMessages(data);
    }
  }, [isLoading, data]);

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!sessionData) return;

    const socket = io("ws://localhost:3001", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      socket.emit("user", sessionData?.user);
    });

    socket.on("message", (data: ExtendedMessage) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    setSocket(socket);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [sessionData]);

  return (
    <div className="flex select-none flex-col rounded-xl  border-2 border-pink-700 p-5 max-sm:max-h-[80vh] max-sm:min-h-[80vh] max-sm:min-w-[95vw] max-sm:max-w-[95vw] sm:max-h-[80vh] sm:min-h-[80vh] sm:min-w-[95vw] sm:max-w-[95vw] md:max-h-[60vh] md:min-h-[60vh] md:min-w-[80vw] md:max-w-[80vw] lg:max-h-[60vh] lg:min-h-[60vh] lg:min-w-[80vw] lg:max-w-[80vw] xl:max-h-[70vh] xl:min-h-[70vh] xl:min-w-[60vw] xl:max-w-[60vw]">
      <span className="flex flex-col items-center">
        <span className="text-center text-xl">Neobrains Chat</span>
        <ActiveUsers socket={socket} />
      </span>
      <ChatsList data={messages} />
      <ChatInput socket={socket} />
    </div>
  );
}
