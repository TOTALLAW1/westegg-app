"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Users, Plus, MessageCircle } from "lucide-react"

interface Event {
  id: string
  name: string
  description: string
  created_at: string
  created_by: string
}

interface Attendee {
  id: string
  name: string
  company: string
  bio: string
  paths_crossed: number
  is_connected: boolean
}

export default function EventPage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    if (params.id) {
      fetchEventData(params.id as string)
    }
  }, [params.id])

  const fetchEventData = async (eventId: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      router.push("/")
      return
    }

    // Fetch event details
    const { data: eventData, error: eventError } = await supabase.from("events").select("*").eq("id", eventId).single()

    if (eventError) {
      console.error("Error fetching event:", eventError)
      setIsLoading(false)
      return
    }

    setEvent(eventData)

    // Mock attendees data - in real app, this would join checkins with profiles
    const mockAttendees: Attendee[] = [
      {
        id: "1",
        name: "alex chen",
        company: "startup inc",
        bio: "full-stack developer passionate about ai and machine learning",
        paths_crossed: 0,
        is_connected: false,
      },
      {
        id: "2",
        name: "sarah kim",
        company: "design co",
        bio: "ux designer focused on accessibility and inclusive design",
        paths_crossed: 2,
        is_connected: true,
      },
      {
        id: "3",
        name: "mike johnson",
        company: "tech corp",
        bio: "product manager building developer tools",
        paths_crossed: 1,
        is_connected: false,
      },
    ]

    setAttendees(mockAttendees)
    setIsLoading(false)
  }

  const handleConnectionRequest = async (attendeeId: string) => {
    // In real app, this would create a connection request
    console.log("Sending connection request to:", attendeeId)

    // Update local state to show request sent
    setAttendees((prev) =>
      prev.map((attendee) => (attendee.id === attendeeId ? { ...attendee, is_connected: true } : attendee)),
    )
  }

  const handleAddPeople = () => {
    router.push(`/events/${params.id}/add-connection`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000D0D] flex items-center justify-center">
        <div className="text-[#00FFB3] font-mono text-sm">loading event...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#000D0D] flex items-center justify-center">
        <div className="text-[#D891EF] font-mono text-sm">event not found</div>
      </div>
    )
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
          <div className="text-[#00FFB3] font-mono text-lg">event</div>
        </div>

        {/* Event Info */}
        <div className="border border-[#778899] rounded p-4 mb-6 space-y-3">
          <div className="text-[#00FFB3] font-mono text-lg">{event.name}</div>
          {event.description && <div className="text-[#778899] font-mono text-sm">{event.description}</div>}
          <div className="text-[#778899] font-mono text-xs">
            {new Date(event.created_at).toLocaleDateString()} • {new Date(event.created_at).toLocaleTimeString()}
          </div>
          <div className="flex items-center gap-2 text-[#778899] font-mono text-xs">
            <Users className="h-3 w-3" />
            <span>{attendees.length} attendees</span>
          </div>
        </div>

        {/* Add People Button */}
        <Button
          onClick={handleAddPeople}
          className="w-full mb-6 bg-transparent border border-[#D891EF] text-[#D891EF] hover:bg-[#D891EF] hover:text-[#000D0D] font-mono text-sm lowercase"
        >
          <Plus className="h-4 w-4 mr-2" />
          add people i met
        </Button>

        {/* Attendees List */}
        <div className="space-y-4">
          <div className="text-[#778899] font-mono text-sm">attendees</div>

          {attendees.map((attendee) => (
            <div key={attendee.id} className="border border-[#778899] rounded p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="text-[#00FFB3] font-mono text-sm font-medium">{attendee.name}</div>
                  <div className="text-[#778899] font-mono text-xs">{attendee.company}</div>
                  {attendee.paths_crossed > 0 && (
                    <div className="text-[#D891EF] font-mono text-xs">paths crossed: {attendee.paths_crossed}</div>
                  )}
                </div>

                <div className="flex gap-2">
                  {attendee.is_connected ? (
                    <Button
                      size="sm"
                      className="bg-[#39FF14] text-[#000D0D] hover:bg-[#39FF14]/90 font-mono text-xs lowercase"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      dm
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleConnectionRequest(attendee.id)}
                      size="sm"
                      className="bg-transparent border border-[#00FFB3] text-[#00FFB3] hover:bg-[#00FFB3] hover:text-[#000D0D] font-mono text-xs lowercase"
                    >
                      connect
                    </Button>
                  )}
                </div>
              </div>

              <div className="text-[#00FFB3] font-mono text-xs leading-relaxed">{attendee.bio}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
