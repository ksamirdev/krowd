import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { type Socket } from "socket.io-client";

export default function ChatBox({ socket }: { socket: Socket | null }) {
  const [value, setValue] = useState("");
  const [connected, setConnected] = useState(false);
  const mutation = api.messages.createMessage.useMutation();
  const { data, status } = useSession();

  const handleMessage = () => {
    if (!socket || !connected) return;

    if (value.trim().length && status === "authenticated") {
      mutation.mutate({
        userId: data.user.id,
        message: value.trim(),
      });

      socket.emit("message", {
        userId: data.user.id,
        message: value.trim(),
        author: {
          name: data.user.name,
        },
      });
      setValue("");
    }
  };

  useEffect(() => {
    if (socket) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [socket]);

  return (
    <div className="mt-auto w-full">
      <input
        disabled={!connected}
        type="text"
        placeholder="Enter you message!"
        className="w-full rounded-lg border-2 border-neutral-100 bg-transparent px-2 py-2 duration-200 focus:border-pink-600 focus:outline-none"
        value={value}
        onChange={({ currentTarget }) => setValue(currentTarget.value)}
        onKeyDown={(ev) => ev.code === "Enter" && handleMessage()}
      />
    </div>
  );
}
