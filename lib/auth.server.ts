import { sessionStorage } from "lib/session.server";
import { Authenticator } from "remix-auth";
import { DiscordStrategy } from "remix-auth-socials";
import { db } from "./db.server";
import { env } from "./env.server";

export const authenticator = new Authenticator<{ id: string }>(sessionStorage);

authenticator.use(
  new DiscordStrategy(
    {
      clientID: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      callbackURL: env.DISCORD_CALLBACK_URL,
      scope: ["identify"],
    },
    async (user) => {
      const { id } = await db.user.upsert({
        where: {
          provider_provider_id: {
            provider: user.profile.provider,
            provider_id: user.profile.id,
          },
        },
        update: {},
        create: {
          provider: user.profile.provider,
          provider_id: user.profile.id,
        },
      });

      return { id };
    }
  )
);
