import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const handler = async (
  req: NextRequest,
  { params }: { params: { proxy: string[] } }
): Promise<NextResponse> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const targetPath = params.proxy.join("/");
  const targetUrl = `${process.env.NEXT_PUBLIC_API_URL}/${targetPath}`;

  const tryRequest = async (token: string) => {
    const headers: HeadersInit = new Headers(req.headers);
    headers.set("Authorization", `Bearer ${token}`);
    headers.delete("cookie");
    headers.delete("host");

    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
    };

    return await fetch(targetUrl, fetchOptions);
  };

  if (!accessToken) {
    return NextResponse.json({ message: "No access token" }, { status: 401 });
  }

  let apiResponse = await tryRequest(accessToken);

  if (apiResponse.status === 401 || apiResponse.status === 419) {
    if (!refreshToken) {
      return NextResponse.json({ message: "No refresh token" }, { status: 401 });
    }

    const reissueResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reissue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!reissueResponse.ok) {
      return NextResponse.json({ message: "Token reissue failed" }, { status: 401 });
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await reissueResponse.json();

    const res = NextResponse.next();
    res.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    apiResponse = await tryRequest(newAccessToken);

    const responseBody = await apiResponse.text();
    const responseHeaders = new Headers(apiResponse.headers);

    return new NextResponse(responseBody, {
      status: apiResponse.status,
      headers: responseHeaders,
    });
  }

  const responseBody = await apiResponse.text();
  const responseHeaders = new Headers(apiResponse.headers);

  return new NextResponse(responseBody, {
    status: apiResponse.status,
    headers: responseHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const OPTIONS = handler;
