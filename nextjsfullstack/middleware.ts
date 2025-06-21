import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    // Matches the page config in [...nextauth]
    function middleware() {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized({ req, token }) {
                const { pathname } = req.nextUrl
                if (pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register")
                    return true;

                // public path...
                if (pathname === "/" || pathname.startsWith("/api/videos")) return true;
                return !!token;
            },
        }
    }
);


export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ]
};