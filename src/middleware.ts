import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/']);
const isOnboardingRoute = createRouteMatcher(['/getting_started(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // 1. If user is not logged in and trying to access a protected route
  if (!userId && !isPublicRoute(req)) {
      return redirectToSignIn();
  }

  // 2. If user is logged in
  if (userId) {
      // In a real app, we might check a sync'd user record or a metadata flag in Clerk.
      // For now, if they are NOT on the onboarding route, we should eventually check their status.
      // However, the PRD says they MUST be redirected to /getting_started on first login.
      
      // We'll need a way to check if onboarding is complete without hitting the DB on every request if possible,
      // but for MVP, a simple check or clerk metadata check works.
      
      // For now, let's allow them to stay on /getting_started if they are there.
      if (isOnboardingRoute(req)) {
          return NextResponse.next();
      }

      // If they are on a public route (like /), let them be.
      if (isPublicRoute(req)) {
          return NextResponse.next();
      }

      // Default behavior: Allow for now, but we will add the "onboardingComplete" check soon.
      // This will likely involve fetching the user from DB or Clerk metadata.
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};