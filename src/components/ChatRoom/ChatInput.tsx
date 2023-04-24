import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { type Socket } from "socket.io-client";
import { type ExtendedMessage } from "./Layout";

export default function ChatInput({ socket }: { socket: Socket | null }) {
  const [value, setValue] = useState("");
  const { data, status } = useSession();

  const mutation = api.messages.createMessage.useMutation();

  const [isDisabled, setIsDisabled] = useState(true);
  const [sentTimes, setSendTimes] = useState(0);

  const handleMessage = () => {
    if (isDisabled) return;

    if (value.trim().length && status === "authenticated") {
      setSendTimes(sentTimes + 1);

      mutation.mutate(
        {
          userId: data.user.id,
          message: value.trim(),
        },
        {
          onSuccess(data) {
            websocketData(data);
          },
        }
      );

      setValue("");
    }
  };

  useEffect(() => {
    if (sentTimes >= 3) {
      setIsDisabled(true);

      setTimeout(() => {
        setSendTimes(0);
        setIsDisabled(false);
      }, 5000);
    }
  }, [sentTimes]);

  function websocketData(mutatedData: ExtendedMessage) {
    if (!socket) return;
    socket.emit("message", mutatedData);
  }

  useEffect(() => {
    if (socket && socket.connected) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [socket]);

  return (
    <div className="mt-auto w-full">
      <input
        disabled={isDisabled}
        type="text"
        placeholder={isDisabled ? "Please hold on" : "Enter you message!"}
        className="w-full rounded-lg border-2 border-neutral-100 bg-transparent px-2 py-2 duration-200 focus:border-pink-600 focus:outline-none"
        value={value}
        onChange={({ currentTarget }) => setValue(currentTarget.value)}
        onKeyDown={(ev) => {
          if (ev.code === "Enter") {
            handleMessage();
          }
        }}
      />
    </div>
  );
}
