
import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
export async function middleware(request: NextRequest, _next: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  const protectedPaths = ["/secure", "/api/users", "/prenotazioni/pending", "/create/user", "/create/room"];
  const loggedPaths = ["/prenota", "/prenotazioni", "/secure", "/api/users"]
  // console.log(await getToken({ req: request }))

  // Prendere una rotta all volta, altrimenti il sistema fa il redirect alla login
  const currentPath = loggedPaths.filter((curr: any) => pathname.includes(curr))

  const loggedInPath = currentPath.some((path) =>
    pathname.includes(path)
  );

  const adminPath = protectedPaths.some((path) =>
    pathname.includes(path)
  );

  if (currentPath.length > 0) {
    const token = await getToken({ req: request });
    if (!token && loggedInPath) {
      if (pathname.includes('api')) {
        const url = new URL(`/api/auth/unauthorized`, request.url);
        return NextResponse.redirect(url);
      } else {
        const url = new URL(`/login`, request.url);
        url.searchParams.set("callbackUrl", encodeURI(request.url));
        return NextResponse.redirect(url);
      }
    }
    else if (token && adminPath) {
      if (token.role !== "ADMIN") {
        const url = new URL(`/403`, request.url);
        return NextResponse.rewrite(url);
      }
    }
  } else {
    return NextResponse.next();
  }

}