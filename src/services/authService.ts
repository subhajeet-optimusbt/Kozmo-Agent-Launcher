import { baseUrl } from "../utils/baseUrl";
export interface LoginPayload {
  Email: string;
  Password: string;
  RememberMe: boolean;
}

export interface Account {
  accountId: string;
  accountName: string;
  plan: string;
  region: string;
  role: string;
  isDefault: "Yes" | "No";
}

export interface LoginResponse {
  isAuthenticated: boolean;
  userId: string;
  userName: string;
  email: string;
  accountId: string;
  accounts: Account[];
  redirectUrl: string;
}


export async function loginApi(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response = await fetch(`${baseUrl()}/Home/Login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", 
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}


