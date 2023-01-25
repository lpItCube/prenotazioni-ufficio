import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
// export async function middleware(request: NextRequest, _next: NextFetchEvent) {
//   const { pathname } = request.nextUrl;
//   const protectedPaths = [
//     "/prenota", 
//     "/api/reserve", 
//     "/api/reserve/:id*", 
//     "/api/reserve/approveReserve",
//     "/api/reserve/pending",
//     "/api/seats/:seatName*",
//     "/api/userReserves/:userId*",
//     "/api/users/:username*",
//     "/api/addReserve"
//   ];
//   const matchesProtectedPath = protectedPaths.some((path:any) =>
//     console.log('MATCH', path, pathname)
//     // pathname.startsWith(path)
//   );

//   console.log('METCH',matchesProtectedPath)

//   if (matchesProtectedPath) {
//     const token = await getToken({ req: request });
//     console.log('TOKEN',token)
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
//       console.log(token)
//     }
//   }
//   return NextResponse.next();
// }



import { withAuth } from "next-auth/middleware"


export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  async function middleware(req:NextRequest) {
    // const token = req.cookies.get('next-auth.session-token')?.value
    // // const getTokenaw = await getToken({ req: req });
    // // console.log('TOKENTOKEN',getTokenaw)
    // // console.log('REQ COO',req.cookies === null)
    // // console.log('REQUEST MIDDLEWARE',req.cookies.get('next-auth.csrf-token')?.value)
    // // console.log('PASS MIDDLEWARE', req.cookies.get('next-auth.session-token')?.value)
    // if(!token) {
    //     return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
    // }

    // const token = await getToken({ req: req });
    const token = 'aaa'
    console.log('TOKEN',token)
    if (!token) {
      const url = new URL(`/login`, req.url);
      url.searchParams.set("callbackUrl", encodeURI(req.url));
      return NextResponse.redirect(url);
    }
    // if (token.role !== "admin") {
    //   const url = new URL(`/403`, request.url);
    //   return NextResponse.rewrite(url);
    // }
    if (token) {
      console.log(token)
    }

},
  {
    callbacks: {
      authorized: ( req:any ) => req.cookies !== null,
    //   authorized: ({ token }) => true,
    },
  }
)

export const config = { matcher: [
    "/prenota", 
    "/api/reserve/", 
    "/api/reserve/:id*", 
    "/api/reserve/approveReserve",
    "/api/reserve/pending",
    "/api/seats/:seatName*",
    "/api/userReserves/:userId*",
    // "/api/users/:username*",
    "/api/addReserve"
] }




// import { withAuth } from "next-auth/middleware"
// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";


// export default withAuth(
//   // `withAuth` augments your `Request` with the user's token.
//   async function middleware(req) {
//     const token = req.cookies.get('next-auth.session-token')?.value
//     // const getTokenaw = await getToken({ req: req });
//     // console.log('TOKENTOKEN',getTokenaw)
//     // console.log('REQ COO',req.cookies === null)
//     // console.log('REQUEST MIDDLEWARE',req.cookies.get('next-auth.csrf-token')?.value)
//     // console.log('PASS MIDDLEWARE', req.cookies.get('next-auth.session-token')?.value)
//     if(!token) {
//         return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
//     }
// },
//   {
//     callbacks: {
//       authorized: ( req:any ) => req.cookies !== null,
//     //   authorized: ({ token }) => true,
//     },
//   }
// )

// export const config = { matcher: [
//     "/prenota", 
//     "/api/reserve/", 
//     "/api/reserve/:id", 
//     "/api/reserve/approveReserve",
//     "/api/reserve/pending",
//     "/api/seats/:seatName",
//     "/api/userReserves/:userId",
//     "/api/users/:username",
//     "/api/addReserve"
// ] }

