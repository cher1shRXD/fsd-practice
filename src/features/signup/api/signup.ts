import { customFetch } from "@/shared/libs/fetch/customFetch";
import { SignupData } from "../types/signup-data";

export const signup = async (signupData: SignupData) => {
  const res = await customFetch.post('/api/auth/signup', signupData);
  return res;
}