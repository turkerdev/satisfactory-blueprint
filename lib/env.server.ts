import { z } from "zod";

const schema = z.object({
  SESSION_SECRETS: z.string().transform((value) => value.split(",")),
  NODE_ENV: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CALLBACK_URL: z.string().url(),
  CF_ACCOUNT_ID: z.string(),
  CF_ACCESS_ID: z.string(),
  CF_ACCESS_SECRET: z.string(),
  CF_BUCKET: z.string(),
  CF_PUBLIC_URL: z.string().url(),
});

export const env = schema.parse(process.env);
