import { useEffect } from "react";
import { adminFetch } from "@/lib/admin";

export default function AdminFetcher() {
    useEffect(() => {
        // Example admin API request
        adminFetch("/api/admins").catch(console.error);
    }, []);

    return null;
}
