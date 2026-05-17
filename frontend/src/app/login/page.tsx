"use client";

import { login } from "../actions/authActions";
import { useState } from "react";
import { useRouter } from "next/navigation";

function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message ?? "Login failed");
      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <form
          onSubmit={handleSubmit}
          method="POST"
          className="flex flex-col gap-4 w-full max-w-sm"
        >
          <h1 className="text-2xl font-semibold">Sign in</h1>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <label>Email</label>
          <input
            name="email"
            type="text"
            required
            className="border rounded px-3 py-2"
          />
          <label>Password</label>
          <input
            name="password"
            type="password"
            required
            className="border rounded px-3 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded px-3 py-2 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
