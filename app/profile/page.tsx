"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Edit, Menu, ExternalLink } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Profile {
  id: string
  name: string
  company: string
  location: string
  bio: string
  links: { label: string; url: string }[]
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/")
        return
      }

      const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

      if (error) {
        console.error("Error fetching profile:", error)
      } else {
        setProfile(data)
      }
      setIsLoading(false)
    }

    getProfile()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000D0D] flex items-center justify-center">
        <div className="text-[#00FFB3] font-mono text-sm">loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#000D0D] flex items-center justify-center">
        <div className="text-[#D891EF] font-mono text-sm">profile not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#000D0D] p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <div className="text-[#00FFB3] font-mono text-lg">profile</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-[#778899] hover:text-[#00FFB3]">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#000D0D] border-[#778899]">
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="text-[#00FFB3] font-mono text-sm focus:bg-[#00FFB3]/10"
              >
                profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/database")}
                className="text-[#00FFB3] font-mono text-sm focus:bg-[#00FFB3]/10"
              >
                database
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/check-in")}
                className="text-[#00FFB3] font-mono text-sm focus:bg-[#00FFB3]/10"
              >
                check-in
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="text-[#00FFB3] font-mono text-sm focus:bg-[#00FFB3]/10"
              >
                settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-[#D891EF] font-mono text-sm focus:bg-[#D891EF]/10"
              >
                logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Profile Content */}
        <div className="space-y-6">
          <div className="border border-[#778899] rounded p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="text-[#00FFB3] font-mono text-lg">{profile.name}</div>
                {profile.company && <div className="text-[#778899] font-mono text-sm">{profile.company}</div>}
                {profile.location && <div className="text-[#778899] font-mono text-sm">{profile.location}</div>}
              </div>
              <Button
                onClick={() => router.push("/profile/edit")}
                variant="ghost"
                size="sm"
                className="text-[#D891EF] hover:text-[#D891EF]/80"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            {profile.bio && <div className="text-[#00FFB3] font-mono text-sm leading-relaxed">{profile.bio}</div>}

            {profile.links && profile.links.length > 0 && (
              <div className="space-y-2">
                <div className="text-[#778899] font-mono text-xs uppercase tracking-wide">links</div>
                {profile.links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-[#778899] font-mono text-sm">{link.label}:</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#39FF14] font-mono text-sm hover:underline flex items-center gap-1"
                    >
                      {link.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => router.push("/check-in")}
              className="bg-transparent border border-[#00FFB3] text-[#00FFB3] hover:bg-[#00FFB3] hover:text-[#000D0D] font-mono text-sm lowercase"
            >
              check-in
            </Button>
            <Button
              onClick={() => router.push("/database")}
              className="bg-transparent border border-[#D891EF] text-[#D891EF] hover:bg-[#D891EF] hover:text-[#000D0D] font-mono text-sm lowercase"
            >
              database
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
