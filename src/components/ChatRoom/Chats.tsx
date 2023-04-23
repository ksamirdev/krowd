import React, { useEffect } from "react";

import { type Messages } from "@prisma/client";

type ExtendedMessage = Messages & {
  author: {
    name: string | null;
  };
};

export default function Chats({
  data,
}: {
  data: ExtendedMessage[] | undefined;
}) {
  useEffect(() => {
    const div = document.getElementById("chats");
    if (!div) return;

    div.scrollBy({ top: div.offsetHeight });
  }, []);

  useEffect(() => {
    const div = document.getElementById("chats");
    if (!div) return;

    div.scrollBy({ top: div.offsetHeight });
  }, [data]);

  return (
    <div className=" max-h-full  overflow-y-scroll" id="chats">
      <div className="my-2 flex max-h-full flex-grow flex-col  items-start justify-end ">
        {data && data.length ? (
          <>
            {data.map((data) => (
              <span key={data.id} className="break-words">
                {data.author.name}: {data.message}
              </span>
            ))}
          </>
        ) : (
          <span>No messages</span>
        )}
      </div>
    </div>
  );
}
