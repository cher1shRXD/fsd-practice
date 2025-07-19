import { NextRequest, NextResponse } from "next/server";
import { api } from "@/shared/libs/axios/customAxios";
import { AxiosError } from "axios";
import { errorResponse } from "@/shared/utils/error-response";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const res = await api.post("/auth/login", body);
    const response = NextResponse.json({ accessToken: res.data.accessToken }, { status: res.status });

    response.cookies.set("refreshToken", res.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    response.cookies.set("accessToken", res.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 5,
    });

    return response;
  } catch (e) {
    return errorResponse(e as AxiosError);
  }
};
