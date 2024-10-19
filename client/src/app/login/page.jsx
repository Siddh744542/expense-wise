"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Both fields are required");
    } else {
      setError("");
      try {
        // const response = await axios.post(
        //   `${process.env.NEXT_PUBLIC_DOMAIN}/users/login`,
        //   {
        //     email: email,
        //     password: password,
        //   },
        //   {
        //     withCredentials: true,
        //     headers: {
        //       "Access-Control-Allow-Credentials": true,
        //       "Access-Control-Allow-Origin": "*",
        //     },
        //   }
        // );
        await signIn("credentials", {
          redirect: "false",
          email: email,
          password: password,
        }).then((result) => {
          if (result?.error) alert("Invalid Credentials!");
          else {
            console.log("login success");
            toast.success("Login successful");
            window.location.replace("/");
          }
        });
      } catch (error) {
        // let errorMessage = JSON.parse(error.request.responseText).error;
        // toast.error(errorMessage);
        console.log("login failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don&apos;t have an account?
          <button
            className="text-blue-500 hover:underline focus:outline-none mx-1"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
