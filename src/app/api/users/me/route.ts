import { api } from "@/shared/libs/axios/customAxios";
import { errorResponse } from "@/shared/utils/error-response";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const accessToken = req.headers.get("accessToken");
    const refreshToken = req.cookies.get("refreshToken")?.value;

    const res = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        refreshToken
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (e) {
    return errorResponse(e as AxiosError);
  }
};
