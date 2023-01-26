import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
export async function middleware(request: NextRequest, _next: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  const protectedPaths = ["/prenotazioni/pending"];
  const loggedPaths = ["/prenota", "/prenotazioni", "/prenotazioni/pending"]

  const matchesProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  const matchesLoggedPaths = loggedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (matchesLoggedPaths) {
    const token = await getToken({ req: request });
    if (!token) {
      const url = new URL(`/login`, request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }
    if (token) {
      if (matchesProtectedPath) {
        if (token.role !== "admin") {
          const url = new URL(`/403`, request.url);
          return NextResponse.rewrite(url);
        }
      }
    }
    return NextResponse.next();
  }

}