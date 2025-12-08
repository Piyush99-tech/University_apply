"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerApi } from "@/lib/api";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await registerApi(name, email, password);
            // Auto login or redirect to login? 
            // Based on typical flows, we can redirect to login or save token if returned (assuming backend returns token on register)

            // The backend authController.js `register` function returns { user, token }.
            if (typeof window !== "undefined") {
                window.localStorage.setItem("uniapply_token", data.token);
                window.localStorage.setItem("uniapply_user", JSON.stringify(data.user));
            }

            // Default new users to student dashboard
            router.push("/student");

        } catch (err) {
            console.error(err);
            setError("Registration failed. Email might be in use.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">Create an Account</h1>
                    <p className="text-sm text-slate-500">
                        Join UniApply to start your application applications.
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Min 6 characters"
                            required
                            minLength={6}
                        />
                    </div>
                    {error && (
                        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <div className="text-center text-xs text-slate-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </main>
    );
}
