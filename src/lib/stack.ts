import { StackServerApp, StackClientApp } from "@stackframe/stack"

// Check if Stack Auth is configured
const isStackConfigured = !!(
  process.env.NEXT_PUBLIC_STACK_PROJECT_ID &&
  process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
)

// Server-side Stack Auth instance (only initialize if configured)
export const stackServerApp = isStackConfigured ? new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/auth/signin",
    afterSignIn: "/",
    afterSignOut: "/",
    afterSignUp: "/",
    signUp: "/auth/signup",
  },
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY,
}) : null as any

// Client-side Stack Auth instance (only initialize if configured)
export const stackClientApp = isStackConfigured ? new StackClientApp({
  tokenStore: "cookie",
  urls: {
    signIn: "/auth/signin",
    afterSignIn: "/",
    afterSignOut: "/",
    afterSignUp: "/",
    signUp: "/auth/signup",
  },
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
}) : null as any

export { isStackConfigured }
