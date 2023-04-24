import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";

import ChatRoom from "../components/ChatRoom";
import Head from "next/head";

const ChatPage: NextPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-900 text-neutral-100 max-sm:justify-start max-sm:pt-4">
      <Head>
        <title>Krowd</title>
        <link rel="shortcut icon" href="krowd.webp" type="image/x-icon" />
      </Head>
      <AuthSession />
    </div>
  );
};

const AuthSession: React.FC = () => {
  const { status } = useSession();
  return (
    <div>
      {status === "authenticated" ? (
        <ChatRoom />
      ) : (
        <button onClick={() => void signIn("discord")}>Login</button>
      )}
    </div>
  );
};

export default ChatPage;
