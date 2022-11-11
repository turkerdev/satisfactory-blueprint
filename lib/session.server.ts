import { createCookieSessionStorage } from "@remix-run/node";
import { env } from "./env.server";

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_s",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: env.SESSION_SECRETS,
    secure: env.NODE_ENV === "production",
  },
});

export let { getSession, commitSession, destroySession } = sessionStorage;
