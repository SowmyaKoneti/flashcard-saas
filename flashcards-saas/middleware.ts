import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  apiKey: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API, // Ensure this matches your environment variable
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
