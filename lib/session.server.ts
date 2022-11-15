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
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
  },
});

export let { getSession, commitSession, destroySession } = sessionStorage;
