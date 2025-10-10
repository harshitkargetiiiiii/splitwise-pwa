import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:3001";

export function AuthVerify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      // Redirect to API endpoint which will set the cookie and redirect back
      window.location.href = `${API_BASE}/api/auth/magic/verify?token=${token}`;
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Verifying your login...</p>
      </div>
    </div>
  );
}
