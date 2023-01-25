import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
export async function middleware(request: NextRequest, _next: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  const protectedPaths = ["/prenota", "/secure"];
  const matchesProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (matchesProtectedPath) {
    const token = await getToken({ req: request });
    console.log('TOKEN',token)
    if (!token) {
      const url = new URL(`/login`, request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }
    // if (token.role !== "admin") {
    //   const url = new URL(`/403`, request.url);
    //   return NextResponse.rewrite(url);
    // }
    if (token) {
      console.log(token)
    }
  }
  return NextResponse.next();
}