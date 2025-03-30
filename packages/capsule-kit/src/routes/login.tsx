import { useCapsuleClient } from "@/hooks/use-capsule-client";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";

function LoginComponent() {
  const router = useRouter();
  const client = useCapsuleClient();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setIsLoggingIn(true);
    setError(null);

    try {
      if (client) {
        const loginResult = await client.handleOnLoginClick({
          newTab: true,
        });

        if (!loginResult) {
          setError("Failed to start login process. Please try again.");
        }
      } else {
        setError("Capsule client not initialized");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Failed to connect to your Capsule. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f16] flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-20%] w-[140%] h-[140%] bg-gradient-radial from-[#1a2e44]/20 to-transparent opacity-40" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[140%] h-[140%] bg-gradient-radial from-[#133e59]/10 to-transparent opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-light text-white mb-2 tracking-tight"
          >
            Welcome to your{" "}
            <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent font-normal">
              Capsule
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-zinc-400 max-w-sm mx-auto"
          >
            Connect with your Capsule instance to explore your data
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[rgba(30,41,59,0.4)] backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6 shadow-xl"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="relative w-full py-3 px-4 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium transition-all hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 group overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-teal-400/0 via-white/10 to-teal-400/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-[100%] transition-all duration-1000" />
            {isLoggingIn ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Connecting...
              </div>
            ) : (
              "Login with your Capsule"
            )}
          </button>

          <div className="mt-5 text-center text-zinc-500 text-xs">
            <p>
              Need help? Check the{" "}
              <a
                href="#"
                className="text-teal-400 hover:text-teal-300 transition-colors"
              >
                documentation
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    const tokens = JSON.parse(
      sessionStorage.getItem("capsule_auth_tokens") || "{}",
    );
    console.log("tokens", tokens);
    if (tokens.accessToken) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginComponent,
});
