import { forceLogout } from "./logout";

export function setupFetchInterceptor(): void {
  const originalFetch = window.fetch;

  let isRedirecting = false;

  window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    try {
      const response = await originalFetch(input, init);

      // ✅ Session expired
      if (response.status === 401 && !isRedirecting) {
        isRedirecting = true;

        console.log("Session expired → Calling Logout API");

        await forceLogout();
      }

      // ✅ IMPORTANT → Always return response
      return response;
    } catch (error) {
      if (!isRedirecting) {
        isRedirecting = true;

        console.log("Network error → Logout");

        await forceLogout();
      }

      throw error;
    }
  };
}
