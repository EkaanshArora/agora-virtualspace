import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { RtcRole, RtcTokenBuilder, RtmRole, RtmTokenBuilder } from "agora-access-token";
import { env } from "../../../env/server.mjs";
import { TRPCError } from "@trpc/server";

const roomSchema = z.object({
  name: z.string().min(3).max(30),
  description: z.string().max(150).nullish(),
  stageName: z.string(),
});

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
    return {
      greeting: `Hello ${input.text}`,
    };
  }),
  createRoom: protectedProcedure.input(roomSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.room.create({
      data: {
        name: input.name,
        description: input.description,
        userId: ctx.session.user.id,
        stageName: input.stageName,
      },
    });
  }),
  getAllRooms: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.room.findMany();
  }),
  getRoom: protectedProcedure
    .input(z.object({ roomId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.room.findFirst({
        where: {
          roomId: input.roomId,
        },
      });
    }),
  getToken: protectedProcedure
    .input(z.object({ channel: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
      });
      if (!user) throw new TRPCError({ code: "FORBIDDEN" });
      const id = user.numericId;
      const rtc = RtcTokenBuilder.buildTokenWithUid(
        env.NEXT_PUBLIC_APP_ID,
        env.APP_CERTIFICATE,
        input.channel,
        id,
        RtcRole.PUBLISHER,
        Math.floor(Date.now() / 1000) + 6000
      );
      const rtm = RtmTokenBuilder.buildToken(
        env.NEXT_PUBLIC_APP_ID,
        env.APP_CERTIFICATE,
        String(id),
        RtmRole.Rtm_User,
        Math.floor(Date.now() / 1000) + 6000
      );
      return { rtc, rtm, agoraId: id };
    }),
  getUserName: protectedProcedure
    .input(z.object({ agoraId: z.number() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { numericId: input.agoraId },
      });
      if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return { name: user.name };
    }),
});
