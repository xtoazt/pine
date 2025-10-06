import { StackServerApp, StackClientApp } from "@stackframe/stack"

// Server-side Stack Auth instance
export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/auth/signin",
    afterSignIn: "/",
    afterSignOut: "/",
    afterSignUp: "/",
    signUp: "/auth/signup",
  },
})

// Client-side Stack Auth instance
export const stackClientApp = new StackClientApp({
  tokenStore: "cookie",
  urls: {
    signIn: "/auth/signin",
    afterSignIn: "/",
    afterSignOut: "/",
    afterSignUp: "/",
    signUp: "/auth/signup",
  },
})
