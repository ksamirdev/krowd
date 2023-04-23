import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";

import ChatRoom from "../components/ChatRoom";

const ChatPage: NextPage = () => {
  return (
    <div className="grid h-screen w-screen place-content-center bg-neutral-900 text-neutral-100">
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
