import React, { useEffect } from "react";
import Chats from "./Chats";

import { type ExtendedMessage } from "./Layout";

export default function ChatsList({
  data,
}: {
  data: ExtendedMessage[] | undefined;
}) {
  useEffect(() => {
    if (data) {
      const div = document.getElementById("chats-container");
      const chats = document.getElementById("chats");
      if (!div || !chats) return;
      if (chats.children.length === data.length) {
        setTimeout(() => {
          div.scrollBy(0, div.scrollHeight);
        }, 20);
      }
    }
  }, [data]);

  return (
    <div
      className="my-5 max-h-full overflow-y-scroll scroll-smooth"
      id="chats-container"
    >
      <div
        className=" flex max-h-full flex-grow flex-col  items-start justify-end gap-3"
        id="chats"
      >
        {data && data.length ? (
          <>
            {data.map((value, id) => {
              return <Chats data={value} key={id} />;
            })}
          </>
        ) : (
          <span>No messages</span>
        )}
      </div>
    </div>
  );
}
