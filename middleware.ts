import { current } from "@reduxjs/toolkit";
import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
export async function middleware(request: NextRequest, _next: NextFetchEvent) {
	const { pathname } = request.nextUrl;
	const superadminPaths = ["/create/user", "/api/users"];
	const adminPaths = ["/secure", "/prenotazioni/pending", "/create/room"];
	const loggedPaths = [
		...adminPaths,
		...superadminPaths,
		"/prenota",
		"/prenotazioni",
	];
	// console.log(await getToken({ req: request }))

	// Prendere una rotta all volta, altrimenti il sistema fa il redirect alla login
	const currentPath = loggedPaths.filter((curr: any) =>
		pathname.includes(curr)
	);

	const loggedInPath = currentPath.some((path) => pathname.includes(path));

	const adminPath = adminPaths.some((path) => pathname.includes(path));

	const superadminPath = superadminPaths.some((path) =>
		pathname.includes(path)
	);

	if (currentPath.length > 0) {
		const token = await getToken({ req: request });
		if (!token && loggedInPath) {
			if (pathname.includes("api")) {
				const url = new URL(`/api/auth/unauthorized`, request.url);
				return NextResponse.redirect(url);
			} else {
				const url = new URL(`/login`, request.url);
				// REMOVED BECAUSE WORK BAD ON VERCEL
				// url.searchParams.set("callbackUrl", encodeURI(request.url));
				return NextResponse.redirect(url);
			}
		} else if (token && adminPath) {
			if (token.role !== "ADMIN" && token.role !== "SUPERADMIN") {
				const url = new URL(`/403`, request.url);
				return NextResponse.rewrite(url);
			}
		} else if (token && superadminPath) {
			if (token.role !== "SUPERADMIN") {
				const url = new URL(`/403`, request.url);
				return NextResponse.rewrite(url);
			}
		}
	} else {
		return NextResponse.next();
	}
}
