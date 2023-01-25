// import { NextRequest, NextResponse } from "next/server";

// export function middleware(req: NextRequest) {

//     const sessionCookie = req.cookies.get('session')
//     req.cookies.set('new_cookie','my_new_cookie')

//     if(req.nextUrl.pathname.startsWith('/admin')) {
//         if(!sessionCookie) {
//             return NextResponse.redirect('/login')
//         }
//     }

// }

// export { default } from 'next-auth/middleware'
// export const config = {matcher:['/', '/api']}

// import { withAuth } from 'next-auth/middleware'
// import { NextRequest, NextResponse } from 'next/server'
// export default withAuth(
//     function middleware(req: NextRequest) {
//         console.log('MIDDLEWARE')
//         return NextResponse.rewrite(new URL('/secure', req.url))
//     },
//     {
//         callbacks: {
//             authorized({ token }) {
//                 console.log('AUTH', token)
//                 return token?.jty === token?.jty
//             }

//         }
//     }
// )

// export const config = { matcher: ['/secure'] }

// import { NextResponse } from "next/server";
// import { verify } from 'jsonwebtoken'
// const SECRET:any = process.env.NEXTAUTH_SECRET

// export default async function middleware( req: any, res:any ) {
//     const { cookies } = req

//     // if(cookies.get('next-auth.csrf-token')) return
//     console.log('COOKIES',cookies.get('next-auth.csrf-token').value)
//     console.log('SECRET', process.env.NEXTAUTH_SECRET)
//     const jwt:any = cookies.get('next-auth.csrf-token').value
//     const url = req.url

//     if(url.includes('secure')) {
//         if(jwt === undefined) {
//             return NextResponse.redirect('/login')
//         }
        
//     }

// }

// export const config = { matcher: ['/secure'] }





import { verify } from 'jsonwebtoken';
import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server';

const isUserRoute = (pathname: string) => {
    return pathname.startsWith('/secure');
}

export async function middleware(req: NextRequest, res:NextResponse) {
  const token:any = req.headers.get("Authorization");
  const { pathname } = req.nextUrl;

  console.log('TOKEN',token)
  const passToken:any = process.env.NEXTAUTH_SECRET

  try {
    const verified = await jwtVerify(
      token,
      token
    )
    console.log('VERIFY',verified)
  } catch (err) {
    console.log('VERIFY ERRO',err)
  }

  
  if (isUserRoute(pathname) && token === null) {
      console.log('MIDDLEWARE', isUserRoute(pathname))
      return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: ['/secure']
};







// import { type NextRequest, NextResponse } from 'next/server'
// import { verifyAuth } from '@lib/auth'

// export const config = {
//   matcher: [ '/api/protected', '/protected' ],
// }

// export async function middleware(req: NextRequest) {
//   // validate the user is authenticated
//   const verifiedToken = await verifyAuth(req).catch((err) => {
//     console.error(err.message)
//   })

//   if (!verifiedToken) {
//     // if this an API request, respond with JSON
//     if (req.nextUrl.pathname.startsWith('/api/')) {
//       return new NextResponse(
//         JSON.stringify({ 'error': { message: 'authentication required' } }),
//         { status: 401 });
//     }
//     // otherwise, redirect to the set token page
//     else {
//       return NextResponse.redirect(new URL('/', req.url))
//     }
//   }
// }