"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import { useBaseAccount } from "@/components/providers/base-account-provider";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const baseAccount = useBaseAccount();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [usernameCheckLoading, setUsernameCheckLoading] = useState(false);

  useEffect(() => {
    const checkUsername = async () => {
      if (username) {
        setUsernameCheckLoading(true);
        try {
          const response = await fetch(
            `http://localhost:5000/api/v1/auth/username/check?username=${username}`,
          );
          const data = await response.json();
          setIsUsernameAvailable(data.data.available);
        } catch (error) {
          console.error("Username check failed:", error);
        }
        setUsernameCheckLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      checkUsername();
    }, 500);

    return () => clearTimeout(debounce);
  }, [username]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallet_address: baseAccount.universalAddress,
            full_name: fullName,
            username: username,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Registration successful!");
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <h1 className="font-sans text-3xl font-bold text-black">PayZen</h1>
          </Link>
          <p className="text-slate-600 font-mono text-sm">
            Create your account
          </p>
        </div>

        {/* Signup Card */}
        <Card className="glass-card border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-black">Get started</CardTitle>
            <CardDescription className="text-slate-600">
              Enter your details to create an account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-700">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-white border-slate-700 text-black placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-white border-slate-700 text-black placeholder:text-slate-500"
                />
                {usernameCheckLoading && (
                  <p className="text-xs text-slate-400">Checking...</p>
                )}
                {username && !usernameCheckLoading && (
                  <p
                    className={`text-xs ${isUsernameAvailable ? "text-green-500" : "text-red-500"}`}
                  >
                    {isUsernameAvailable
                      ? "Username is available"
                      : "Username is taken"}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isLoading || !isUsernameAvailable}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <ArrowRight className="mr-2 h-5 w-5" />
                )}
                Create Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pt-4">
            <Link href="/">
              <Button
                variant="outline"
                className="border-border hover:bg-black bg-transparent text-slate-500"
              >
                Go back to home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
