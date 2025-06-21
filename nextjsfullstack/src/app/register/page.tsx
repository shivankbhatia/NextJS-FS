"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match.")
            return;
        }

        try {
            // react-query use here for more functionality.
            // loading state management, error state managament, debouncing management,  etc....
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Registration failed");
            }
            alert("Registration successful!");
            console.log(data);
            router.push("/login");
        }
        catch (error) {
            console.error("Registration error:", error);
        }
    }

    return (
        <div>
            <h1>
                Register
            </h1>
            <form onSubmit={handleSubmit}>
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            <div>
                <p>
                    Already have an Account? <a href="/login">LogIn</a>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage
