const GENERAL_FORM = "https://cf-2026.techclub.pw/robotics/join";
const INTERNAL_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLScxtKLT8RRvoEpeMEobD0_nWtot29ryoKWw9naw2nxv6lT9VQ/viewform?usp=header";
const TECH_CLUB = "https://club-fair-techclub.vercel.app/";

function signUpTarget(params: URLSearchParams): string {
  if (params.get("internal") === "true") return INTERNAL_FORM;
  return GENERAL_FORM;
}

/** Off-site redirect for a request URL, or null if the path is a normal page. */
export function redirectFor(url: URL): string | null {
  const path = url.pathname.replace(/\/+$/, "") || "/";
  switch (path) {
    case "/sign-up":
      return signUpTarget(url.searchParams);
    case "/submit":
    case "/tech-club":
      return TECH_CLUB;
    default:
      return null;
  }
}
