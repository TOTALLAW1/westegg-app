"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      router.push("/profile")
    }
  }

  return (
    <div className="min-h-screen bg-[#000D0D] p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            size="sm"
            className="text-[#778899] hover:text-[#00FFB3] p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="text-[#00FFB3] font-mono text-lg">login</div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#778899] font-mono text-sm lowercase">
              email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-[#778899] text-[#00FFB3] font-mono text-sm focus:border-[#00FFB3] focus:ring-[#00FFB3]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#778899] font-mono text-sm lowercase">
              password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-[#778899] text-[#00FFB3] font-mono text-sm focus:border-[#00FFB3] focus:ring-[#00FFB3]"
              required
            />
          </div>

          {error && <div className="text-[#D891EF] font-mono text-xs p-2 border border-[#D891EF] rounded">{error}</div>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00FFB3] text-[#000D0D] hover:bg-[#00FFB3]/90 font-mono text-sm lowercase"
          >
            {isLoading ? "authenticating..." : "login"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Button
            onClick={() => router.push("/forgot-password")}
            variant="link"
            className="text-[#778899] hover:text-[#D891EF] font-mono text-sm lowercase"
          >
            forgot password?
          </Button>
          <Button
            onClick={() => router.push("/register")}
            variant="link"
            className="text-[#778899] hover:text-[#D891EF] font-mono text-sm lowercase"
          >
            need an account? register
          </Button>
        </div>
      </div>
    </div>
  )
}
