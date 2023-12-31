import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }
  return null;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/"],
};
