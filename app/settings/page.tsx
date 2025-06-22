"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    eventNotifications: true,
    connectionRequests: true,
    locationSharing: true,
    emailUpdates: false,
  })
  const router = useRouter()

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Save settings to database
    console.log("Saving settings:", settings)
  }

  return (
    <div className="min-h-screen bg-[#000D0D] p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => router.push("/profile")}
            variant="ghost"
            size="sm"
            className="text-[#778899] hover:text-[#00FFB3] p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="text-[#00FFB3] font-mono text-lg">settings</div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Privacy */}
          <div className="space-y-4">
            <div className="text-[#778899] font-mono text-sm uppercase tracking-wide">privacy</div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-[#778899] rounded">
                <div className="space-y-1">
                  <Label className="text-[#00FFB3] font-mono text-sm">profile visibility</Label>
                  <div className="text-[#778899] font-mono text-xs">allow others to find your profile</div>
                </div>
                <Switch
                  checked={settings.profileVisibility}
                  onCheckedChange={(value) => handleSettingChange("profileVisibility", value)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-[#778899] rounded">
                <div className="space-y-1">
                  <Label className="text-[#00FFB3] font-mono text-sm">location sharing</Label>
                  <div className="text-[#778899] font-mono text-xs">share approximate location for event matching</div>
                </div>
                <Switch
                  checked={settings.locationSharing}
                  onCheckedChange={(value) => handleSettingChange("locationSharing", value)}
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <div className="text-[#778899] font-mono text-sm uppercase tracking-wide">notifications</div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-[#778899] rounded">
                <div className="space-y-1">
                  <Label className="text-[#00FFB3] font-mono text-sm">event notifications</Label>
                  <div className="text-[#778899] font-mono text-xs">notify when new events are detected nearby</div>
                </div>
                <Switch
                  checked={settings.eventNotifications}
                  onCheckedChange={(value) => handleSettingChange("eventNotifications", value)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-[#778899] rounded">
                <div className="space-y-1">
                  <Label className="text-[#00FFB3] font-mono text-sm">connection requests</Label>
                  <div className="text-[#778899] font-mono text-xs">notify when someone wants to connect</div>
                </div>
                <Switch
                  checked={settings.connectionRequests}
                  onCheckedChange={(value) => handleSettingChange("connectionRequests", value)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-[#778899] rounded">
                <div className="space-y-1">
                  <Label className="text-[#00FFB3] font-mono text-sm">email updates</Label>
                  <div className="text-[#778899] font-mono text-xs">receive weekly connection summaries</div>
                </div>
                <Switch
                  checked={settings.emailUpdates}
                  onCheckedChange={(value) => handleSettingChange("emailUpdates", value)}
                />
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="space-y-4">
            <div className="text-[#778899] font-mono text-sm uppercase tracking-wide">data</div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full bg-transparent border-[#778899] text-[#778899] hover:border-[#00FFB3] hover:text-[#00FFB3] font-mono text-sm lowercase"
              >
                export my data
              </Button>

              <Button
                variant="outline"
                className="w-full bg-transparent border-[#D891EF] text-[#D891EF] hover:border-[#D891EF] hover:bg-[#D891EF] hover:text-[#000D0D] font-mono text-sm lowercase"
              >
                delete account
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full bg-[#00FFB3] text-[#000D0D] hover:bg-[#00FFB3]/90 font-mono text-sm lowercase"
          >
            save settings
          </Button>
        </div>
      </div>
    </div>
  )
}
