"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        router.push("/profile")
      } else {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000D0D] flex items-center justify-center">
        <div className="text-[#00FFB3] font-mono text-sm">loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#000D0D] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Terminal Header */}
        <div className="text-center space-y-2">
          <div className="text-[#00FFB3] font-mono text-2xl font-bold">west egg</div>
          <div className="text-[#778899] font-mono text-xs">real-world networking terminal</div>
          <div className="text-[#778899] font-mono text-xs">v1.0.0</div>
        </div>

        {/* ASCII Art */}
        <div className="text-[#00FFB3] font-mono text-xs text-center leading-tight">
          <pre>{`
    ╭─────────────────╮
    │  ◉ ◉ ◉ ◉ ◉ ◉  │
    │                 │
    │   connections   │
    │   through       │
    │   presence      │
    │                 │
    ╰─────────────────╯
          `}</pre>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push("/login")}
            className="w-full bg-transparent border border-[#00FFB3] text-[#00FFB3] hover:bg-[#00FFB3] hover:text-[#000D0D] font-mono text-sm lowercase transition-colors"
          >
            login
          </Button>
          <Button
            onClick={() => router.push("/register")}
            className="w-full bg-transparent border border-[#D891EF] text-[#D891EF] hover:bg-[#D891EF] hover:text-[#000D0D] font-mono text-sm lowercase transition-colors"
          >
            register
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-[#778899] font-mono text-xs">build meaningful connections</div>
      </div>
    </div>
  )
}
