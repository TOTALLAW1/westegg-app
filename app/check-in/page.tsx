"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, MapPin, Clock } from "lucide-react"

export default function CheckInPage() {
  const [eventName, setEventName] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [nearbyEvents, setNearbyEvents] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          fetchNearbyEvents(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          setLocationError("location access denied. check-in will use approximate location.")
        },
      )
    } else {
      setLocationError("geolocation not supported by this browser.")
    }
  }, [])

  const fetchNearbyEvents = async (lat: number, lng: number) => {
    // Fetch events within ~1km radius from the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase.from("events").select("*").gte("created_at", oneDayAgo).limit(5)

    if (!error && data) {
      // Filter by approximate distance (simplified)
      const nearby = data.filter((event) => {
        if (!event.latitude || !event.longitude) return false
        const distance = Math.sqrt(Math.pow(event.latitude - lat, 2) + Math.pow(event.longitude - lng, 2))
        return distance < 0.01 // Roughly 1km
      })
      setNearbyEvents(nearby)
    }
  }

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      router.push("/")
      return
    }

    const eventData = {
      name: eventName,
      description: description,
      latitude: location?.lat || null,
      longitude: location?.lng || null,
      created_by: session.user.id,
      created_at: new Date().toISOString(),
    }

    const { data: event, error: eventError } = await supabase.from("events").insert(eventData).select().single()

    if (eventError) {
      console.error("Error creating event:", eventError)
      setIsLoading(false)
      return
    }

    // Create check-in record
    const { error: checkinError } = await supabase.from("checkins").insert({
      event_id: event.id,
      user_id: session.user.id,
      checked_in_at: new Date().toISOString(),
    })

    if (checkinError) {
      console.error("Error creating check-in:", checkinError)
    } else {
      router.push(`/events/${event.id}`)
    }
    setIsLoading(false)
  }

  const handleJoinEvent = async (eventId: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return

    const { error } = await supabase.from("checkins").insert({
      event_id: eventId,
      user_id: session.user.id,
      checked_in_at: new Date().toISOString(),
    })

    if (!error) {
      router.push(`/events/${eventId}`)
    }
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
          <div className="text-[#00FFB3] font-mono text-lg">check-in</div>
        </div>

        {/* Location Status */}
        <div className="mb-6 p-3 border border-[#778899] rounded">
          <div className="flex items-center gap-2 text-[#778899] font-mono text-sm">
            <MapPin className="h-4 w-4" />
            {location ? <span>location acquired</span> : <span>{locationError || "acquiring location..."}</span>}
          </div>
          <div className="flex items-center gap-2 text-[#778899] font-mono text-sm mt-1">
            <Clock className="h-4 w-4" />
            <span>{new Date().toLocaleString()}</span>
          </div>
        </div>

        {/* Nearby Events */}
        {nearbyEvents.length > 0 && (
          <div className="mb-6">
            <div className="text-[#778899] font-mono text-sm mb-3">nearby events</div>
            <div className="space-y-2">
              {nearbyEvents.map((event) => (
                <div key={event.id} className="p-3 border border-[#D891EF] rounded">
                  <div className="text-[#00FFB3] font-mono text-sm">{event.name}</div>
                  {event.description && (
                    <div className="text-[#778899] font-mono text-xs mt-1">{event.description}</div>
                  )}
                  <Button
                    onClick={() => handleJoinEvent(event.id)}
                    className="mt-2 bg-transparent border border-[#D891EF] text-[#D891EF] hover:bg-[#D891EF] hover:text-[#000D0D] font-mono text-xs lowercase"
                    size="sm"
                  >
                    join this event
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Check-in Form */}
        <form onSubmit={handleCheckIn} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[#778899] font-mono text-sm lowercase">event name</Label>
            <Input
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="tech meetup, conference, networking event..."
              className="bg-transparent border-[#778899] text-[#00FFB3] font-mono text-sm focus:border-[#00FFB3]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#778899] font-mono text-sm lowercase">description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="additional details about the event..."
              className="bg-transparent border-[#778899] text-[#00FFB3] font-mono text-sm focus:border-[#00FFB3] resize-none"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !eventName.trim()}
            className="w-full bg-[#00FFB3] text-[#000D0D] hover:bg-[#00FFB3]/90 font-mono text-sm lowercase"
          >
            {isLoading ? "checking in..." : "check-in to event"}
          </Button>
        </form>

        <div className="mt-6 text-center text-[#778899] font-mono text-xs">
          your check-in creates a private event space for attendees to connect
        </div>
      </div>
    </div>
  )
}
