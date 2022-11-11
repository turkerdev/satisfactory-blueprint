import { sessionStorage } from "lib/session.server";
import { Authenticator } from "remix-auth";
import { DiscordStrategy } from "remix-auth-socials";
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
      console.log(user);
      return { id: user.profile.id };
    }
  )
);
