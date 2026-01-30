"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authenticateWithGoogle } from "@/app/common/services/pocketbase.service";
import Spinner from "@/app/common/components/spinner";
import { toast } from "@/components/ui/use-toast";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Parse the query parameters from the redirected URL
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code) {
        setError("No authorization code received");
        return;
      }

      // Load the previously stored provider's data (as per PocketBase docs)
      const providerJson = localStorage.getItem("pb_oauth_provider");
      const redirectUrl = localStorage.getItem("pb_oauth_redirect_url");

      // Clean up localStorage
      localStorage.removeItem("pb_oauth_provider");
      localStorage.removeItem("pb_oauth_redirect_url");

      if (!providerJson || !redirectUrl) {
        setError("Authentication session expired. Please try again.");
        return;
      }

      const provider = JSON.parse(providerJson);

      // Compare the redirect's state param and the stored provider's one
      if (provider.state !== state) {
        setError("State parameters don't match. Please try again.");
        return;
      }

      // Authenticate with PocketBase using the code
      const result = await authenticateWithGoogle(
        provider.name,
        code,
        provider.codeVerifier,
        redirectUrl
      );

      if (result.success) {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in with Google.",
        });
        router.push("/profile");
      } else {
        setError(result.error || "Authentication failed");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <section className="h-full w-full flex flex-col items-center justify-center gap-4">
        <p className="text-destructive text-lg">{error}</p>
        <button
          onClick={() => router.push("/auth/login")}
          className="underline hover:text-primary">
          Return to login
        </button>
      </section>
    );
  }

  return (
    <section className="h-full w-full flex flex-col items-center justify-center gap-4">
      <Spinner className="h-8 w-8 animate-spin" />
      <p className="text-muted-foreground">Completing sign in...</p>
    </section>
  );
}
