import React, { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { MdDelete } from "react-icons/md";
import { type ExtendedMessage } from "./Layout";

export default function Chats({ data }: { data: ExtendedMessage }) {
  const [isAbove, setIsAbove] = useState(false);

  const handleMouseOver = () => {
    setIsAbove(true);
  };
  const handleMouseOut = () => {
    setIsAbove(false);
  };

  return (
    <span
      className="flex w-full flex-row items-center  gap-3"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <Image
        src={data.author.image ?? ""}
        alt={data.id}
        height={50}
        width={50}
        className="rounded-full"
        draggable={false}
      />
      <span className="flex flex-col ">
        <div className="flex flex-row items-center gap-3">
          <span className="text-pink-500">{data.author.name}</span>
          <span className="text-xs text-pink-200">
            {dayjs(data.createdAt).day() === dayjs().day()
              ? "Today"
              : dayjs(data.createdAt).format("dddd")}
            {" at "}
            {dayjs(data.createdAt).format("h:m A")}
          </span>
        </div>
        <span className="select-text break-words text-lg">{data.message}</span>
      </span>

      <span className={`ml-auto mr-10 ${!isAbove ? "hidden" : "block"}`}>
        <MdDelete size={25} className="text-pink-500" />
      </span>
    </span>
  );
}
