// export function setupFetchInterceptor(): void {

//   const originalFetch = window.fetch;

//   window.fetch = async (
//     input: RequestInfo | URL,
//     init?: RequestInit
//   ): Promise<Response> => {

//     try {

//       const response = await originalFetch(input, init);

//       // Session expired
//       if (response.status === 401) {

//         console.log("Session expired → Redirecting to login");

//         localStorage.removeItem("user");
//         sessionStorage.removeItem("user");

//         window.location.replace("/login");
//       }

//       return response;

//     } catch (error) {

//       console.log("Network error → Redirecting to login");

//       localStorage.removeItem("user");
//       sessionStorage.removeItem("user");

//       window.location.replace("/login");

//       throw error;
//     }
//   };

// }
export function setupFetchInterceptor(): void {

  const originalFetch = window.fetch;

  window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {

    try {

      const response = await originalFetch(input, init);

      if (response.status === 401) {

        // ✅ Prevent infinite redirect loop
        if (window.location.pathname !== "/login") {

          console.log("Session expired → Redirecting to login");

          localStorage.removeItem("user");
          sessionStorage.removeItem("user");

          window.location.replace("/login");
        }
      }

      return response;

    } catch (error) {

      if (window.location.pathname !== "/login") {

        console.log("Network error → Redirecting to login");

        localStorage.removeItem("user");
        sessionStorage.removeItem("user");

        window.location.replace("/login");
      }

      throw error;
    }
  };
}