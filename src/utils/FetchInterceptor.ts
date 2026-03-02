import { forceLogout } from "./logout";

// URLs that should never trigger auto-logout (auth endpoints themselves)
const AUTH_URLS = ["/auth/", "/Home/Logout", "/login"];

function isAuthUrl(input: RequestInfo | URL): boolean {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  return AUTH_URLS.some((auth) => url.includes(auth));
}

export function setupFetchInterceptor(): void {
  const originalFetch = window.fetch;
  let isRedirecting = false;

  window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    // Never intercept auth/logout calls — avoids infinite loops
    if (isAuthUrl(input)) {
      return originalFetch(input, init);
    }

    try {
      const response = await originalFetch(input, init);

      if (isRedirecting) return response;

      // ✅ Case 1: Explicit 401 Unauthorized
      if (response.status === 401) {
        isRedirecting = true;
        console.warn("[Auth] 401 detected → force logout");
        await forceLogout();
        return response;
      }

      // ✅ Case 2: 302 redirect that was followed — server redirected us to login page
      // fetch() follows redirects automatically. The final URL will be the login page.
      // response.redirected === true means a redirect happened.
      // We check if the final URL contains /login or /Login
      if (response.redirected) {
        const finalUrl = response.url ?? "";
        const isLoginRedirect =
          finalUrl.includes("/login") ||
          finalUrl.includes("/Login") ||
          finalUrl.includes("ReturnUrl"); // ASP.NET adds ReturnUrl on auth redirect

        if (isLoginRedirect) {
          isRedirecting = true;
          console.warn("[Auth] Redirected to login page → force logout", finalUrl);
          await forceLogout();
          return response;
        }
      }

      // ✅ Case 3: Response is HTML when we expected JSON (302 followed silently)
      // This catches the exact error you see: "Server returned non-JSON response"
      // Only do this for our API calls (contains /api/ in URL)
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
          ? input.href
          : input.url;

      if (url.includes("/api/")) {
        const contentType = response.headers.get("content-type") ?? "";
        const isHtml = contentType.includes("text/html");

        if (isHtml && response.ok) {
          // Server returned HTML with 200 — classic silent redirect to login
          isRedirecting = true;
          console.warn("[Auth] API returned HTML (session expired redirect) → force logout");
          await forceLogout();
          return response;
        }
      }

      return response;
    } catch (error) {
      if (!isRedirecting) {
        isRedirecting = true;
        console.warn("[Auth] Network/fetch error → force logout", error);
        await forceLogout();
      }
      throw error;
    }
  };
}