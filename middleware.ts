// import { getToken } from "next-auth/jwt";
// import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
// export async function middleware(request: NextRequest, _next: NextFetchEvent) {
//   const { pathname } = request.nextUrl;
//   // const protectedPaths = ["/prenota"];
//   const protectedPaths = [
//       "/prenota", 
//       "/api/reserve", 
//       "/api/reserve/approveReserve",
//       "/api/reserve/pending",
//       "/api/seats",
//       "/api/userReserves",
//       "/api/users",
//       "/api/addReserve"
//   ];
//   const matchesProtectedPath = protectedPaths.some((path) =>
//     pathname.startsWith(path)
//   );

//   if (matchesProtectedPath) {
//     const token = await getToken({ req: request });
//     if (!token) {
//       const url = new URL(`/login`, request.url);
//       url.searchParams.set("callbackUrl", encodeURI(request.url));
//       return NextResponse.redirect(url);
//     }
//     // if (token.role !== "admin") {
//     //   const url = new URL(`/403`, request.url);
//     //   return NextResponse.rewrite(url);
//     // }
//     if (token) {
//       console.log('TOKEN',token)
//     }
//   }
//   return NextResponse.next();
// }

// export const config = { matcher: [
//   "/prenota", 
//   "/api/reserve/", 
//   "/api/reserve/:id", 
//   "/api/reserve/approveReserve",
//   "/api/reserve/pending",
//   "/api/seats/:seatName",
//   "/api/userReserves/:userId",
//   "/api/users/:username",
//   "/api/addReserve"
// ] }



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
        if (token.role !== "ADMIN") {
          const url = new URL(`/403`, request.url);
          return NextResponse.rewrite(url);
        }
      }
    }
    return NextResponse.next();
  }

}


// const { pathname } = request.nextUrl;
// const protectedPaths = ["/prenotazioni/pending"];
// const loggedPaths = ["/prenota", "/prenotazioni", "/api"]
// const adminPath = ["/pending"]

// const matchesProtectedPath = protectedPaths.some((path) =>
//   pathname.startsWith(path)
// );


// const matchesLoggedPaths = loggedPaths.some((path) =>
//   pathname.includes(path)
// );
