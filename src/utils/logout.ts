import { baseUrl } from "./baseUrl";

export async function forceLogout(): Promise<void> {

  try {

    await fetch(baseUrl() + "/Home/Logout", {
      method: "POST",
      credentials: "include",
    });

  } catch {
    console.log("Logout API failed");
  }

  localStorage.removeItem("user");
  sessionStorage.removeItem("user");

  window.location.replace("/login");

}