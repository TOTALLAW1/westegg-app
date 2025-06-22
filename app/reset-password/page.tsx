"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Lock } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isValidSession, setIsValidSession] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setIsValidSession(true)
      } else {
        // Check for hash fragments (Supabase auth tokens)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (!error) {
            setIsValidSession(true)
          }
        }
      }
    }

    checkSession()
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      // Password updated successfully, redirect to profile
      router.push("/profile")
    }
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-[#000D0D] p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center space-y-4">
            <div className="text-[#D891EF] font-mono text-lg">invalid reset link</div>
            <div className="text-[#778899] font-mono text-sm">this password reset link is invalid or has expired</div>
            <Button
              onClick={() => router.push("/forgot-password")}
              className="bg-[#00FFB3] text-[#000D0D] hover:bg-[#00FFB3]/90 font-mono text-sm lowercase"
            >
              request new reset link
            </Button>
          </div>
        </div>
      </div>
    )
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
          <div className="text-[#00FFB3] font-mono text-lg">reset password</div>
        </div>

        {/* Info */}
        <div className="mb-6 p-4 border border-[#778899] rounded">
          <div className="flex items-start gap-3">
            <Lock className="h-4 w-4 text-[#778899] mt-0.5 flex-shrink-0" />
            <div className="text-[#778899] font-mono text-sm leading-relaxed">enter your new password below</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#778899] font-mono text-sm lowercase">
              new password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-[#778899] text-[#00FFB3] font-mono text-sm focus:border-[#00FFB3] focus:ring-[#00FFB3]"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[#778899] font-mono text-sm lowercase">
              confirm new password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-transparent border-[#778899] text-[#00FFB3] font-mono text-sm focus:border-[#00FFB3] focus:ring-[#00FFB3]"
              required
              minLength={6}
            />
          </div>

          {error && <div className="text-[#D891EF] font-mono text-xs p-3 border border-[#D891EF] rounded">{error}</div>}

          <Button
            type="submit"
            disabled={isLoading || !password.trim() || !confirmPassword.trim()}
            className="w-full bg-[#00FFB3] text-[#000D0D] hover:bg-[#00FFB3]/90 font-mono text-sm lowercase"
          >
            {isLoading ? "updating password..." : "update password"}
          </Button>
        </form>
      </div>
    </div>
  )
}
