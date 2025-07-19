import { api } from "@/shared/libs/axios/customAxios";
import { errorResponse } from "@/shared/utils/error-response";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try{
    const body = await req.json();
    await api.post('/auth/signup', body);
    return NextResponse.redirect('/login');
  }catch(e){
    return errorResponse(e as AxiosError);
  }
}