"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage("check your email for password reset instructions")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#000D0D] p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => router.push("/login")}
            variant="ghost"
            size="sm"
            className="text-[#778899] hover:text-[#00FFB3] p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="text-[#00FFB3] font-mono text-lg">forgot password</div>
        </div>

        {/* Info */}
        <div className="mb-6 p-4 border border-[#778899] rounded">
          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 text-[#778899] mt-0.5 flex-shrink-0" />
            <div className="text-[#778899] font-mono text-sm leading-relaxed">
              enter your email address and we'll send you a link to reset your password
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#778899] font-mono text-sm lowercase">
              email address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-transparent border-[#778899] text-[#00FFB3] font-mono text-sm focus:border-[#00FFB3] focus:ring-[#00FFB3]"
              required
            />
          </div>

          {error && <div className="text-[#D891EF] font-mono text-xs p-3 border border-[#D891EF] rounded">{error}</div>}

          {message && (
            <div className="text-[#39FF14] font-mono text-xs p-3 border border-[#39FF14] rounded">{message}</div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full bg-[#00FFB3] text-[#000D0D] hover:bg-[#00FFB3]/90 font-mono text-sm lowercase"
          >
            {isLoading ? "sending..." : "send reset link"}
          </Button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Button
            onClick={() => router.push("/login")}
            variant="link"
            className="text-[#778899] hover:text-[#D891EF] font-mono text-sm lowercase"
          >
            back to login
          </Button>
        </div>
      </div>
    </div>
  )
}
