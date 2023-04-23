import { createTRPCRouter } from "@/server/api/trpc";
import { messagesRouter } from "./routers/messages";

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
});

export type AppRouter = typeof appRouter;
