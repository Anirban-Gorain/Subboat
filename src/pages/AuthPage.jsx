import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignInEmailPassword, useSignUpEmailPassword } from "@nhost/react";
import { nhost } from "../api/nhost.js";
import { initWsClient } from "../api/wsClient.js";

export default function AuthPage() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) navigate("/");
  }, []);

  const {
    signInEmailPassword,
    isLoading: isSignInLoading,
    error: signInError,
    isSuccess: isSignInSuccess,
  } = useSignInEmailPassword();

  const {
    signUpEmailPassword,
    isLoading: isSignUpLoading,
    error: signUpError,
    isSuccess: isSignUpSuccess,
  } = useSignUpEmailPassword();

  const loading = mode === "signin" ? isSignInLoading : isSignUpLoading;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (mode === "signin") {
        await signInEmailPassword(email, password);
      } else {
        await signUpEmailPassword(email, password);
      }

      const session = await nhost.auth.getSession();

      if (session) {
        const accessToken = session.accessToken;
        localStorage.setItem("accessToken", accessToken);

        initWsClient({
          url: "wss://kjjcgsvslatkvloyeraw.hasura.ap-south-1.nhost.run/v1/graphql",
          accessToken,
        });
      }

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message);
      console.log(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </h1>
          <button
            className="text-sm underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Create account" : "Have an account? Sign in"}
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-xl px-3 py-2 outline-none focus:ring"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-xl px-3 py-2 outline-none focus:ring"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
          <button
            disabled={loading}
            className="w-full rounded-xl py-2 bg-black text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? "Please wait…"
              : mode === "signin"
              ? "Sign In"
              : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
