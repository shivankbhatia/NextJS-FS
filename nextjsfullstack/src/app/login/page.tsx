"use client";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // using next auth
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false
        })

        if (result?.error) {
            console.error("Error Signing in...", result.error)
        } else {
            router.push("/")
        }
    }

    return (
        <div>
            <h1>LogIn</h1>
            <form
                onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </form>
            <div>
                {/* <button onClick={() => {
                    signIn("google")
                }}>Sign in with Google</button>

                <button onClick={() => {
                    signIn("github")
                }}>GitHub</button> */}

                Don't have an Accout?
                <button onClick={() => router.push("/register")}>Register</button>
            </div>
        </div >
    )
}

export default LoginPage
