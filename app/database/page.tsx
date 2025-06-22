"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Search, Edit } from "lucide-react"

interface Connection {
  id: string
  name: string
  company: string
  event_name: string
  met_at: string
  tags: string[]
  notes: string
  paths_crossed: number
}

export default function DatabasePage() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchConnections()
  }, [])

  useEffect(() => {
    filterConnections()
  }, [connections, searchTerm, selectedFilter])

  const fetchConnections = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      router.push("/")
      return
    }

    // This would fetch actual connections from the database
    // For now, using mock data
    const mockConnections: Connection[] = [
      {
        id: "1",
        name: "alex chen",
        company: "startup inc",
        event_name: "tech meetup #42",
        met_at: "2024-01-15",
        tags: ["developer", "ai"],
        notes: "working on ml projects, interested in collaboration",
        paths_crossed: 3,
      },
      {
        id: "2",
        name: "sarah kim",
        company: "design co",
        event_name: "ux conference",
        met_at: "2024-01-10",
        tags: ["designer", "ux"],
        notes: "great insights on user research",
        paths_crossed: 1,
      },
    ]

    setConnections(mockConnections)
    setIsLoading(false)
  }

  const filterConnections = () => {
    let filtered = connections

    if (searchTerm) {
      filtered = filtered.filter(
        (conn) =>
          conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conn.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conn.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conn.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedFilter !== "all") {
      filtered = filtered.filter((conn) => conn.tags.includes(selectedFilter))
    }

    setFilteredConnections(filtered)
  }

  const allTags = Array.from(new Set(connections.flatMap((conn) => conn.tags)))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000D0D] flex items-center justify-center">
        <div className="text-[#00FFB3] font-mono text-sm">loading database...</div>
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
          <div className="text-[#00FFB3] font-mono text-lg">database</div>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#778899]" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="search connections..."
              className="pl-10 bg-transparent border-[#778899] text-[#00FFB3] font-mono text-sm focus:border-[#00FFB3]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            <Button
              onClick={() => setSelectedFilter("all")}
              variant={selectedFilter === "all" ? "default" : "outline"}
              size="sm"
              className={`font-mono text-xs lowercase whitespace-nowrap ${
                selectedFilter === "all"
                  ? "bg-[#00FFB3] text-[#000D0D]"
                  : "bg-transparent border-[#778899] text-[#778899] hover:border-[#00FFB3] hover:text-[#00FFB3]"
              }`}
            >
              all ({connections.length})
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                onClick={() => setSelectedFilter(tag)}
                variant={selectedFilter === tag ? "default" : "outline"}
                size="sm"
                className={`font-mono text-xs lowercase whitespace-nowrap ${
                  selectedFilter === tag
                    ? "bg-[#00FFB3] text-[#000D0D]"
                    : "bg-transparent border-[#778899] text-[#778899] hover:border-[#00FFB3] hover:text-[#00FFB3]"
                }`}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Connections List */}
        <div className="space-y-4">
          {filteredConnections.length === 0 ? (
            <div className="text-center text-[#778899] font-mono text-sm py-8">
              {searchTerm || selectedFilter !== "all" ? "no matches found" : "no connections yet"}
            </div>
          ) : (
            filteredConnections.map((connection) => (
              <div key={connection.id} className="border border-[#778899] rounded p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="text-[#00FFB3] font-mono text-sm font-medium">{connection.name}</div>
                    <div className="text-[#778899] font-mono text-xs">{connection.company}</div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#D891EF] hover:text-[#D891EF]/80 p-1">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="text-[#778899] font-mono text-xs">
                    met at: <span className="text-[#00FFB3]">{connection.event_name}</span>
                  </div>
                  <div className="text-[#778899] font-mono text-xs">
                    date: {new Date(connection.met_at).toLocaleDateString()}
                  </div>
                  <div className="text-[#778899] font-mono text-xs">
                    paths crossed: <span className="text-[#D891EF]">{connection.paths_crossed}</span>
                  </div>
                </div>

                {connection.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {connection.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#00FFB3]/10 border border-[#00FFB3] text-[#00FFB3] font-mono text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {connection.notes && (
                  <div className="text-[#00FFB3] font-mono text-xs leading-relaxed">{connection.notes}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
