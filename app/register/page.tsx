"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Plus, X } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    company: "",
    location: "",
    bio: "",
  })
  const [links, setLinks] = useState<{ label: string; url: string }[]>([])
  const [newLink, setNewLink] = useState({ label: "", url: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addLink = () => {
    if (newLink.label && newLink.url) {
      setLinks((prev) => [...prev, newLink])
      setNewLink({ label: "", url: "" })
    }
  }

  const removeLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (authError) {
      setError(authError.message)
      setIsLoading(false)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        name: formData.name,
        company: formData.company,
        location: formData.location,
        bio: formData.bio,
        links: links,
      })

      if (profileError) {
        setError(profileError.message)
        setIsLoading(false)
      } else {
        router.push("/profile")
      }
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
          <div className="text-[#00FFB3] font-mono text-lg">register</div>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[#778899] font-mono text-sm lowercase">email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-transparent border-[#778899] text-[#00FFB3] font-mono text-sm focus:border-[#00FFB3]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#778899] font-mono text-sm lowercase">password</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="bg-transparent border-[#778899] text-[#00FFB3] font-mono text-sm focus:border-[#00FFB3]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#778899] font-mono text-sm lowercase">name</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-transparent border-[#778899] text-[#00FFB3] font-mono text-sm focus:border-[#00FFB3]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#778899] font-mono text-sm lowercase">company</Label>
            <Input
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              className="bg-transparent border-[#778899] text-[#00FFB3] font-mono text-sm focus:border-[#00FFB3]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#778899] font-mono text-sm lowercase">location</Label>
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="bg-transparent border-[#778899] text-[#00FFB3] font-mono text-sm focus:border-[#00FFB3]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#778899] font-mono text-sm lowercase">bio</Label>
            <Textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="bg-transparent border-[#778899] text-[#00FFB3] font-mono text-sm focus:border-[#00FFB3] resize-none"
              rows={3}
            />
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <Label className="text-[#778899] font-mono text-sm lowercase">links</Label>

            {links.map((link, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border border-[#778899] rounded">
                <div className="flex-1 text-[#00FFB3] font-mono text-sm">
                  {link.label}: <span className="text-[#39FF14]">{link.url}</span>
                </div>
                <Button
                  type="button"
                  onClick={() => removeLink(index)}
                  variant="ghost"
                  size="sm"
                  className="text-[#D891EF] hover:text-[#D891EF]/80 p-1"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}

            <div className="flex gap-2">
              <Input
                placeholder="label"
                value={newLink.label}
                onChange={(e) => setNewLink((prev) => ({ ...prev, label: e.target.value }))}
                className="bg-transparent border-[#778899] text-[#00FFB3] font-mono text-sm focus:border-[#00FFB3]"
              />
              <Input
                placeholder="https://..."
                value={newLink.url}
                onChange={(e) => setNewLink((prev) => ({ ...prev, url: e.target.value }))}
                className="bg-transparent border-[#778899] text-[#00FFB3] font-mono text-sm focus:border-[#00FFB3]"
              />
              <Button
                type="button"
                onClick={addLink}
                variant="ghost"
                size="sm"
                className="text-[#00FFB3] hover:text-[#00FFB3]/80"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {error && <div className="text-[#D891EF] font-mono text-xs p-2 border border-[#D891EF] rounded">{error}</div>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00FFB3] text-[#000D0D] hover:bg-[#00FFB3]/90 font-mono text-sm lowercase"
          >
            {isLoading ? "creating account..." : "register"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            onClick={() => router.push("/login")}
            variant="link"
            className="text-[#778899] hover:text-[#D891EF] font-mono text-sm lowercase"
          >
            already have an account? login
          </Button>
        </div>
      </div>
    </div>
  )
}
