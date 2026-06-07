import { useGoogleLoginMutation } from "@/api/auth/mutations";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

export default function GoogleLoginButton({ login = false }: { login?: boolean }) {
  const { mutate: verifyGoogle, isPending: isVerifying } = useGoogleLoginMutation();

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (tokenResponse) => {
      if (tokenResponse.code) {
        verifyGoogle(tokenResponse.code);
      }
    },
    onError: (errorResponse) => {
      console.error("Google Overlay Error:", errorResponse);
      toast.error("Google sign-in was cancelled or failed.");
    }
  });

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isVerifying}
      onClick={() => handleGoogleLogin()} // Trigger the library popup overlay
      className="w-full h-12 text-sm font-semibold rounded-md gap-2">
      {isVerifying ? "Verifying..." : `${login ? "Login" : "Sign up"} with Google`}
    </Button>
  );
}

