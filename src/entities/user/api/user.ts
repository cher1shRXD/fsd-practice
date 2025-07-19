import { customFetch } from "@/shared/libs/fetch/customFetch"
import { User } from "@/entities/user/types/user";

export const fetchUser = async () => {
  const { data } = await customFetch.get<User>("/api/users/me");
  return data;
}