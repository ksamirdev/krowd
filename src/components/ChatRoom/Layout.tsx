import React, { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import Chats from "./Chats";
import { api } from "@/utils/api";
import { type Socket, io } from "socket.io-client";
import { type Messages } from "@prisma/client";

type ExtendedMessage = Messages & {
  author: {
    name: string | null;
  };
};

export default function Layout() {
  const { data, isLoading } = api.messages.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const [messages, setMessages] = useState<ExtendedMessage[]>([]);

  useEffect(() => {
    if (!isLoading && data) {
      setMessages(data);
    }
  }, [isLoading, data]);

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!process.env.WEBSOCKET_URL)
      return console.error("Websocked did not found!");
    const socket = io(process.env.WEBSOCKET_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("connected to WebSocket server");
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
  }, []);
  return (
    <div className="flex max-h-[50vh]  min-h-[50vh] min-w-[50vw]  max-w-[50vw] flex-col rounded-xl border-2 border-pink-700 p-5">
      <span className="text-center text-xl">Neobrains Chat</span>

      <Chats data={messages} />
      <ChatBox socket={socket} />
    </div>
  );
}
