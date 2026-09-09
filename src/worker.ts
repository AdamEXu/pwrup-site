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

interface Env {
  ASSETS: Fetcher;
}

export default {
  fetch(request: Request, env: Env): Promise<Response> | Response {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    switch (path) {
      case "/sign-up":
        return Response.redirect(signUpTarget(url.searchParams), 302);
      case "/submit":
      case "/tech-club":
        return Response.redirect(TECH_CLUB, 302);
      default:
        return env.ASSETS.fetch(request);
    }
  },
} satisfies ExportedHandler<Env>;
