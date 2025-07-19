import { customFetch } from "@/shared/libs/fetch/customFetch"
import { LoginData } from "../types/login-data";

export const login = async (loginData: LoginData) => {
  const res = await customFetch.post('/api/auth/login', loginData);
  return res;
}