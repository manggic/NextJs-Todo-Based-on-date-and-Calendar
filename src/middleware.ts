import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

  const token = request.cookies.get("token")?.value;
  console.log('middleware console ????? request.cookies', request.cookies);
  
  if (!token) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  const response = NextResponse.next()

  response.cookies.set('token', token)

  return response

}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/sin"],
};
