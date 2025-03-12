"use client";

import { BookOpen, Edit, PenTool, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ProfileView = "profile" | "my-stories" | "collaborations" | "create-story"

interface ProfileSidebarProps {
  currentView: ProfileView
  setCurrentView: (view: ProfileView) => void
}

export default function ProfileSidebar({ currentView, setCurrentView }: ProfileSidebarProps) {
  const menuItems = [
    {
      id: "profile",
      label: "Profile Information",
      icon: User,
    },
    {
      id: "my-stories",
      label: "My Stories",
      icon: BookOpen,
    },
    {
      id: "collaborations",
      label: "Collaborations",
      icon: Edit,
    },
    {
      id: "create-story",
      label: "Create New Story",
      icon: PenTool,
    },
  ]

  return (
    <Card className="w-full md:w-64 shrink-0 mb-6 md:mb-0 sticky top-24 h-fit">
      <div className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              currentView === item.id ? "bg-purple-600 hover:bg-purple-700" : "",
            )}
            onClick={() => setCurrentView(item.id as ProfileView)}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  )
}

