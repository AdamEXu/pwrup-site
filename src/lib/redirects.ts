const GENERAL_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLSfGztcsv36DX8pSdFCm8Tai8MZD1ZnjdFHDCkIhgWYq6FIVeg/viewform";
const INTERNAL_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLScxtKLT8RRvoEpeMEobD0_nWtot29ryoKWw9naw2nxv6lT9VQ/viewform?usp=header";
const TECH_CLUB = "https://club-fair-techclub.vercel.app/";

const ROLE_ENTRY = "entry.1824823162";
const ROLES: Record<string, string> = {
  business: "Business",
  marketing: "Marketing",
  software: "Software",
  hardware: "Hardware",
};

function signUpTarget(params: URLSearchParams): string {
  if (params.get("internal") === "true") return INTERNAL_FORM;
  const role = ROLES[params.get("role") ?? ""];
  if (role) {
    return `${GENERAL_FORM}?usp=pp_url&${ROLE_ENTRY}=${encodeURIComponent(role)}`;
  }
  return `${GENERAL_FORM}?usp=header`;
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
