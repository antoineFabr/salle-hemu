import { type NextRequest, NextResponse } from "next/server";

const authRoutes = ["/login"];
const protectedRoutes = ["/dashboard"];


export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const { auth } = await import("./services/auth");
  const session = await auth();

  console.log(
    `[proxy] ${req.method} ${pathname}`,
    JSON.stringify({
      user: session?.user?.name ?? "anonymous",
      userId: session?.user?.id ?? null,
      userAgent: req.headers.get("user-agent")?.slice(0, 80),
      url: req.url,
      ip: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown",
    }),
  );

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));

  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|api/sse|error|_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z]+$).*)"],
};
