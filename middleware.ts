import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home"
]);

const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
]);

export default clerkMiddleware(async (auth, req) => {
    const authObject = await auth();
    const { userId } = authObject;
    const currentUrl = new URL(req.url);
    const isAccessingDashboard = currentUrl.pathname === "/home";
    const isApiRequest = currentUrl.pathname.startsWith("/api");

    // User is logged in
    if (userId) {
        // Redirect logged-in users away from public routes except "/home"
        if (isPublicRoute(req) && !isAccessingDashboard) {
            return NextResponse.redirect(new URL("/home", req.url));
        }
    } else {
        // User is not logged in
        if (!isPublicRoute(req)) {
            // Redirect to "/sign-in" if accessing a protected route or a protected API
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }

        // Redirect to "/sign-in" for protected API routes if not logged in
        if (isApiRequest && !isPublicApiRoute(req)) {
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }
    }

    // Continue with the next middleware or route
    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!.*\\..*|_next).*)",
        "/",
        "/(api|trpc)(.*)"
    ],
};
